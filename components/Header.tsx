'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-wowzer-darker ${
        isScrolled ? 'py-2 shadow-lg' : 'py-4 shadow-none'
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/wow-logo.svg" alt="WOWzer Technologies" width={220} height={32} className="h-8 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#vision" className="text-white/80 text-sm font-medium hover:text-white transition-colors">Vision</Link>
          <Link href="#products" className="text-white/80 text-sm font-medium hover:text-white transition-colors">Products</Link>
          <Link href="#process" className="text-white/80 text-sm font-medium hover:text-white transition-colors">Process</Link>
          <Link href="#team" className="text-white/80 text-sm font-medium hover:text-white transition-colors">Team</Link>
          <Link href="#contact" className="bg-wowzer-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)] transition-all">
            Contact Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d={isMobileMenuOpen 
              ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
              : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            }/>
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-wowzer-darker flex flex-col p-6 gap-4 md:hidden border-t border-white/10 shadow-xl">
            <Link href="#vision" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white font-medium">Vision</Link>
            <Link href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white font-medium">Products</Link>
            <Link href="#process" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white font-medium">Process</Link>
            <Link href="#team" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white font-medium">Team</Link>
            <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-wowzer-light hover:text-white font-medium">Contact Us</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
