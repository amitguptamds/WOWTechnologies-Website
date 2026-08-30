export default function Capabilities() {
  const capabilities = [
    {
      title: 'Data Migration',
      description: 'Seamless, automated conversion between major accounting platforms',
      svg: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-wowzer-primary"><path d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm0 6h4v4H4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z"/></svg>
    },
    {
      title: 'Backup & Recovery',
      description: 'Enterprise-grade data protection purpose-built for accounting',
      svg: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-wowzer-primary"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
    },
    {
      title: 'AI Workflows',
      description: 'Intelligent automation for reporting, documents, and reconciliation',
      svg: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-wowzer-primary"><path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.5-9.11 0-12.58 3.51-3.47 9.14-3.49 12.65-.06L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/></svg>
    }
  ];

  return (
    <section id="capabilities" className="bg-slate-50 py-20">
      <div className="max-w-[1140px] mx-auto px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-wowzer-text mb-12">
          What We Build
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-wowzer-lighter flex items-center justify-center mx-auto mb-6">
                {cap.svg}
              </div>
              <h3 className="font-heading font-bold text-xl text-wowzer-text mb-3">
                {cap.title}
              </h3>
              <p className="text-wowzer-muted leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
