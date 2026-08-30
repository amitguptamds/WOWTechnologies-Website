export default function WhyWowzer() {
  return (
    <section id="process" className="bg-gradient-to-br from-wowzer-darker to-wowzer-dark text-white py-24 text-center">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Why WOWzer Technologies?</h2>
        <p className="text-white/85 leading-relaxed max-w-[800px] mx-auto mb-16 text-lg">
          We&apos;re not just building software — we&apos;re building the infrastructure that modern accounting practices need to thrive. Every product in the WOWzer platform is designed with a singular focus: eliminate the manual, repetitive, and error-prone work that holds accountants and bookkeepers back.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { value: "5", title: "Countries Served", subtitle: "US, Canada, Australia, NZ, and the UK" },
            { value: "3M", title: "QB Licenses", subtitle: "Must migrate before May 2027" },
            { value: "95%", title: "Accuracy Guarantee", subtitle: "Or your money back" },
            { value: "$399", title: "Flat Rate", subtitle: "Transparent, predictable pricing" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 border border-white/10 rounded-xl p-8">
              <div className="font-heading font-bold text-4xl text-wowzer-light mb-3">{stat.value}</div>
              <p className="text-white/80 font-medium">{stat.title}<br/><span className="text-sm opacity-80 font-normal">{stat.subtitle}</span></p>
            </div>
          ))}
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-16">
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-1 bg-white/20 z-0"></div>
          {[
            { num: "1", title: "Identify the Problem", desc: "We start with real pain points experienced by accounting professionals every day." },
            { num: "2", title: "Engineer the Solution", desc: "Our team builds purpose-built, AI-powered tools — not generic software retrofitted for accounting." },
            { num: "3", title: "Deliver Results", desc: "Measurable time savings, accuracy improvements, and compliance — backed by guarantees." }
          ].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-wowzer-primary border-4 border-wowzer-dark rounded-full flex items-center justify-center font-heading font-bold text-2xl text-white shadow-lg mb-6">
                {step.num}
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-white/80 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/70 max-w-[900px] mx-auto">
          <strong className="text-white/90">Important:</strong> WOWzer Technologies Inc. is a technology company that builds AI-powered automation tools for accounting professionals. We do not provide bookkeeping, accounting, or tax preparation services. All references to &ldquo;accountants&rdquo; and &ldquo;bookkeepers&rdquo; describe the end users of our software products.
        </div>
      </div>
    </section>
  );
}
