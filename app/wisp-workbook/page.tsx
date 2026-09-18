import type { Metadata } from 'next';
import WispWorkbook from '@/components/wisp/WispWorkbook';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Free WISP Template & Workbook for Accounting Firms',
  description: 'Build your firm\'s Written Information Security Plan (WISP) in the browser — free, no account. Your answers never leave your device; the finished plan downloads straight to your disk.',
  alternates: {
    canonical: 'https://wowzer.tech/wisp-workbook'
  }
};

export default function WispWorkbookPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header for this tool page */}
      <header className="sticky top-0 z-50 bg-wowzer-darker border-b border-white/10">
        <div className="max-w-[880px] mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/wow-logo.svg" alt="WOWzer Technologies" width={160} height={24} className="h-6 w-auto" />
          </Link>
          <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">WISP Workbook</span>
        </div>
      </header>
      <WispWorkbook />
    </div>
  );
}
