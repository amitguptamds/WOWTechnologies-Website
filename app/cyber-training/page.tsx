import type { Metadata } from 'next';
import CyberTraining from '@/components/training/CyberTraining';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Free Cybersecurity Awareness Training for Small Firms (40 min)',
  description: 'Free 40-minute cybersecurity awareness course for small businesses — ten modules covering AI-era phishing, deepfake fraud, ransomware, data handling, and more.',
  alternates: {
    canonical: 'https://wowzer.tech/cyber-training'
  }
};

export default function CyberTrainingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hide header when printing the certificate */}
      <header className="sticky top-0 z-50 bg-wowzer-darker border-b border-white/10 print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/wow-logo.svg" alt="WOWzer Technologies" width={160} height={24} className="h-6 w-auto" />
          </Link>
          <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Security Training</span>
        </div>
      </header>
      <CyberTraining />
    </div>
  );
}
