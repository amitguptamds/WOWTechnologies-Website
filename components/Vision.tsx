import Image from 'next/image';

export default function Vision() {
  return (
    <section id="vision" className="bg-white py-24">
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
        {/* Content */}
        <div>
          <div className="text-wowzer-primary font-bold tracking-wider uppercase text-sm mb-4">
            The Vision
          </div>
          <h2 className="font-heading font-bold text-[2rem] md:text-[2.5rem] leading-tight text-wowzer-text mb-6">
            The Future of Accounting is Automated
          </h2>
          <div className="space-y-4 text-wowzer-muted text-[1.05rem] leading-relaxed">
            <p>
              Accountants and bookkeepers spend thousands of hours every year on tasks that machines can handle better, faster, and with fewer errors — data migration, backup management, reconciliation, and document processing. WOWzer Technologies exists to change that. We&apos;re an AI-first technology company on a mission to eliminate manual, repetitive work from accounting workflows for good.
            </p>
            <p>
              Our philosophy is simple: <span className="font-semibold text-wowzer-text">&ldquo;If it has to be repeated, it can be automated.&rdquo;</span> Every product we build starts with a real pain point experienced by real accountants and bookkeepers — then we engineer a solution that removes the friction entirely.
            </p>
            <p>
              Our current products — <strong className="text-wowzer-text font-semibold">WOW Backup &amp; Restore</strong> and <strong className="text-wowzer-text font-semibold">WOW BookSwitch</strong> — are the foundation of a broader platform vision. These aren&apos;t proof-of-concepts. They&apos;re production-grade tools already serving accountants and bookkeepers across five countries.
            </p>
            <p>
              Looking ahead, our roadmap includes AI-driven financial reporting, automated document processing, and intelligent workflow automation. The vision is aspirational, but it&apos;s grounded in working products already in market — and a team that understands both the technology and the accounting profession from the inside out.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="order-first lg:order-none relative rounded-xl overflow-hidden shadow-xl mx-auto lg:mx-0 w-full max-w-[500px] lg:max-w-none">
          <Image 
            src="/wp-content/uploads/2026/02/2-vision.png" 
            alt="Technology roadmap and evolution stages" 
            width={800}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
