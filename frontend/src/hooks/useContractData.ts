'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCases, fetchStats, type Case, type Stats } from '@/lib/contract';

const POLL_MS = 95000;

export interface ContractData {
  cases: Case[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  derived: { total: number; open: number; ruled: number; upheld: number; split: number; dismissed: number };
  refresh: () => Promise<void>;
  setTxInFlight: (v: boolean) => void;
}

export function useContractData(): ContractData {
  const [cases, setCases] = useState<Case[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const txInFlight = useRef(false);
  const alive = useRef(true);

  const loadAll = useCallback(async () => {
    try {
      const all: Case[] = [];
      let start = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchCases(start);
        all.push(...page);
        if (page.length < 20) break;
        start += 20;
      }
      const s = await fetchStats();
      if (!alive.current) return;
      setCases(all);
      setStats(s);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      const msg = String(e);
      if (/contract not found|execution reverted/i.test(msg)) {
        setError('No contract responded at the configured address on Bradbury. The deployment may need repair.');
      } else {
        setError('Could not reach the contract.');
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const setTxInFlight = useCallback((v: boolean) => {
    txInFlight.current = v;
  }, []);

  useEffect(() => {
    alive.current = true;
    loadAll();
    const id = setInterval(() => {
      if (!txInFlight.current) loadAll();
    }, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [loadAll]);

  const derived = useMemo(() => {
    const ruled = cases.filter((c) => c.status === 'RULED');
    return {
      total: cases.length,
      open: cases.filter((c) => c.status === 'OPEN').length,
      ruled: ruled.length,
      upheld: ruled.filter((c) => c.ruling === 'UPHELD').length,
      split: ruled.filter((c) => c.ruling === 'SPLIT').length,
      dismissed: ruled.filter((c) => c.ruling === 'DISMISSED').length,
    };
  }, [cases]);

  return { cases, stats, loading, error, derived, refresh, setTxInFlight };
}
