'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-border bg-card shadow-sm">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-semibold text-foreground">{faq.q}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="border-t border-border px-5 py-4">
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
