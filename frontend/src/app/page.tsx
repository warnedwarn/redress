'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileStack } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { CaseCard } from '@/components/CaseCard';
import { Skeleton, EmptyState, ErrorState } from '@/components/States';
import { CaseModal, type ModalMode } from '@/components/CaseModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Case } from '@/lib/contract';

type Filter = 'ALL' | 'OPEN' | 'UPHELD' | 'SPLIT' | 'DISMISSED';

function Court() {
  const wallet = useWallet();
  const data = useContractData();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('file');
  const [target, setTarget] = useState<Case | null>(null);
  const [filter, setFilter] = useState<Filter>('ALL');
  const txApi = useTransaction(() => {
    void data.refresh();
  });

  const openFile = () => {
    setMode('file');
    setTarget(null);
    setModalOpen(true);
  };
  const openDefend = (c: Case) => {
    setMode('defend');
    setTarget(c);
    setModalOpen(true);
  };

  const filtered = useMemo(() => {
    const list = [...data.cases].sort((a, b) => b.index - a.index);
    if (filter === 'ALL') return list;
    if (filter === 'OPEN') return list.filter((c) => c.status === 'OPEN');
    return list.filter((c) => c.status === 'RULED' && c.ruling === filter);
  }, [data.cases, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'ALL', label: `All ${data.derived.total}` },
    { key: 'OPEN', label: `Open ${data.derived.open}` },
    { key: 'UPHELD', label: `Upheld ${data.derived.upheld}` },
    { key: 'SPLIT', label: `Split ${data.derived.split}` },
    { key: 'DISMISSED', label: `Dismissed ${data.derived.dismissed}` },
  ];

  return (
    <>
      <Header wallet={wallet} onFile={openFile} />
      <main>
        <Hero onFile={openFile} stats={data.derived} />
        <HowItWorks />

        {/* DOCKET */}
        <section id="docket" className="border-t border-cream/15 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="kicker flex items-center gap-2 text-terra">
                  <FileStack size={14} /> The docket
                </span>
                <h2 className="mt-3 font-display text-5xl font-500 italic tracking-tight text-cream sm:text-6xl">
                  Cases of record
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`focus-ring border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                      filter === f.key ? 'border-terra bg-terra text-ink' : 'border-cream/20 text-sand hover:border-cream/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 rule" />

            <div className="mt-10">
              {data.loading ? (
                <Skeleton />
              ) : data.error ? (
                <ErrorState message={data.error} onRetry={() => data.refresh()} />
              ) : data.cases.length === 0 ? (
                <EmptyState onFile={openFile} />
              ) : filtered.length === 0 ? (
                <div className="border border-dashed border-cream/20 bg-ink-800 px-6 py-14 text-center font-body text-sand">
                  No cases match this filter yet.
                </div>
              ) : (
                <motion.div layout className="grid gap-6 md:grid-cols-2">
                  {filtered.map((c) => (
                    <CaseCard key={c.id} item={c} onRespond={openDefend} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-y border-cream/15 py-10 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-3xl font-500 italic text-cream">Have a dispute to settle?</h3>
                <p className="mt-2 font-body text-sand">
                  File it, let the other side answer, and let consensus decide. No deposits, no custody.
                </p>
              </div>
              <button
                type="button"
                onClick={openFile}
                className="focus-ring flex shrink-0 items-center gap-2 bg-terra px-7 py-4 font-mono text-sm font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
              >
                <Scale size={18} /> File a case
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CaseModal
        open={modalOpen}
        mode={mode}
        target={target}
        onClose={() => setModalOpen(false)}
        address={wallet.address}
        chainOk={wallet.chainOk}
        onConnect={wallet.connect}
        txApi={txApi}
        setTxInFlight={data.setTxInFlight}
      />
    </>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Court />
    </ToastProvider>
  );
}
