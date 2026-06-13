'use client';

import { motion } from 'framer-motion';
import { Gavel, Loader2 } from 'lucide-react';
import type { TxState } from '@/hooks/useTransaction';
import { rulingColor, rulingLabel } from '@/lib/format';

const STAGE_ORDER = ['SUBMITTED', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED'];

function stageIndex(status: string): number {
  if (status === 'PENDING' || status === '') return 0;
  if (status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT') return 1;
  const i = STAGE_ORDER.indexOf(status);
  return i < 0 ? 1 : i;
}

const STAGES = [
  { key: 'SUBMITTED', label: 'Filed with the clerk', note: 'Transaction broadcast to Bradbury' },
  { key: 'PROPOSING', label: 'Magistrate drafting', note: 'Leader weighs both sides' },
  { key: 'COMMITTING', label: 'Panel re-hearing', note: 'Each validator re-runs the ruling' },
  { key: 'REVEALING', label: 'Votes revealed', note: 'Independent verdicts compared' },
  { key: 'ACCEPTED', label: 'Entered on the docket', note: 'Judgment written under consensus' },
];

export function ConsensusStage({ tx }: { tx: TxState }) {
  const idx = stageIndex(tx.liveStatus);
  const rotating = tx.liveStatus === 'LEADER_TIMEOUT' || tx.liveStatus === 'VALIDATORS_TIMEOUT';
  const draft = tx.draft;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <motion.span
          className="absolute h-px w-28 bg-terra/40"
          style={{ top: '50%' }}
          animate={{ scaleX: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <motion.div animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
          <Gavel size={48} className="text-terra" />
        </motion.div>
      </div>

      <p className="kicker mt-6 text-terra">
        {rotating ? 'Rotating leader, still in session' : 'The court is in session'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-500 italic text-cream">The magistrate deliberates</h3>
      <p className="mt-2 max-w-md font-body text-sm text-sand">
        An AI write on Bradbury takes one to five minutes. The panel is re-hearing the case
        independently. This page updates live.
      </p>

      <div className="mt-8 w-full max-w-md divide-y divide-cream/10 border-y border-cream/15">
        {STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={s.key} className={`flex items-center gap-3 py-3 text-left ${active ? 'bg-terra/5' : ''}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-xs ${
                  done ? 'border-upheld text-upheld' : active ? 'border-terra text-terra' : 'border-cream/20 text-taupe'
                }`}
              >
                {active ? <Loader2 size={13} className="animate-spin" /> : done ? '\u2713' : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`font-mono text-xs uppercase tracking-wider ${done || active ? 'text-cream' : 'text-taupe'}`}>
                  {s.label}
                </p>
                <p className="font-body text-xs text-taupe">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-md border border-dashed border-terra/40 bg-ink-800 p-4 text-left"
        >
          <p className="kicker text-taupe">Draft ruling, sealing under consensus</p>
          <div className="mt-2 flex items-center justify-between">
            <span className={`font-mono text-sm font-600 uppercase ${rulingColor[draft.ruling] ?? 'text-cream'}`}>
              {rulingLabel[draft.ruling] ?? draft.ruling}
            </span>
            {typeof draft.fault === 'number' && (
              <span className={`tabular font-display text-3xl font-500 ${rulingColor[draft.ruling] ?? 'text-cream'}`}>
                {draft.fault}
              </span>
            )}
          </div>
          {draft.opinion && <p className="mt-2 font-body text-sm italic text-cream/85">{draft.opinion}</p>}
        </motion.div>
      )}

      <p className="mt-6 font-mono text-xs text-taupe">
        Status: <span className="text-cream">{tx.liveStatus || 'PENDING'}</span>
      </p>
    </div>
  );
}
