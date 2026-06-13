'use client';

import { Scale, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

export function Footer() {
  return (
    <footer className="border-t border-cream/15 bg-ink-800">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Colophon masthead: oversized wordmark spanning the width */}
        <div className="flex items-end justify-between gap-6 border-b border-cream/15 pb-6">
          <span className="flex items-baseline gap-3 font-display text-5xl font-500 italic text-cream sm:text-6xl">
            <Scale size={34} className="self-center text-terra" /> Redress
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-taupe sm:block">
            Filed on GenLayer Bradbury
          </span>
        </div>

        {/* One flowing line of links, newspaper-style, separated by rules */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-sm text-sand">
          <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-terra">
            Bradbury faucet <ExternalLink size={12} />
          </a>
          <span className="text-cream/20">/</span>
          <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-terra">
            GenLayer docs <ExternalLink size={12} />
          </a>
          <span className="text-cream/20">/</span>
          <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-terra">
            Block explorer <ExternalLink size={12} />
          </a>
        </div>

        {/* Contract + deploy presented as a court record line */}
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs text-taupe">
          <span className="flex items-center gap-2">
            <span className="smallcaps text-cream/50">Contract of record</span>
            <a href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-sand hover:text-terra">
              {shortAddr(CONTRACT_ADDRESS)}
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
          </span>
          <span className="flex items-center gap-2">
            <span className="smallcaps text-cream/50">Empaneled by</span>
            <a href={`${EXPLORER}/tx/${DEPLOY_TX}`} target="_blank" rel="noopener noreferrer" className="text-sand hover:text-terra">
              {shortHash(DEPLOY_TX)}
            </a>
            <CopyButton value={DEPLOY_TX} label="Copy deploy tx" />
          </span>
        </div>

        <p className="mt-8 max-w-2xl font-body text-sm leading-relaxed text-taupe">
          An on-chain small-claims court. Two-party disputes settled by an AI magistrate under
          GenLayer validator consensus. No deposits, no custody, no backend. The magistrate is an AI
          ruling under validator consensus, not a court of law and not legal advice.
        </p>
      </div>
    </footer>
  );
}
