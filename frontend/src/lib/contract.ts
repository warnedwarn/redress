import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import type { GenLayerClient } from 'genlayer-js/types';

export const CONTRACT_ADDRESS = '0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F' as const;
export const DEPLOY_TX =
  '0x45a24c4dc08acd41f7323a32ab392e02f792abab5b559e36ccdec511b5446d08' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const CHAIN_ID = 4221;

export type Ruling = 'UPHELD' | 'DISMISSED' | 'SPLIT' | '';

export interface Case {
  id: string;
  title: string;
  remedy: string;
  grievance: string;
  claimant: string;
  respondent: string;
  defense: string;
  status: 'OPEN' | 'RULED';
  ruling: Ruling;
  fault: number;
  opinion: string;
  index: number;
}

export interface Stats {
  cases: number;
  ruled: number;
  upheld: number;
  owner: string;
}

export const readClient: GenLayerClient<typeof testnetBradbury> = createClient({
  chain: testnetBradbury,
});

export function makeWalletClient(account: `0x${string}`) {
  return createClient({ chain: testnetBradbury, account } as Parameters<typeof createClient>[0]);
}

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|-32/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function pick(raw: unknown, k: string): unknown {
  if (raw instanceof Map) return raw.get(k);
  if (raw && typeof raw === 'object') return (raw as Record<string, unknown>)[k];
  return undefined;
}

function normalizeCase(raw: unknown): Case {
  const r = String(pick(raw, 'ruling') ?? '').toUpperCase();
  const status = String(pick(raw, 'status') ?? 'OPEN').toUpperCase();
  return {
    id: String(pick(raw, 'id') ?? ''),
    title: String(pick(raw, 'title') ?? ''),
    remedy: String(pick(raw, 'remedy') ?? ''),
    grievance: String(pick(raw, 'grievance') ?? ''),
    claimant: String(pick(raw, 'claimant') ?? ''),
    respondent: String(pick(raw, 'respondent') ?? ''),
    defense: String(pick(raw, 'defense') ?? ''),
    status: status === 'RULED' ? 'RULED' : 'OPEN',
    ruling: (['UPHELD', 'DISMISSED', 'SPLIT'].includes(r) ? r : '') as Ruling,
    fault: Number(pick(raw, 'fault') ?? 0),
    opinion: String(pick(raw, 'opinion') ?? ''),
    index: Number(pick(raw, 'index') ?? 0),
  };
}

function normalizeStats(raw: unknown): Stats {
  return {
    cases: Number(pick(raw, 'cases') ?? 0),
    ruled: Number(pick(raw, 'ruled') ?? 0),
    upheld: Number(pick(raw, 'upheld') ?? 0),
    owner: String(pick(raw, 'owner') ?? ''),
  };
}

export async function fetchCases(start = 0): Promise<Case[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_cases', args: [start] }),
  );
  return Array.isArray(res) ? res.map(normalizeCase) : [];
}

export async function fetchStats(): Promise<Stats> {
  const res = await withRpcRetry(() =>
    readClient.readContract({ address: CONTRACT_ADDRESS, functionName: 'get_stats', args: [] }),
  );
  return normalizeStats(res);
}

export async function fileGrievance(
  client: ReturnType<typeof makeWalletClient>,
  title: string,
  remedy: string,
  grievance: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'file_grievance',
    args: [title, remedy, grievance],
    value: 0n,
  }) as Promise<`0x${string}`>;
}

export async function fileDefense(
  client: ReturnType<typeof makeWalletClient>,
  caseId: string,
  defense: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'file_defense',
    args: [caseId, defense],
    value: 0n,
  }) as Promise<`0x${string}`>;
}
