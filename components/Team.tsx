import Image from 'next/image';

export default function Team() {
  const team = [
    {
      name: "Mark Kennedy",
      img: "/wp-content/uploads/2025/06/ECCSA-Teaching.jpg",
      desc: "Certified in Data Governance and AI Principles. Mark is driven to automate the repetitive but essential tasks that slow accounting practices down. He leads WOWzer's strategic vision with a security-first mindset.",
      quote: "“Keep it secret… keep it safe.”"
    },
    {
      name: "Vincenzo Schembri",
      img: "/wp-content/uploads/2025/06/Vincenzo-profile-pic.jpg",
      desc: "US Certified CPA who leads product design, helping SMBs protect and manage financial data with greater efficiency. Vincenzo bridges the gap between accounting reality and product innovation.",
      quote: "“Accounting for Fun!”"
    },
    {
      name: "Jeff Felsinger",
      img: "/wp-content/uploads/2025/06/Jeff-profile-pic.jpg",
      desc: "30+ years of experience in e-commerce, CRM, and business process optimization. Jeff has led the Backup & Restore product since its inception in 2019, overseeing operations and data strategy."
    },
    {
      name: "Amit Gupta",
      img: "/wp-content/uploads/2025/06/Amit-profile-pic.jpg",
      desc: "18+ years in strategic planning, technology development, and project management. Amit steers innovation, operations, delivery, and sales initiatives — ensuring every product meets enterprise-grade standards."
    }
  ];

  return (
    <section id="team" className="bg-slate-50 py-24">
      <div className="max-w-[1140px] mx-auto px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-wowzer-text mb-6">
          Innovative Solutions for Growth
        </h2>
        <p className="text-wowzer-muted leading-relaxed max-w-[800px] mx-auto mb-16 text-lg">
          WOWzer Technologies is a Canadian technology company headquartered in Surrey, BC. We build AI-powered automation tools for accountants and bookkeepers worldwide. Our team combines deep accounting expertise with enterprise technology experience — giving us a rare ability to understand both the problem and the engineering required to solve it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-[100px] h-[100px] mb-6 rounded-full overflow-hidden shrink-0 border-2 border-wowzer-lighter">
                <Image 
                  src={member.img} 
                  alt={member.name} 
                  width={100} height={100} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-heading font-bold text-xl text-wowzer-text mb-3">{member.name}</h3>
              <p className="text-wowzer-muted text-sm leading-relaxed mb-4 grow">{member.desc}</p>
              {member.quote && (
                <div className="text-wowzer-primary italic font-medium text-sm mt-auto">
                  {member.quote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
