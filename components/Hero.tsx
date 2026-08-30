import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="relative flex items-center pt-[120px] pb-[100px] overflow-hidden bg-gradient-to-br from-wowzer-darker via-wowzer-dark to-wowzer-primary">
      {/* Background Radial Glow */}
      <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[200%] bg-[radial-gradient(ellipse,rgba(0,82,204,0.3)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center relative z-10 text-center lg:text-left">
        {/* Content */}
        <div>
          <h1 className="font-heading font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-[-0.03em] text-white mb-6">
            AI-Powered Automation for Accounting Professionals
          </h1>
          
          <p className="text-white/90 text-lg leading-[1.6] max-w-[560px] mb-6 mx-auto lg:mx-0">
            WOWzer Technologies builds intelligent tools that automate the tedious, repetitive, and risky parts of accounting operations — from data migration to backup and disaster recovery. Built by accountants who got tired of doing things the hard way.
          </p>
          
          <div className="font-heading italic font-semibold text-lg text-wowzer-light mb-10 tracking-[-0.01em]">
            &#8220;If it&#8217;s repeatable, it&#8217;s automatable.&#8221;
          </div>
          
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
            <Link 
              href="#products" 
              className="inline-block bg-wowzer-primary text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)]"
            >
              Explore Our Products
            </Link>
            <Link 
              href="#contact" 
              className="inline-block bg-transparent border-2 border-white/20 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-[500px] lg:max-w-none mx-auto lg:mx-0 mt-8 lg:mt-0">
          <Image 
            src="/wp-content/uploads/2026/02/1-hero-section.png" 
            alt="AI-powered accounting dashboard with team collaboration" 
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
