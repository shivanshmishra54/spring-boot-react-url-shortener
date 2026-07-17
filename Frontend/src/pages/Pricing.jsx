import React, { useState } from 'react';
import Header from '../components/Header';
import { Check, HelpCircle } from 'lucide-react';

export default function Pricing({ username, onLogout, onOpenAuth, onOpenInfo }) {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "For personal use and quick link shares.",
      features: ["50 Short Links / mo", "Basic Redirection Analytics", "1 Year Link Expiry Protection", "Standard Community Support"],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Ideal for content creators and small brands.",
      features: ["Unlimited Short Links", "Real-time Advanced Metrics", "Custom Domains supported", "No Expiration Date", "Priority email assistance"],
      cta: "Upgrade to Professional",
      highlight: true,
      badge: "MOST POPULAR"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For corporate scale and developer integrations.",
      features: ["Unlimited Short Links", "Raw Webhook Integrations", "Full Developer API Access", "99.9% Redirection SLA", "24/7 Phone & Slack Support"],
      cta: "Contact Enterprise Sales",
      highlight: false
    }
  ];

  const faqs = [
    { q: "Is there a contract or commitment?", a: "No. You can upgrade, downgrade, or cancel your premium subscription at any time directly from your billing profile page." },
    { q: "Can I use my own custom domain?", a: "Yes! Custom domains are available on the Professional and Enterprise plans. We guide you through simple CNAME configurations." },
    { q: "What happens if I exceed my link limit?", a: "If you are on the Starter free plan and reach your monthly limit, existing links continue redirecting but you cannot create new ones until the cycle resets." }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header username={username} onLogout={onLogout} onOpenAuth={onOpenAuth} onOpenInfo={onOpenInfo} />
      
      <main className="flex-grow py-16 px-4 max-w-6xl mx-auto w-full">
        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl mb-4">
            Transparent Pricing for Everyone
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 text-lg">
            Choose a plan that matches your audience size. Free forever for basic use.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
          {plans.map((p, idx) => (
            <div 
              key={idx}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-200 ${
                p.highlight
                  ? 'border-blue-500 shadow-xl shadow-blue-100 dark:shadow-blue-900/20 ring-1 ring-blue-500 bg-white dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{p.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{p.price}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold ml-1">{p.period || ""}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 text-blue-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => username ? onOpenInfo('checkout') : onOpenAuth('signup')}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  p.highlight
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
