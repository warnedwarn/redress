'use client';

import { Scale, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

export function Footer() {
  return (
    <footer className="border-t border-cream/15 bg-ink-800">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <span className="flex items-baseline gap-2 font-display text-2xl font-500 italic text-cream">
            <Scale size={20} className="self-center text-terra" /> Redress
          </span>
          <p className="mt-3 max-w-xs font-body text-sm text-sand">
            An on-chain small-claims court. Two-party disputes settled by an AI magistrate under
            GenLayer validator consensus. No deposits, no custody, no backend.
          </p>
        </div>

        <div>
          <p className="kicker text-taupe">Resources</p>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            <li>
              <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sand hover:text-terra">
                Bradbury faucet <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sand hover:text-terra">
                GenLayer docs <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sand hover:text-terra">
                Block explorer <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker text-taupe">On-chain</p>
          <ul className="mt-4 space-y-3 font-mono text-sm">
            <li className="flex items-center justify-between gap-2 text-sand">
              <a href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="hover:text-terra">
                Contract {shortAddr(CONTRACT_ADDRESS)}
              </a>
              <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
            </li>
            <li className="flex items-center justify-between gap-2 text-sand">
              <a href={`${EXPLORER}/tx/${DEPLOY_TX}`} target="_blank" rel="noopener noreferrer" className="hover:text-terra">
                Deploy {shortHash(DEPLOY_TX)}
              </a>
              <CopyButton value={DEPLOY_TX} label="Copy deploy tx" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-5 text-center font-mono text-xs text-taupe sm:px-6">
        Built on GenLayer Bradbury Testnet. The magistrate is an AI ruling under validator consensus,
        not a court of law and not legal advice.
      </div>
    </footer>
  );
}
