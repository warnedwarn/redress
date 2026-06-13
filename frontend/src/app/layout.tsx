import type { Metadata } from 'next';
import { Newsreader, Work_Sans, Spline_Sans_Mono } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
});
const worksans = Work_Sans({ subsets: ['latin'], variable: '--font-worksans', display: 'swap' });
const spline = Spline_Sans_Mono({ subsets: ['latin'], variable: '--font-spline', display: 'swap' });

export const metadata: Metadata = {
  title: 'Redress | On-chain small-claims court',
  description:
    'File a grievance, let the other party answer, and an AI magistrate rules UPHELD, SPLIT, or DISMISSED with a fault score under GenLayer validator consensus.',
  openGraph: {
    title: 'Redress | On-chain small-claims court',
    description:
      'An AI magistrate settles two-party disputes under GenLayer validator consensus. The ruling is on-chain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${worksans.variable} ${spline.variable}`}>
      <body className="bg-ink text-cream font-body antialiased">{children}</body>
    </html>
  );
}
