import Link from 'next/link';

export default function Products() {
  return (
    <>
      {/* WOW BACKUP & RESTORE */}
      <section id="products" className="bg-wowzer-dark text-white py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="text-wowzer-light font-bold tracking-wider uppercase text-sm mb-4">WOW Backup & Restore</div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Secure Backup and Recovery for Xero and QuickBooks Online</h2>
            <div className="text-white/80 font-medium text-lg mb-6">Built for Accountants and Bookkeepers. By Accountants.</div>
            <p className="text-white/90 leading-relaxed text-[1.05rem]">
              WOW Backup & Restore isn&apos;t generic cloud backup retrofitted for accounting and bookkeeping. It&apos;s a purpose-built backup and recovery solution engineered specifically for Xero and QuickBooks Online — designed to protect your clients&apos; financial data with the depth, compliance, and reliability that accountants and bookkeepers demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: "True API Restore", desc: "Restore to a new Xero or QBO organization via API in just a few clicks. Most competitors only export files for manual re-import. WOW actually restores using the native platform APIs — zero manual work required." },
              { title: "All Attachments Included", desc: "Every attachment is backed up in the base price. Competitors charge extra — or don't back them up at all. Our unique deep-linking tool lets you browse and review any transaction and its attachment directly." },
              { title: "Data Residency Compliance", desc: "Data stored in your own AWS region — US, Canada, or Australia. Meet data sovereignty requirements and address the cyber liability insurance gap: insurers require 3 independent data sources, and native platforms only provide 2." },
              { title: "7-Day Rolling Backup", desc: "Automated daily backups ensure you always have a recent, clean snapshot of every organization." },
              { title: "Vault Storage", desc: "Long-term archival for inactive organizations — keep historical data accessible and protected." },
              { title: "Full Restore Service", desc: "Complete recovery to a new Xero or QBO org with no manual intervention — the industry's most comprehensive restore." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                <h3 className="font-heading font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/85 mb-8 text-[1.05rem]">
              Available now for <strong>Xero and QuickBooks Online</strong> across the US, Canada, Australia, New Zealand, and the United Kingdom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://wowbackupandrestore.com" target="_blank" className="bg-wowzer-primary text-white font-medium px-8 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)] transition-all">
                Start a Free Trial
              </Link>
              <Link href="https://wowbackupandrestore.com" target="_blank" className="border-2 border-white/20 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WOW BOOKSWITCH */}
      <section id="bookswitch" className="bg-white py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="text-wowzer-primary font-bold tracking-wider uppercase text-sm mb-4">WOW BookSwitch</div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-wowzer-text mb-4">Automated Accounting Data Migration — Fast, Accurate & Secure</h2>
            <div className="text-wowzer-muted font-medium text-lg mb-6">Built by Accountants Who&apos;ve Felt the Pain of Migration</div>
            <p className="text-wowzer-text/80 leading-relaxed text-[1.05rem]">
              WOW BookSwitch is a fully automated, self-service platform that seamlessly converts accounting data between major platforms: <strong>QuickBooks Desktop to QuickBooks Online or Xero</strong>, and bi-directional migrations between <strong>QuickBooks Online and Xero</strong>. Simply connect your accounts or upload your file, and our AI-powered system handles the rest — including post-conversion validation and accuracy checks. Supports Canadian and US editions with 10+ years of historical data and full multi-currency support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { title: "Unlimited Conversions", desc: "Run unlimited concurrent conversions across all client organizations — no caps, no queues, no waiting." },
              { title: "95% Accuracy Guarantee", desc: "Money-back guarantee if accuracy falls below 95%. AI validation ensures every conversion meets the highest standards." },
              { title: "Enterprise Security", desc: "AWS regional data processing — Canadian data stays in Canada, US data stays in the US. No exceptions." },
              { title: "Free Backup Included", desc: "Every conversion includes 6 months of free WOW Backup & Restore to protect your newly migrated data." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-8 shadow-sm">
                <h3 className="font-heading font-bold text-xl text-wowzer-text mb-3">{feature.title}</h3>
                <p className="text-wowzer-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#fffdf5] border border-[#f0e6cc] rounded-xl p-8">
              <div className="text-[#b8860b] font-bold text-sm uppercase tracking-wider mb-3">⚠ The Urgency</div>
              <p className="text-wowzer-text leading-relaxed text-sm mb-3">
                <strong className="text-[#b8860b]">3,000,000 QuickBooks Desktop licenses</strong> must migrate by May 2027. Free migration tools carry a <strong className="text-[#b8860b]">43% error rate</strong>. One failed conversion costs approximately <strong className="text-[#b8860b]">$4,000 to fix</strong>.
              </p>
              <p className="text-wowzer-text font-semibold text-sm">Don&apos;t gamble with your clients&apos; financial data.</p>
            </div>
            
            <div className="bg-wowzer-lighter border border-wowzer-light rounded-xl p-8">
              <h3 className="text-wowzer-text font-bold text-xl mb-3">Simple, Transparent Pricing</h3>
              <p className="text-wowzer-text leading-relaxed text-sm">
                <strong className="text-lg block mb-2">$399 USD flat rate</strong> 
                covers 3 years + current fiscal year. Additional years at $100 USD each. No hidden fees. No per-org surcharges.
              </p>
            </div>
          </div>

          <div className="text-center flex flex-wrap justify-center gap-4">
            <Link href="https://wowbookswitch.com" target="_blank" className="bg-wowzer-primary text-white font-medium px-8 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)] transition-all">
              Start Your Migration
            </Link>
            <Link href="https://wowbookswitch.com" target="_blank" className="border-2 border-wowzer-primary text-wowzer-primary font-medium px-8 py-3 rounded-lg hover:bg-wowzer-lighter transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* WOW AI SUITE */}
      <section id="aisuite" className="bg-wowzer-darker text-white py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="text-wowzer-light font-bold tracking-wider uppercase text-sm mb-4">WOW Ai Suite</div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">AI for Accounting and Bookkeeping Firms</h2>
            <div className="text-white/80 font-medium text-lg mb-6">Close faster. Catch more. Chase less.</div>
            <p className="text-white/90 leading-relaxed text-[1.05rem]">
              An AI suite for small accounting and bookkeeping firms, and the businesses they serve. It runs the close, the reporting, the chasing, and the admin, so your team does the work clients actually pay for. Nothing goes out without your sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Close Review", desc: "Runs a 7-point close review the moment a period is marked done. Checks recs, clearing, suspense, AR/AP, sales tax, and flags anything off." },
              { title: "Plain English Reports", desc: "Turns numbers into plain English monthly P&L, balance-sheet, and cash briefs. Explains what changed and why it matters, jargon-free." },
              { title: "Skeptical Double-Check", desc: "Every figure re-verified, every calculation re-run, every report scored with ASPE or US GAAP applied automatically. Mistakes caught before they leave." },
              { title: "Document Chasing", desc: "Prepared-By-Client lists for close, tax, and audit. Polite, persistent follow-ups until it's all in. Named and filed the second it arrives." },
              { title: "Admin Automation", desc: "Inbox triaged, replies drafted in your firm's voice, meetings booked, and engagement letters prepped and routed for signature." },
              { title: "Growth & Advisory", desc: "Referral requests from real wins. Valuations and advisory analysis when bigger conversations come up — helping you grow without more hours." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                <h3 className="font-heading font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/85 mb-8 text-[1.05rem]">
              Simple to start. No new platform to learn. Connects via Make or Zapier to the tools you already use.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://wowaisuite.com" target="_blank" className="bg-wowzer-primary text-white font-medium px-8 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)] transition-all">
                Learn More
              </Link>
              <Link href="https://wowaisuite.com" target="_blank" className="border-2 border-white/20 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
