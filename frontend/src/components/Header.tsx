'use client';

import { useState } from 'react';
import { Scale, ChevronDown, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onFile: () => void;
}

export function Header({ wallet, onFile }: Props) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cream/15 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="focus-ring flex items-baseline gap-2.5">
          <Scale size={20} className="self-center text-terra" />
          <span className="font-display text-2xl font-600 italic tracking-tight text-cream">Redress</span>
          <span className="kicker hidden text-taupe sm:inline">Dispatch</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-cream/15 px-3 py-1.5 font-mono text-xs text-sand sm:flex">
            <span className={`h-1.5 w-1.5 rounded-full ${wallet.address && wallet.chainOk ? 'bg-terra' : 'bg-taupe'}`} />
            Bradbury
          </span>

          {!wallet.address ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="focus-ring flex items-center gap-2 border border-cream/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:border-terra hover:text-terra disabled:opacity-60"
            >
              <Wallet size={15} />
              {wallet.connecting ? 'Connecting' : 'Connect'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="focus-ring flex items-center gap-2 border border-terra/50 bg-terra/10 px-3 py-2 font-mono text-xs text-cream"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-terra" />
                {shortAddr(wallet.address)}
                <ChevronDown size={14} />
              </button>
              {menu && (
                <div className="absolute right-0 top-12 w-72 border border-cream/20 bg-ink-800 p-4">
                  <p className="kicker text-taupe">Connected wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-xs text-sand">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address} label="Copy address" />
                  </div>
                  {!wallet.chainOk && (
                    <p className="mt-3 border border-split/40 bg-split/10 p-2 font-mono text-[11px] text-split">
                      Wrong network. Switch to Bradbury (4221).
                    </p>
                  )}
                  <a
                    href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-3 flex items-center gap-1 font-mono text-xs text-terra hover:underline"
                  >
                    View contract <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      wallet.disconnect();
                      setMenu(false);
                    }}
                    className="focus-ring mt-4 flex w-full items-center justify-center gap-2 border border-cream/20 py-2 font-mono text-xs uppercase tracking-wider text-sand transition-colors hover:border-dismissed hover:text-dismissed"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onFile}
            className="focus-ring hidden items-center gap-2 bg-terra px-4 py-2 font-mono text-xs font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright md:flex"
          >
            <Scale size={15} /> File a case
          </button>
        </div>
      </div>
    </header>
  );
}
