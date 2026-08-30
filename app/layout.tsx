import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800']
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wowzer.tech'),
  title: {
    default: 'WOWzer Technologies | AI Automation for Accounting & Bookkeeping',
    template: '%s | WOWzer Technologies'
  },
  description: 'AI-first technology company eliminating manual, repetitive work from accounting workflows. Creators of WOW Backup & Restore, WOW BookSwitch, and WOW Ai Suite.',
  keywords: [
    'Accounting Automation',
    'QuickBooks to Xero Migration',
    'Xero Backup',
    'QuickBooks Online Backup',
    'Accounting AI',
    'WOWzer Technologies',
    'BookSwitch',
    'WOW Ai Suite'
  ],
  authors: [{ name: 'WOWzer Technologies' }],
  creator: 'WOWzer Technologies',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wowzer.tech',
    title: 'WOWzer Technologies | AI Automation for Accounting',
    description: 'Eliminate manual accounting work with our AI-powered automation tools: WOW Backup & Restore, WOW BookSwitch, and WOW Ai Suite.',
    siteName: 'WOWzer Technologies',
    images: [
      {
        url: '/wp-content/uploads/2022/09/wowzer-logo-grad-lockup-transparent.png', // Ideally a 1200x630 OG image
        width: 1200,
        height: 630,
        alt: 'WOWzer Technologies Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOWzer Technologies',
    description: 'AI-powered automation tools for accountants and bookkeepers worldwide.',
    images: ['/wp-content/uploads/2022/09/wowzer-logo-grad-lockup-transparent.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://wowzer.tech'
  },
  icons: {
    icon: '/WOW-favicon.svg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${openSans.variable} ${montserrat.variable} font-sans text-wowzer-text bg-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
