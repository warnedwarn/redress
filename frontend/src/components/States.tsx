'use client';

import { Scale, RotateCw, TriangleAlert, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';

export function Skeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-cream/10 bg-ink-800 p-6">
          <div className="h-4 w-20 animate-pulse bg-cream/10" />
          <div className="mt-4 h-6 w-3/4 animate-pulse bg-cream/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse bg-cream/10" />
            <div className="h-3 w-5/6 animate-pulse bg-cream/10" />
            <div className="h-3 w-2/3 animate-pulse bg-cream/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onFile }: { onFile: () => void }) {
  return (
    <div className="flex flex-col items-center border border-dashed border-cream/20 bg-ink-800 px-6 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center border border-terra/50 bg-terra/5">
        <Scale size={30} className="text-terra" />
      </span>
      <h3 className="mt-6 font-display text-3xl font-500 italic text-cream">The docket is empty</h3>
      <p className="mt-3 max-w-md font-body text-sand">
        No cases have been filed yet. Open the first grievance and let the court take it up once the
        other side answers.
      </p>
      <button
        type="button"
        onClick={onFile}
        className="focus-ring mt-7 flex items-center gap-2 bg-terra px-6 py-3 font-mono text-sm font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
      >
        <Scale size={16} /> File the first case
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center border border-dismissed/40 bg-dismissed/5 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center border border-dismissed bg-ink">
        <TriangleAlert size={26} className="text-dismissed" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-500 italic text-cream">The clerk could not reach the docket</h3>
      <p className="mt-2 max-w-md font-body text-sm text-sand">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring flex items-center gap-2 bg-terra px-5 py-2.5 font-mono text-xs font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
        >
          <RotateCw size={14} /> Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 border border-cream/30 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-sand hover:text-cream"
        >
          Explorer <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
