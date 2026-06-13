'use client';

import { motion } from 'framer-motion';
import { Scale, ArrowDown } from 'lucide-react';
import { HalftoneCanvas } from './HalftoneCanvas';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  onFile: () => void;
  stats: { total: number; ruled: number; upheld: number } | null;
}

export function Hero({ onFile, stats }: Props) {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <HalftoneCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <span className="kicker text-terra">The on-chain docket</span>
          <span className="hidden h-px w-16 bg-terra/50 sm:block" />
          <span className="kicker text-taupe">No. 001</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 max-w-4xl font-display text-[clamp(3rem,8vw,6.5rem)] font-500 leading-[0.98] tracking-tight text-cream"
        >
          A fair hearing,
          <br />
          <span className="italic text-terra">settled by consensus</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-8 h-px w-full origin-left bg-cream/20"
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-body text-lg leading-relaxed text-sand"
          >
            Redress is a small-claims court with no judge on a payroll. You file a grievance and name
            the remedy you seek. The other party answers, and an AI magistrate weighs both sides,
            ruling UPHELD, SPLIT, or DISMISSED with a fault score. Every validator re-runs the ruling
            before it is entered on the docket. No deposits, no custody.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <button
              type="button"
              onClick={onFile}
              className="focus-ring flex items-center justify-center gap-2 bg-terra px-6 py-4 font-mono text-sm font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
            >
              <Scale size={18} /> File a case
            </button>
            <a
              href="#docket"
              className="focus-ring flex items-center justify-center gap-2 border border-cream/30 px-6 py-4 font-mono text-sm uppercase tracking-wider text-cream transition-colors hover:border-cream/60"
            >
              Read the docket <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-l-2 border-terra/60 pl-5 font-display text-2xl font-500 text-cream"
        >
          <span className="tabular text-terra">{stats ? stats.total : '\u2014'}</span>
          <span className="text-sand">cases on the docket,</span>
          <span className="tabular text-terra">{stats ? stats.ruled : '\u2014'}</span>
          <span className="text-sand">ruled,</span>
          <span className="tabular text-terra">{stats ? stats.upheld : '\u2014'}</span>
          <span className="text-sand">upheld in full.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 font-mono text-xs leading-relaxed text-taupe"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-terra" /> Live on Bradbury, contract
            <a href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="focus-ring text-sand hover:text-terra">
              {shortAddr(CONTRACT_ADDRESS)}
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
          </span>
          <span className="mt-1 block">
            Need test GEN to file?{' '}
            <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="focus-ring text-terra hover:underline">
              Claim it from the faucet
            </a>
            .
          </span>
        </motion.div>
      </div>
    </section>
  );
}
