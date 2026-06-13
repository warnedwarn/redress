'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Scale, TriangleAlert, ExternalLink, Wallet, Gavel } from 'lucide-react';
import type { useTransaction } from '@/hooks/useTransaction';
import type { Case } from '@/lib/contract';
import { ConsensusStage } from './ConsensusStage';
import { CaseCard } from './CaseCard';
import { EXPLORER, FAUCET } from '@/lib/contract';

const MAX_TITLE = 120;
const MAX_TEXT = 600;

export type ModalMode = 'file' | 'defend';

interface Props {
  open: boolean;
  mode: ModalMode;
  target: Case | null;
  onClose: () => void;
  address: `0x${string}` | null;
  chainOk: boolean;
  onConnect: () => void;
  txApi: ReturnType<typeof useTransaction>;
  setTxInFlight: (v: boolean) => void;
}

export function CaseModal({ open, mode, target, onClose, address, chainOk, onConnect, txApi, setTxInFlight }: Props) {
  const { state, submitFile, submitDefend, reset } = txApi;
  const [title, setTitle] = useState('');
  const [remedy, setRemedy] = useState('');
  const [grievance, setGrievance] = useState('');
  const [defense, setDefense] = useState('');
  const [confirming, setConfirming] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && state.phase === 'idle') {
      setTitle('');
      setRemedy('');
      setGrievance('');
      setDefense('');
      setConfirming(false);
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open, mode, state.phase]);

  if (!open) return null;

  const busy = state.phase === 'wallet' || state.phase === 'submitted' || state.phase === 'consensus';

  const titleErr = title.length === 0 ? 'Required' : title.length > MAX_TITLE ? 'Too long' : '';
  const remedyErr = remedy.length === 0 ? 'Required' : remedy.length > MAX_TITLE ? 'Too long' : '';
  const grievErr = grievance.trim().length === 0 ? 'Required' : grievance.length > MAX_TEXT ? 'Too long' : '';
  const defErr = defense.trim().length === 0 ? 'Required' : defense.length > MAX_TEXT ? 'Too long' : '';
  const valid = mode === 'file' ? !titleErr && !remedyErr && !grievErr : !defErr;

  function handleClose() {
    if (busy) return;
    setConfirming(false);
    reset();
    onClose();
  }

  function startConfirm() {
    if (!valid) return;
    if (!address) {
      onConnect();
      return;
    }
    setConfirming(true);
  }

  async function doSubmit() {
    if (!address) return;
    setConfirming(false);
    if (mode === 'file') await submitFile(address, title.trim(), remedy.trim(), grievance.trim(), setTxInFlight);
    else if (target) await submitDefend(address, target.id, defense.trim(), setTxInFlight);
  }

  const heading = mode === 'file' ? 'File a grievance' : 'File the defense';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-0 backdrop-blur-sm sm:p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border border-cream/20 bg-ink-900 sm:h-auto sm:max-h-[90vh]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cream/15 bg-ink-900 px-6 py-4">
            <span className="flex items-center gap-2 font-display text-2xl font-500 italic text-cream">
              <Scale size={20} className="text-terra" /> {heading}
            </span>
            {!busy && (
              <button type="button" aria-label="Close" onClick={handleClose} className="focus-ring text-taupe hover:text-cream">
                <X size={22} />
              </button>
            )}
          </div>

          <div className="p-6">
            {/* FORM */}
            {state.phase === 'idle' && !confirming && (
              <div>
                {mode === 'defend' && target && (
                  <div className="mb-5 border border-cream/15 bg-ink-800 p-4">
                    <p className="kicker text-taupe">Responding to {target.id}</p>
                    <p className="mt-1 font-display text-lg text-cream">{target.title}</p>
                    <p className="mt-2 font-body text-xs leading-relaxed text-sand">{target.grievance}</p>
                  </div>
                )}

                {mode === 'file' ? (
                  <>
                    <label className="block">
                      <span className="kicker text-taupe">Case title</span>
                      <input
                        ref={firstRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE + 10))}
                        placeholder="A short title for the dispute"
                        className="focus-ring mt-2 w-full border border-cream/20 bg-ink-800 px-4 py-3 font-body text-cream placeholder:text-taupe"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-dismissed">{title.length > 0 ? titleErr : ''}</span>
                        <span className={title.length > MAX_TITLE ? 'text-dismissed' : 'text-taupe'}>{title.length}/{MAX_TITLE}</span>
                      </div>
                    </label>

                    <label className="mt-4 block">
                      <span className="kicker text-taupe">Remedy sought</span>
                      <input
                        value={remedy}
                        onChange={(e) => setRemedy(e.target.value.slice(0, MAX_TITLE + 10))}
                        placeholder="What outcome are you asking the court for?"
                        className="focus-ring mt-2 w-full border border-cream/20 bg-ink-800 px-4 py-3 font-body text-cream placeholder:text-taupe"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-dismissed">{remedy.length > 0 ? remedyErr : ''}</span>
                        <span className={remedy.length > MAX_TITLE ? 'text-dismissed' : 'text-taupe'}>{remedy.length}/{MAX_TITLE}</span>
                      </div>
                    </label>

                    <label className="mt-4 block">
                      <span className="kicker text-taupe">Grievance</span>
                      <textarea
                        value={grievance}
                        onChange={(e) => setGrievance(e.target.value.slice(0, MAX_TEXT + 30))}
                        rows={5}
                        placeholder="State the facts plainly. Concrete, verifiable detail carries more weight than emotion."
                        className="focus-ring mt-2 w-full resize-none border border-cream/20 bg-ink-800 px-4 py-3 font-body text-cream placeholder:text-taupe"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-dismissed">{grievance.length > 0 ? grievErr : ''}</span>
                        <span className={grievance.length > MAX_TEXT ? 'text-dismissed' : 'text-taupe'}>{grievance.length}/{MAX_TEXT}</span>
                      </div>
                    </label>
                  </>
                ) : (
                  <label className="block">
                    <span className="kicker text-taupe">Your defense</span>
                    <textarea
                      value={defense}
                      onChange={(e) => setDefense(e.target.value.slice(0, MAX_TEXT + 30))}
                      rows={6}
                      placeholder="Answer the grievance. Filing this opens the hearing and the magistrate will rule on both sides."
                      className="focus-ring mt-2 w-full resize-none border border-cream/20 bg-ink-800 px-4 py-3 font-body text-cream placeholder:text-taupe"
                    />
                    <div className="mt-1 flex justify-between font-mono text-xs">
                      <span className="text-dismissed">{defense.length > 0 ? defErr : ''}</span>
                      <span className={defense.length > MAX_TEXT ? 'text-dismissed' : 'text-taupe'}>{defense.length}/{MAX_TEXT}</span>
                    </div>
                    <p className="mt-2 font-body text-xs text-taupe">
                      The claimant cannot answer their own case. Use a different wallet than the one that filed it.
                    </p>
                  </label>
                )}

                {!address ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 border border-cream/30 py-3.5 font-mono text-sm font-600 uppercase tracking-wider text-cream transition-colors hover:border-terra hover:text-terra"
                  >
                    <Wallet size={16} /> Connect wallet
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!valid}
                    onClick={startConfirm}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 bg-terra py-3.5 font-mono text-sm font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {mode === 'file' ? <Scale size={16} /> : <Gavel size={16} />}
                    {mode === 'file' ? 'File the grievance' : 'Submit the defense'}
                  </button>
                )}
                {!chainOk && address && (
                  <p className="mt-3 text-center font-mono text-xs text-split">
                    Switch your wallet to Bradbury (4221) before submitting.
                  </p>
                )}
              </div>
            )}

            {/* CONFIRM */}
            {state.phase === 'idle' && confirming && (
              <div className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center border border-terra/50 bg-terra/5">
                  <TriangleAlert size={28} className="text-terra" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-500 italic text-cream">Confirm filing</h3>
                <p className="mt-3 font-body text-sm text-sand">
                  This submits a transaction on Bradbury Testnet. Network fees apply (mostly refunded
                  after the AI write). No deposit is taken. Continue?
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="focus-ring flex-1 border border-cream/30 py-3 font-mono text-xs font-600 uppercase tracking-wider text-sand hover:text-cream"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={doSubmit}
                    className="focus-ring flex-1 bg-terra py-3 font-mono text-xs font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* WALLET / SUBMITTED */}
            {(state.phase === 'wallet' || state.phase === 'submitted') && (
              <div className="flex flex-col items-center py-10 text-center">
                <Scale size={42} className="animate-pulse text-terra" />
                <h3 className="mt-5 font-display text-2xl font-500 italic text-cream">
                  {state.phase === 'wallet' ? 'Confirm in your wallet' : 'Filed with Bradbury'}
                </h3>
                <p className="mt-2 font-body text-sm text-sand">
                  {state.phase === 'wallet' ? 'Approve the transaction to proceed.' : 'The filing is queued. The hearing is beginning.'}
                </p>
                {state.hash && (
                  <a
                    href={`${EXPLORER}/tx/${state.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 font-mono text-xs text-terra hover:underline"
                  >
                    View transaction <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* CONSENSUS */}
            {state.phase === 'consensus' && (
              <div className="py-4">
                <ConsensusStage tx={state} />
              </div>
            )}

            {/* CONFIRMED */}
            {state.phase === 'confirmed' && (
              <div>
                <p className="text-center font-display text-2xl font-500 italic text-cream">
                  {state.kind === 'file' ? 'The case is on the docket' : 'The court has ruled'}
                </p>
                <p className="mt-2 text-center font-body text-sm text-sand">
                  {state.kind === 'file'
                    ? 'Another party can now answer and trigger the hearing.'
                    : 'Entered under validator consensus and recorded on-chain.'}
                </p>
                {state.result && (
                  <div className="mt-6">
                    <CaseCard item={state.result} fresh />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="focus-ring mt-6 w-full bg-terra py-3 font-mono text-xs font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
                >
                  Done
                </button>
              </div>
            )}

            {/* ERROR */}
            {state.phase === 'error' && (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center border border-dismissed bg-ink">
                  <TriangleAlert size={28} className="text-dismissed" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-500 italic text-cream">Filing failed</h3>
                <p className="mt-2 max-w-sm font-body text-sm text-sand">{state.error}</p>
                {/fee reserve|LackOfFundForMaxFee/i.test(state.error ?? '') && (
                  <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="mt-3 font-mono text-xs text-terra hover:underline">
                    Claim test GEN
                  </a>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="focus-ring bg-terra px-6 py-2.5 font-mono text-xs font-600 uppercase tracking-wider text-ink transition-colors hover:bg-terra-bright"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="focus-ring border border-cream/30 px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-sand hover:text-cream"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
