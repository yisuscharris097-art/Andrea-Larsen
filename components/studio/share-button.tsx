'use client';

/** ShareButton — Web Share API con fallback a copiar el link. */
import { useState } from 'react';

export default function ShareButton({ title, label = 'Share this property' }: { title: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };
  return (
    <button onClick={share} className="st-pill st-pill--dark" style={{ justifyContent: 'center', width: '100%' }}>
      {copied ? '✓ Link copied' : label}
    </button>
  );
}
