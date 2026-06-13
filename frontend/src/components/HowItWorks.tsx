'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    n: 'I',
    kicker: 'The complaint',
    title: 'File a grievance',
    body: 'The claimant states the dispute, names the remedy sought, and lays out the facts in up to 600 characters. No deposit is taken, only network fees. The case opens on the public docket awaiting an answer.',
  },
  {
    n: 'II',
    kicker: 'The answer',
    title: 'The other side responds',
    body: 'A different wallet, never the claimant, files the defense. Submitting the answer is what triggers the hearing. The contract refuses a defense from the claimant, so a case is always heard with two genuine sides.',
  },
  {
    n: 'III',
    kicker: 'The hearing',
    title: 'The magistrate weighs both',
    body: 'An injection-resistant AI magistrate reads grievance and defense together and rules UPHELD, SPLIT, or DISMISSED with a fault score apportioned to the respondent. Concrete claims outweigh pressure or repetition.',
  },
  {
    n: 'IV',
    kicker: 'The judgment',
    title: 'Consensus enters it',
    body: 'Every validator re-runs the ruling; the verdict must match exactly and the fault score within tolerance. A backstop then clamps the score into its band, and the judgment is entered on the docket for good.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-cream/15 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="kicker text-terra">Procedure</span>
            <h2 className="mt-3 font-display text-5xl font-500 italic tracking-tight text-cream sm:text-6xl">
              How a case is heard
            </h2>
          </div>
          <p className="hidden max-w-xs font-body text-sm text-taupe md:block">
            Four steps, two parties, one ruling that no single party controls.
          </p>
        </div>

        <div className="mt-14 divide-y divide-cream/15 border-y border-cream/15">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`grid items-baseline gap-6 py-9 md:grid-cols-[auto_1fr_2fr] ${
                i % 2 === 1 ? 'md:pl-16' : ''
              }`}
            >
              <span className="font-display text-6xl font-500 italic leading-none text-terra/70">{s.n}</span>
              <div>
                <p className="kicker text-taupe">{s.kicker}</p>
                <h3 className="mt-2 font-display text-2xl font-500 text-cream">{s.title}</h3>
              </div>
              <p className="font-body leading-relaxed text-sand">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
