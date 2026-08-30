'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "How does WOWzer automate QuickBooks Desktop to cloud accounting migrations?",
    answer: "WOW BookSwitch is our fully automated migration platform that converts QuickBooks Desktop data to either QuickBooks Online or Xero. It supports US and Canadian editions with over 10 years of historical data, guarantees 95% accuracy using AI-powered validation, and requires zero manual data entry."
  },
  {
    question: "Do Xero and QuickBooks Online need third-party backup solutions?",
    answer: "Yes. While cloud accounting platforms replicate data for their own disaster recovery, they do not provide account-level rollback for user errors, malicious deletions, or app integration corruption. WOW Backup & Restore provides a true API-level restore for Xero and QuickBooks Online, ensuring compliance and data sovereignty."
  },
  {
    question: "How is WOW Ai Suite different from generic AI tools like ChatGPT?",
    answer: "WOW Ai Suite is specifically engineered for accounting and bookkeeping workflows. Unlike generic chatbots, it directly integrates with your software to automatically run 7-point close reviews, generate plain English financial reports, chase clients for documents, and triage your inbox—all while keeping you in full control of approvals."
  },
  {
    question: "Where is my accounting data stored and processed?",
    answer: "We maintain strict data residency compliance. Your financial data is securely stored and processed within your own AWS region (US, Canada, or Australia). This ensures you meet local data sovereignty requirements and adhere to cyber liability insurance policies."
  },
  {
    question: "Can I try WOWzer products before committing?",
    answer: "Yes, WOW Backup & Restore offers a free trial to test our API-level backup and recovery. WOW BookSwitch offers transparent flat-rate pricing per file migration, and WOW Ai Suite provides an onboarding consultation to ensure the AI seamlessly fits into your firm's existing tech stack."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-24">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-wowzer-primary font-bold tracking-wider uppercase text-sm mb-4">Frequently Asked Questions</div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-wowzer-text mb-6">
            Answers for Modern Accounting Firms
          </h2>
          <p className="text-wowzer-muted text-lg">
            Everything you need to know about our automation, migration, and backup solutions.
          </p>
        </div>

        {/* 
          Adding FAQ Schema for AI Search Engine Optimization 
          This helps AI crawlers parse the exact Q&A format.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-wowzer-primary bg-wowzer-lighter' : 'border-slate-200 bg-white hover:border-wowzer-light'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-heading font-bold text-lg text-wowzer-text pr-8">
                  {faq.question}
                </span>
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'bg-wowzer-primary text-white rotate-180' : 'bg-slate-100 text-wowzer-muted'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-wowzer-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
