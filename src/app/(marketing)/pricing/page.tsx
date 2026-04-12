"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "INR", symbol: "₹", label: "INR" },
  { code: "JPY", symbol: "¥", label: "JPY" },
];

const PRICES: Record<string, { monthly: number; annual: number }> = {
  USD: { monthly: 9, annual: 7 },
  EUR: { monthly: 8, annual: 6 },
  GBP: { monthly: 7, annual: 6 },
  INR: { monthly: 749, annual: 599 },
  JPY: { monthly: 1300, annual: 1000 },
};

export default function PricingPage() {
  const [currency, setCurrency] = useState("USD");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const sym = CURRENCIES.find((c) => c.code === currency)!.symbol;
  const price = PRICES[currency][billing];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-10 md:py-14 text-center border-b border-dashed border-neutral-200">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 font-heading tracking-tight mb-3">
          Simple pricing
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start free. Upgrade when you need more sessions, cuppers, or exports.
        </p>
      </section>

      {/* Controls */}
      <section className="py-6 border-b border-dashed border-neutral-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Billing toggle */}
          <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden text-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 transition-colors ${
                billing === "monthly"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-1.5 transition-colors ${
                billing === "annual"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs font-mono text-green-600">−20%</span>
            </button>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-1.5">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors border ${
                  currency === c.code
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 border border-neutral-200">
          {/* Free */}
          <div className="bg-white p-6 flex flex-col">
            <div className="mb-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold font-mono text-neutral-900">
                  {sym}0
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Forever. No card required.</p>
            </div>

            <ul className="space-y-2 text-sm mb-8 flex-1">
              {[
                "3 cupping sessions / month",
                "Up to 2 cuppers",
                "5 coffees per session",
                "Full SCA scoring sheet",
                "Session history (30 days)",
                "Basic export (CSV)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-neutral-400 mt-0.5 font-mono text-xs">—</span>
                  <span className="text-neutral-700">{f}</span>
                </li>
              ))}
            </ul>

            <Button variant="outline" asChild className="w-full border-dashed">
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>

          {/* Pro */}
          <div className="bg-white p-6 flex flex-col">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Pro</p>
                <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 border border-blue-100">
                  Most popular
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold font-mono text-neutral-900">
                  {sym}{price}
                </span>
                <span className="text-xs text-muted-foreground">/ mo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {billing === "annual"
                  ? `Billed annually · ${sym}${price * 12}/yr`
                  : "Billed monthly · cancel anytime"}
              </p>
            </div>

            <ul className="space-y-2 text-sm mb-8 flex-1">
              {[
                "Unlimited sessions",
                "Unlimited cuppers",
                "Unlimited coffees per session",
                "Full SCA scoring sheet",
                "Unlimited history",
                "Export CSV, PDF, JSON",
                "Multi-cupper score averaging",
                "Origin & roast metadata",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 font-mono text-xs">+</span>
                  <span className="text-neutral-700">{f}</span>
                </li>
              ))}
            </ul>

            <Button asChild className="w-full">
              <Link href="/sign-up">Start free trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Self-hosting */}
      <section className="py-6 border-t border-dashed border-neutral-200">
        <div className="border border-dashed border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Self-hosted</p>
            <p className="text-sm font-medium text-neutral-800 mb-1">Run CupLog on your own infrastructure</p>
            <p className="text-xs text-muted-foreground max-w-md">
              Open source. Deploy to your own server — full data ownership, no usage limits, no subscription. Docker image available.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" asChild className="border-dashed text-sm px-4 h-9">
              <a href="https://github.com/Gray-Cup/cuplog-front" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 border-t border-dashed border-neutral-200">
        <h2 className="text-base font-bold text-neutral-900 font-heading mb-4">Common questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              q: "Can I stay on the free plan?",
              a: "Yes. The free plan has no time limit — 3 sessions per month, always.",
            },
            {
              q: "What happens to my data if I downgrade?",
              a: "Sessions beyond the free tier limits become read-only. Nothing is deleted.",
            },
            {
              q: "Is there a trial for Pro?",
              a: "Yes — 14 days free when you sign up, no card required.",
            },
            {
              q: "Do you support teams?",
              a: "Multi-cupper scoring works on Pro. Team billing is on the roadmap.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-dashed border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-800 mb-1">{q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
