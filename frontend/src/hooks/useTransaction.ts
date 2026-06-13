'use client';

import { useCallback, useRef, useState } from 'react';
import {
  makeWalletClient,
  fileGrievance,
  fileDefense,
  fetchCases,
  fetchStats,
  type Case,
} from '@/lib/contract';
import { pollUntilDecided, type LeaderDraft } from '@/lib/tx';

export type TxPhase = 'idle' | 'wallet' | 'submitted' | 'consensus' | 'confirmed' | 'error';
export type TxKind = 'file' | 'defend';

export interface TxState {
  phase: TxPhase;
  kind: TxKind | null;
  hash: `0x${string}` | null;
  liveStatus: string;
  draft: LeaderDraft | null;
  result: Case | null;
  error: string | null;
}

const INITIAL: TxState = {
  phase: 'idle',
  kind: null,
  hash: null,
  liveStatus: '',
  draft: null,
  result: null,
  error: null,
};

function friendlyError(e: unknown): string {
  const m = String(e);
  if (/LackOfFundForMaxFee/i.test(m))
    return 'Your wallet is below the fee reserve for AI transactions (mostly refunded). Top up at testnet-faucet.genlayer.foundation';
  if (/claimant cannot file the defense/i.test(m)) return 'The claimant cannot file the defense. Use a different wallet to respond';
  if (/reject|denied|4001/i.test(m)) return 'You cancelled the signature';
  if (/already ruled/i.test(m)) return 'This case has already been ruled';
  if (/rate limit|429|-32/i.test(m)) return 'The network is congested. Your transaction may still be processing';
  if (/fetch|network|timeout/i.test(m)) return 'Network error. Check your connection';
  return 'The transaction failed. Please try again';
}

export function useTransaction(onConfirmed?: () => void) {
  const [state, setState] = useState<TxState>(INITIAL);
  const busy = useRef(false);

  const reset = useCallback(() => {
    busy.current = false;
    setState(INITIAL);
  }, []);

  const run = useCallback(
    async (
      kind: TxKind,
      address: `0x${string}`,
      send: (client: ReturnType<typeof makeWalletClient>) => Promise<`0x${string}`>,
      targetId: string | null,
      onFlight?: (v: boolean) => void,
    ) => {
      if (busy.current) return;
      busy.current = true;
      onFlight?.(true);
      setState({ ...INITIAL, phase: 'wallet', kind });
      try {
        const client = makeWalletClient(address);
        const hash = await send(client);
        setState((s) => ({ ...s, phase: 'submitted', hash }));
        setState((s) => ({ ...s, phase: 'consensus', liveStatus: 'PENDING' }));

        const { status, draft } = await pollUntilDecided(client, hash, (st, dr) => {
          setState((s) => ({ ...s, liveStatus: st, draft: dr }));
        });

        if (status === 'UNDETERMINED' || status === 'CANCELED' || status === 'TIMEOUT') {
          setState((s) => ({
            ...s,
            phase: 'error',
            error:
              status === 'TIMEOUT'
                ? 'The network is congested. Your transaction is still being processed'
                : 'Validators could not reach consensus on this submission',
          }));
          busy.current = false;
          onFlight?.(false);
          return;
        }

        let result: Case | null = null;
        for (let i = 0; i < 5; i++) {
          try {
            const stats = await fetchStats();
            const page = await fetchCases(Math.max(0, Math.floor(Math.max(0, stats.cases - 1) / 20) * 20));
            if (targetId) result = page.find((c) => c.id === targetId) ?? null;
            else result = page.length ? page[page.length - 1] : null;
            if (result) break;
          } catch {
            /* retry */
          }
          await new Promise((r) => setTimeout(r, 6000));
        }

        setState((s) => ({ ...s, phase: 'confirmed', result }));
        busy.current = false;
        onFlight?.(false);
        onConfirmed?.();
      } catch (e) {
        setState((s) => ({ ...s, phase: 'error', error: friendlyError(e) }));
        busy.current = false;
        onFlight?.(false);
      }
    },
    [onConfirmed],
  );

  const submitFile = useCallback(
    (address: `0x${string}`, title: string, remedy: string, grievance: string, onFlight?: (v: boolean) => void) =>
      run('file', address, (c) => fileGrievance(c, title, remedy, grievance), null, onFlight),
    [run],
  );

  const submitDefend = useCallback(
    (address: `0x${string}`, caseId: string, defense: string, onFlight?: (v: boolean) => void) =>
      run('defend', address, (c) => fileDefense(c, caseId, defense), caseId, onFlight),
    [run],
  );

  return { state, submitFile, submitDefend, reset };
}
