export const shortAddr = (a: string): string =>
  a && a.length > 10 ? `${a.slice(0, 6)}\u2026${a.slice(-4)}` : a;

export const shortHash = (h: string): string =>
  h && h.length > 14 ? `${h.slice(0, 10)}\u2026${h.slice(-6)}` : h;

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const rulingColor: Record<string, string> = {
  UPHELD: 'text-upheld',
  SPLIT: 'text-split',
  DISMISSED: 'text-dismissed',
};

export const rulingBorder: Record<string, string> = {
  UPHELD: 'border-upheld',
  SPLIT: 'border-split',
  DISMISSED: 'border-dismissed',
};

export const rulingLabel: Record<string, string> = {
  UPHELD: 'Upheld',
  SPLIT: 'Split',
  DISMISSED: 'Dismissed',
};
