import React, { useState } from 'react';
import Header from '../components/Header';
import UrlShortenerForm from '../components/UrlShortenerForm';
import {
  ClipboardPaste, Wand2, BarChart2,
  Activity, ShieldCheck, Code2,
  CheckCircle2
} from 'lucide-react';

const trustedBrands = ['NEXUS', 'FLOW', 'PRISM', 'ORBIT', 'APEX'];

const steps = [
  {
    number: '1.',
    icon: <ClipboardPaste className="h-6 w-6 text-white" />,
    iconBg: 'bg-blue-500',
    title: 'Paste',
    desc: 'Paste your long, cumbersome URL into our precision engine.',
  },
  {
    number: '2.',
    icon: <Wand2 className="h-6 w-6 text-white" />,
    iconBg: 'bg-purple-500',
    title: 'Shorten',
    desc: 'Customize your back-half or get a generated unique alias instantly.',
  },
  {
    number: '3.',
    icon: <BarChart2 className="h-6 w-6 text-white" />,
    iconBg: 'bg-orange-500',
    title: 'Track',
    desc: 'Monitor clicks and engagement with real-time analytics dashboards.',
  },
];

const features = [
  {
    icon: <Activity className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    title: 'Real-time Analytics',
    desc: 'Track clicks, geographic data, and referral sources instantly.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-orange-600" />,
    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
    title: 'Secure Links',
    desc: 'Enterprise-grade security with custom SSL and link expiration.',
  },
  {
    icon: <Code2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />,
    iconBg: 'bg-slate-100 dark:bg-slate-700',
    title: 'Robust API',
    desc: 'Integrate link generation seamlessly into your workflow.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    features: ['50 links/month', 'Basic Analytics'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$19',
    period: '/mo',
    features: ['Unlimited links', 'Advanced Analytics', 'Custom Domains'],
    cta: 'Upgrade Now',
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mo',
    features: ['API Access', 'White Labeling', '24/7 Support'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function LandingPage({ username, onLogout, onOpenAuth, onOpenInfo }) {
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header username={username} onLogout={onLogout} onOpenAuth={onOpenAuth} onOpenInfo={onOpenInfo} />

      {/* ── Hero ── */}
      <section className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 py-20 px-4 text-center transition-colors duration-300">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Shorten your links,<br />expand your reach.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The enterprise-grade URL shortener built for speed, reliability, and precision analytics.
        </p>
        <UrlShortenerForm username={username} />
      </section>

      {/* ── Trusted By ── */}
      <section className="py-10 px-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-300">
        <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-6">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 max-w-2xl mx-auto">
          {trustedBrands.map((brand) => (
            <span key={brand} className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">How it Works</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-14">Get your professional links ready in three simple steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.number} {step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Powerful Features ── */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Powerful Features</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-12">Tools built for the modern digital marketer.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-6 text-left hover:shadow-md transition-all duration-200">
                <div className={`w-10 h-10 ${f.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Pricing Plans</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-12">Choose the perfect plan for your needs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 text-left flex flex-col transition-all duration-200 ${
                  plan.highlight
                    ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/30 ring-1 ring-blue-500 bg-white dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => username ? onOpenInfo('checkout') : onOpenAuth('signup')}
                  className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
