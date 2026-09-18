import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-wowzer-text text-white/70 pt-20 pb-10">
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div>
          <div className="font-heading font-extrabold text-2xl text-white tracking-tight mb-4">
            WOWzer <span className="text-wowzer-light">Technologies</span>
          </div>
          <p className="leading-relaxed mb-6 max-w-sm">
            WOW Backup & Restore, WOW BookSwitch, and WOW Ai Suite are products of WOWzer Technologies Inc.
          </p>
        </div>
        
        <div>
          <h4 className="font-heading font-bold text-white text-lg mb-6">Our Products</h4>
          <ul className="space-y-4">
            <li><Link href="https://wowbackupandrestore.com" target="_blank" className="hover:text-white transition-colors">WOW Backup & Restore</Link></li>
            <li><Link href="https://wowbookswitch.com" target="_blank" className="hover:text-white transition-colors">WOW BookSwitch</Link></li>
            <li><Link href="https://wowaisuite.com" target="_blank" className="hover:text-white transition-colors">WOW Ai Suite</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white text-lg mb-6">Free Tools</h4>
          <ul className="space-y-4">
            <li><Link href="/wisp-workbook" className="hover:text-white transition-colors">WISP Workbook</Link></li>
            <li><Link href="/cyber-training" className="hover:text-white transition-colors">Cybersecurity Training</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-heading font-bold text-white text-lg mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1140px] mx-auto px-6 text-center text-sm text-white/50">
        <p>WOWzer Technologies Inc. &copy; {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
}
