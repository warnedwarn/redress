'use client';

import { motion } from 'framer-motion';
import { Gavel, Scale } from 'lucide-react';
import type { Case } from '@/lib/contract';
import { shortAddr, rulingColor, rulingBorder, rulingLabel } from '@/lib/format';

export function CaseCard({
  item,
  fresh,
  pending,
  onRespond,
}: {
  item: Case;
  fresh?: boolean;
  pending?: boolean;
  onRespond?: (c: Case) => void;
}) {
  const ruled = item.status === 'RULED';
  const accent = ruled ? rulingColor[item.ruling] ?? 'text-sand' : 'text-terra';
  const frame = ruled ? rulingBorder[item.ruling] ?? 'border-cream/15' : 'border-cream/15';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col border bg-ink-800 p-6 transition-colors hover:border-cream/30 ${
        fresh ? 'animate-flashrule' : frame
      } ${pending ? 'border-dashed opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-taupe">{item.id}</span>
        {ruled ? (
          <span className={`kicker ${accent}`}>{rulingLabel[item.ruling]}</span>
        ) : (
          <span className="kicker animate-pulsechip text-terra">Awaiting answer</span>
        )}
      </div>

      <h3 className="mt-3 font-display text-xl font-500 leading-snug text-cream">{item.title}</h3>

      <div className="mt-3 flex items-center gap-2 font-mono text-xs text-taupe">
        <Scale size={13} className="text-terra" />
        <span className="smallcaps">Remedy sought:</span> {item.remedy}
      </div>

      <div className="mt-4 border-t border-cream/10 pt-3">
        <p className="kicker text-taupe">Grievance</p>
        <p className="mt-1 line-clamp-4 font-body text-sm leading-relaxed text-sand">{item.grievance}</p>
      </div>

      {ruled && (
        <>
          <div className="mt-4 border-t border-cream/10 pt-3">
            <p className="kicker text-taupe">Defense</p>
            <p className="mt-1 line-clamp-3 font-body text-sm leading-relaxed text-sand">{item.defense}</p>
          </div>
          <div className="mt-4 flex items-stretch gap-4 border-t border-cream/10 pt-4">
            <div className="shrink-0 text-center">
              <div className={`tabular font-display text-4xl font-500 ${accent}`}>{item.fault}</div>
              <div className="kicker mt-1 text-taupe">fault</div>
            </div>
            <div className="border-l border-cream/10 pl-4">
              <p className="kicker text-taupe">Opinion</p>
              <p className="mt-1 font-body text-sm italic leading-relaxed text-cream/85">{item.opinion}</p>
            </div>
          </div>
        </>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-3 font-mono text-xs text-taupe">
        <span>claimant {shortAddr(item.claimant)}</span>
        {ruled ? (
          <span>respondent {shortAddr(item.respondent)}</span>
        ) : (
          onRespond && (
            <button
              type="button"
              onClick={() => onRespond(item)}
              className="focus-ring flex items-center gap-1.5 bg-terra px-3 py-1.5 font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
            >
              <Gavel size={13} /> Respond
            </button>
          )
        )}
      </div>

      {pending && (
        <span className="absolute -top-3 left-4 animate-pulsechip border border-split bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-split">
          Pending
        </span>
      )}
    </motion.article>
  );
}
