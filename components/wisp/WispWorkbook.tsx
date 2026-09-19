'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WispData, COLS, defaultData, computeProgress, scorePct, band, gaps } from './wispUtils';
import { downloadDocx, downloadTxt, buildPlainText } from './wispDocx';
import { Section, TextField, TextArea, Checkbox, DynTable } from './WispSection';
import emailjs from '@emailjs/browser';

type WispUser = {
  name: string;
  org: string;
  email: string;
};

const WISP_USER_KEY = 'wowzer_wisp_user';

export default function WispWorkbook() {
  const [wispUser, setWispUser] = useState<WispUser | null>(null);
  const [signInData, setSignInData] = useState({ name: '', org: '', email: '' });

  const [data, setData] = useState<WispData>(defaultData());
  const [saved, setSaved] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showPrintable, setShowPrintable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(WISP_USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setWispUser(parsed);
      }
    } catch {}

    try {
      const stored = localStorage.getItem('wisp');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.systems = parsed.systems || [{}];
        parsed.vendors = parsed.vendors || [{}];
        parsed.ai = parsed.ai || [{}];
        parsed.staff = parsed.staff || [{}];
        setData(parsed);
      }
    } catch {}
    setMounted(true);
  }, []);

  /* --- EmailJS Lead Capture on Sign-in --- */
  const sendLeadEmail = (userData: { name: string; org: string; email: string }) => {
    const templateParams = {
      name: userData.name,
      email: userData.email,
      subject: 'WISP Workbook — New Lead',
      message: `New WISP Workbook sign-up:\n\nName: ${userData.name}\nOrganization: ${userData.org}\nEmail: ${userData.email}\n\nThis lead was captured from the WISP Workbook form on WOWzer.tech.`,
      source: 'WOWzer.tech — WISP Workbook Form',
    };

    emailjs
      .send('default_service', 'template_ab0walg', templateParams, 'naLKp2IhB7VYtA5St')
      .then(() => console.log('WISP lead email sent'))
      .catch((err) => console.error('EmailJS error:', err));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInData.name && signInData.org && signInData.email) {
      setWispUser(signInData);
      localStorage.setItem(WISP_USER_KEY, JSON.stringify(signInData));
      // Pre-fill firm name and QI details if data is fresh
      setData(prev => {
        const next = { ...prev };
        if (!next.firmName) next.firmName = signInData.org;
        if (!next.qiName) next.qiName = signInData.name;
        if (!next.qiEmail) next.qiEmail = signInData.email;
        try { localStorage.setItem('wisp', JSON.stringify(next)); } catch {}
        return next;
      });
      // Fire lead-capture email immediately
      sendLeadEmail(signInData);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(WISP_USER_KEY);
    setWispUser(null);
    setSignInData({ name: '', org: '', email: '' });
  };

  // Save to localStorage
  const save = useCallback((newData: WispData) => {
    setData(newData);
    try {
      localStorage.setItem('wisp', JSON.stringify(newData));
      setSaved('Saved');
      setTimeout(() => setSaved(''), 1400);
    } catch {}
  }, []);

  // Field change handler
  const onFieldChange = useCallback((key: string, value: string) => {
    setData(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('wisp', JSON.stringify(next)); setSaved('Saved'); setTimeout(() => setSaved(''), 1400); } catch {}
      return next;
    });
  }, []);

  const onCheckChange = useCallback((key: string, value: boolean) => {
    setData(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('wisp', JSON.stringify(next)); setSaved('Saved'); setTimeout(() => setSaved(''), 1400); } catch {}
      return next;
    });
  }, []);

  // Table handlers
  const onRowChange = useCallback((tableKey: string, rowIdx: number, colKey: string, value: string) => {
    setData(prev => {
      const arr = [...prev[tableKey]];
      arr[rowIdx] = { ...arr[rowIdx], [colKey]: value };
      const next = { ...prev, [tableKey]: arr };
      try { localStorage.setItem('wisp', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const onAddRow = useCallback((tableKey: string) => {
    setData(prev => {
      const next = { ...prev, [tableKey]: [...prev[tableKey], {}] };
      try { localStorage.setItem('wisp', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const onDeleteRow = useCallback((tableKey: string, rowIdx: number) => {
    setData(prev => {
      const arr = [...prev[tableKey]];
      if (arr.length > 1) arr.splice(rowIdx, 1); else arr[0] = {};
      const next = { ...prev, [tableKey]: arr };
      try { localStorage.setItem('wisp', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const onQuickAdd = useCallback((tableKey: string, name: string) => {
    setData(prev => {
      const arr = [...prev[tableKey]];
      const last = arr[arr.length - 1];
      if (last && !last.name) { arr[arr.length - 1] = { ...last, name }; } else { arr.push({ name }); }
      const next = { ...prev, [tableKey]: arr };
      try { localStorage.setItem('wisp', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearAll = () => {
    if (confirm('Clear everything on this device?')) {
      localStorage.removeItem('wisp');
      setData(defaultData());
      setShowResult(false);
      setShowPrintable(false);
    }
  };

  const v = (k: string) => (data[k] || '').toString().trim();
  const progress = mounted ? computeProgress(data) : 0;

  const userName = wispUser?.name || v('qiName') || '[NAME]';
  const firmName = wispUser?.org || v('firmName') || '[FIRM NAME]';

  const handleBuild = () => {
    setShowResult(true);
    downloadDocx(data, userName, firmName);
  };

  /* --- Printable Worksheet --- */
  const handlePrint = () => {
    setShowPrintable(true);
    setTimeout(() => window.print(), 300);
  };

  /* --- PDF Download --- */
  const downloadPDF = async () => {
    if (!printRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 900,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 10;
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
      } else {
        // Multi-page
        let remainingHeight = imgHeight;
        let srcY = 0;
        let page = 0;
        while (remainingHeight > 0) {
          if (page > 0) pdf.addPage();
          const sliceHeight = Math.min(pageHeight, remainingHeight);
          // Create a temporary canvas for this slice
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          const srcSliceHeight = (sliceHeight / imgHeight) * canvas.height;
          sliceCanvas.height = srcSliceHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceHeight, 0, 0, canvas.width, srcSliceHeight);
            const sliceData = sliceCanvas.toDataURL('image/png');
            pdf.addImage(sliceData, 'PNG', 10, 10, imgWidth, sliceHeight);
          }
          srcY += srcSliceHeight;
          remainingHeight -= sliceHeight;
          page++;
        }
      }

      pdf.save(`WISP-Workbook-${firmName.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  const pct = mounted ? scorePct(data) : 0;
  const G = mounted ? gaps(data) : [];
  const critCount = G.filter(g => g.s === 'c').length;

  if (!mounted) return null;

  /* =================================================================== */
  /* SIGN-IN SCREEN                                                       */
  /* =================================================================== */
  if (!wispUser) {
    return (
      <div className="min-h-[85vh] flex flex-col lg:flex-row">
        {/* Left brand panel */}
        <div className="flex-1 bg-gradient-to-br from-wowzer-darker via-wowzer-dark to-wowzer-primary text-white p-10 lg:p-16 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-blue-200 mb-4">
            WOWzer Technologies &middot; Free Tool
          </p>
          <h1 className="text-3xl lg:text-4xl font-heading font-extrabold leading-tight mb-4">
            Build Your Written Information Security Plan
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-[46ch] mb-8">
            Fill in the blanks. It&rsquo;s a workbook, not a quiz. What you type here becomes the actual text of your plan, and anything you leave blank becomes an honest gap with a date against it.
          </p>
          <ul className="space-y-3.5">
            {[
              ['13 sections', 'Covering everything from MFA to AI governance to incident response'],
              ['On-device', 'Your answers never leave this browser — built and downloaded on your machine'],
              ['Download', 'Get your finished WISP as a Word document or printable worksheet'],
            ].map(([bold, desc], i) => (
              <li key={i} className="flex items-start gap-3 text-blue-50 text-[15px]">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>
                  <b>{bold}</b> &mdash; {desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-blue-300 text-[13px]">
            Presented by WOWzer Technologies &middot; 2026 Edition
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
          <form onSubmit={handleSignIn} className="w-full max-w-[430px] bg-white rounded-2xl shadow-lg p-9" noValidate>
            <h2 className="text-2xl font-heading font-bold text-wowzer-darker mb-1">Start your WISP</h2>
            <p className="text-sm text-wowzer-muted mb-7">
              Your details pre-fill the worksheet and appear on your completed plan.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[13.5px] font-semibold text-wowzer-darker mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Partner"
                  value={signInData.name}
                  onChange={(e) => setSignInData({ ...signInData, name: e.target.value })}
                  className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-wowzer-primary focus:ring-2 focus:ring-wowzer-primary/15 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-wowzer-darker mb-1.5">Firm / Organization</label>
                <input
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Henderson &amp; Partners LLP"
                  value={signInData.org}
                  onChange={(e) => setSignInData({ ...signInData, org: e.target.value })}
                  className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-wowzer-primary focus:ring-2 focus:ring-wowzer-primary/15 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-wowzer-darker mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@firm.com"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-wowzer-primary focus:ring-2 focus:ring-wowzer-primary/15 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-wowzer-primary hover:bg-wowzer-dark text-white font-bold py-3.5 rounded-lg transition-colors text-[15.5px]"
              >
                Start building &rarr;
              </button>
            </div>
            <p className="mt-5 text-xs text-wowzer-muted bg-wowzer-lighter rounded-lg p-3">
              <strong>Privacy note:</strong> your worksheet data stays in this browser and is never transmitted. We receive only your name, firm and email so we know a firm is building a plan.
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* =================================================================== */
  /* PRINTABLE WORKSHEET VIEW                                             */
  /* =================================================================== */
  if (showPrintable) {
    const renderTableRows = (tableKey: string) => {
      const rows = data[tableKey] as Record<string, string>[];
      const cols = COLS[tableKey];
      const filledRows = rows.filter((r: Record<string, string>) => Object.values(r).some(val => val && val.trim()));
      if (filledRows.length === 0) return <p className="text-slate-400 italic text-sm">No entries</p>;
      return (
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.k} className="text-left border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {c.k.charAt(0).toUpperCase() + c.k.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filledRows.map((row: Record<string, string>, ri: number) => (
              <tr key={ri}>
                {cols.map(c => (
                  <td key={c.k} className="border border-slate-300 px-2 py-1 text-xs">{row[c.k] || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    const renderField = (label: string, key: string) => {
      const val = v(key);
      return val ? (
        <div className="mb-2">
          <span className="text-xs font-semibold text-slate-500">{label}:</span>{' '}
          <span className="text-sm text-slate-800">{val}</span>
        </div>
      ) : null;
    };

    const renderCheck = (label: string, key: string) => {
      return (
        <div className="flex items-center gap-2 mb-1 text-sm">
          <span className={`text-base ${data[key] ? 'text-green-600' : 'text-red-400'}`}>{data[key] ? '☑' : '☐'}</span>
          <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: label }} />
        </div>
      );
    };

    return (
      <div className="bg-white min-h-screen">
        {/* Screen-only controls */}
        <div className="max-w-[880px] mx-auto px-5 py-4 flex gap-3 flex-wrap print:hidden">
          <button onClick={downloadPDF} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download PDF
          </button>
          <button onClick={() => window.print()} className="bg-wowzer-primary hover:bg-wowzer-dark text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print
          </button>
          <button onClick={() => setShowPrintable(false)} className="bg-white border border-wowzer-primary text-wowzer-primary px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-wowzer-lighter transition-colors">
            &larr; Back to Worksheet
          </button>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="max-w-[880px] mx-auto px-8 py-6 bg-white">
          {/* Header */}
          <div className="border-b-2 border-wowzer-primary pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-wowzer-darker">Written Information Security Plan</h1>
                <p className="text-base text-slate-600 mt-1">{firmName}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Prepared by: {userName}</p>
                <p>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-wowzer-primary font-semibold mt-1">Score: {pct}/100 &mdash; {band(pct)}</p>
              </div>
            </div>
          </div>

          {/* Score summary */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-wowzer-lighter rounded-lg">
            <div className="text-4xl font-bold text-wowzer-primary font-heading">{pct}<span className="text-lg text-slate-400 font-normal">/100</span></div>
            <div>
              <div className="font-bold text-wowzer-primary">{band(pct)}</div>
              <div className="text-xs text-slate-500">{G.length} gap{G.length === 1 ? '' : 's'} identified{critCount ? ` \u00b7 ${critCount} critical` : ''}</div>
            </div>
          </div>

          {/* Section 1: Firm */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">1. Your Firm</h2>
            <div className="grid grid-cols-2 gap-x-4">
              {renderField('Firm Legal Name', 'firmName')}
              {renderField('Address', 'firmAddr')}
              {renderField('Qualified Individual', 'qiName')}
              {renderField('Title', 'qiTitle')}
              {renderField('Phone', 'qiPhone')}
              {renderField('Email', 'qiEmail')}
              {renderField('Reports To', 'reportsTo')}
              {renderField('Individuals\' Information Held', 'consumers')}
              {renderField('Next Review Date', 'reviewDate')}
            </div>
          </div>

          {/* Section 2: Systems */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">2. Systems Inventory</h2>
            {renderTableRows('systems')}
          </div>

          {/* Section 3: Vendors */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">3. Vendor List</h2>
            {renderTableRows('vendors')}
          </div>

          {/* Section 4: MFA */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">4. Multi-Factor Authentication</h2>
            {renderCheck('Email — MFA on for everyone', 'mfaEmail')}
            {renderCheck('Accounting platform', 'mfaAcct')}
            {renderCheck('Tax software', 'mfaTax')}
            {renderCheck('Document storage', 'mfaDocs')}
            {renderCheck('Admin accounts', 'mfaAdmin')}
            {renderCheck('Everything else that holds client data', 'mfaAll')}
            {v('mfaExcept') && <div className="mt-2 text-sm"><span className="font-semibold text-slate-500">Exceptions:</span> {v('mfaExcept')}</div>}
          </div>

          {/* Section 5: Encryption, Access, Disposal */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">5. Encryption, Access &amp; Disposal</h2>
            {renderCheck('Data encrypted in transit', 'encTransit')}
            {renderCheck('Encrypted at rest in cloud', 'encCloud')}
            {renderCheck('Staff laptops and phones encrypted', 'encLaptop')}
            {renderCheck('Backups are encrypted', 'encBackup')}
            {renderField('Access Review Frequency', 'accessReview')}
            {renderField('Access Review Owner', 'accessOwner')}
            {renderField('Leaver Process', 'leaver')}
            {renderField('Retention Period', 'retain')}
            {renderField('Disposal Method', 'disposal')}
          </div>

          {/* Section 6: Backups */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">6. Backups</h2>
            {renderField('What is backed up, where, and how often', 'bakWhat')}
            {renderCheck('Backups are isolated or immutable', 'bakImmutable')}
            {renderCheck('Independent backups of client data', 'bakIndep')}
            {renderField('Last Restore Test', 'bakLast')}
            {renderField('Next Restore Test', 'bakNext')}
            {renderField('Who Restores a Client Ledger', 'bakWho')}
          </div>

          {/* Section 7: People */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">7. Staff &amp; Training</h2>
            {renderField('Training Provider', 'trainWho')}
            {renderField('Training Frequency', 'trainWhen')}
            {renderField('New Staff Training', 'trainNew')}
            {renderField('Last Phishing Test', 'phishLast')}
            {renderTableRows('staff')}
          </div>

          {/* Section 8: Money Movement */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">8. Money Movement Verification</h2>
            {renderCheck('Call-back rule in force', 'cbRule')}
            {renderCheck('Codeword for high-value transfers', 'cbCode')}
            {renderCheck('Staff told slowing down is safe', 'cbTold')}
            {renderField('Dual Approval Threshold', 'cbThresh')}
            {renderField('Approvers', 'cbWho')}
            {renderField('Call-back Procedure', 'cbProc')}
          </div>

          {/* Section 9: AI Inventory */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">9. AI Inventory</h2>
            {renderTableRows('ai')}
          </div>

          {/* Section 10: AI Rules */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">10. AI Governance Rules</h2>
            {renderField('RED — Never goes into unapproved tool', 'aiRed')}
            {renderField('AMBER — Allowed with stripped identifiers', 'aiAmber')}
            {renderField('GREEN — Fine anywhere approved', 'aiGreen')}
            {renderField('Approved AI tools', 'aiApproved')}
            {renderCheck('Staff use approved, protected accounts', 'aiPaid')}
            {renderCheck('Data not used to train vendor models', 'aiNoTrain')}
            {renderCheck('Engagement letters address AI use', 'aiEngage')}
            {renderCheck('\u00a77216 consent discussed with counsel', 'ai7216')}
            {renderCheck('Reading AI is separate from acting AI', 'aiSep')}
          </div>

          {/* Section 11: AI Monitoring */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">11. AI Monitoring</h2>
            {renderField('AI Activity Reviewer', 'aiWatcher')}
            {renderField('Review Frequency', 'aiWatchFreq')}
            {renderField('Provenance Method', 'aiProv')}
          </div>

          {/* Section 12: Incident Response */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">12. Incident Response</h2>
            {renderField('First Call', 'irFirst')}
            {renderField('First Call Phone', 'irFirstPhone')}
            {renderField('Cyber Insurer', 'irInsurer')}
            {renderField('Insurer Claims Line', 'irInsurerPhone')}
            {renderField('Legal Counsel', 'irLawyer')}
            {renderField('Counsel Phone', 'irLawyerPhone')}
            {renderField('Bank Fraud Line', 'irBank')}
            {renderField('IT Support / MSP', 'irIT')}
            {renderField('Client Notification', 'irClients')}
            {renderField('Applicable Laws', 'irStates')}
            {renderCheck('Breach log maintained', 'irLog')}
          </div>

          {/* Section 13: Testing */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">13. Security Testing</h2>
            {renderField('Last Vulnerability Scan', 'scanLast')}
            {renderField('Last Penetration Test', 'penLast')}
            {renderCheck('Test findings were fixed', 'penFixed')}
            {renderCheck('Fixes were re-tested', 'penRetest')}
            {renderField('Findings & Actions', 'penFindings')}
            {renderField('Next Test Scheduled', 'testNext')}
            {renderField('Test Owner', 'testOwner')}
          </div>

          {/* Gap Register */}
          {G.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-wowzer-darker border-b border-slate-200 pb-1 mb-3">Gap Register</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 w-20">Severity</th>
                    <th className="text-left border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">Gap</th>
                    <th className="text-left border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {G.map((g, i) => (
                    <tr key={i}>
                      <td className={`border border-slate-300 px-2 py-1 text-xs font-bold ${g.s === 'c' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'}`}>
                        {g.s === 'c' ? 'CRITICAL' : 'HIGH'}
                      </td>
                      <td className="border border-slate-300 px-2 py-1 text-xs font-semibold">{g.t}</td>
                      <td className="border border-slate-300 px-2 py-1 text-xs text-slate-600">{g.x}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-200 pt-4 mt-8 text-xs text-slate-400 text-center">
            Generated by the WOWzer Technologies WISP Workbook &middot; wowzer.tech/wisp-workbook &middot; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    );
  }

  /* =================================================================== */
  /* MAIN WORKBOOK VIEW                                                   */
  /* =================================================================== */
  return (
    <div className="max-w-[880px] mx-auto px-5 pb-28">
      {/* Progress bar */}
      <div className="h-[3px] bg-slate-100 sticky top-[49px] z-30">
        <div className="h-full bg-wowzer-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Hero */}
      <div className="pt-10 pb-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-wowzer-primary mb-3">Free &middot; No account &middot; Save as you go</div>
            <h1 className="font-heading font-semibold text-[38px] leading-[1.1] tracking-tight text-wowzer-text mb-3">Build Your Written Information Security Plan</h1>
            <p className="text-[17.5px] text-slate-500 leading-relaxed">Fill in the blanks. It&rsquo;s a workbook, not a quiz. What you type here becomes the actual text of your plan, and anything you leave blank becomes an honest gap with a date against it.</p>
          </div>
          <div className="flex items-center gap-3 text-sm print:hidden">
            <span className="text-slate-500">{wispUser.name}</span>
            <button onClick={handleSignOut} className="text-wowzer-primary hover:text-wowzer-dark underline text-sm">Sign out</button>
          </div>
        </div>
      </div>

      {/* Privacy panel */}
      <div className="my-6 border-2 border-wowzer-primary rounded-xl p-5 bg-wowzer-lighter">
        <h3 className="text-[14.5px] font-bold text-wowzer-primary mb-2">&#128274; Everything you type stays on this device</h3>
        <p className="text-[13.5px] text-slate-600 mb-2">Your plan is built <b className="text-wowzer-text">in this browser, on your machine</b>, and downloaded straight to your disk. Your answers are <b className="text-wowzer-text">never transmitted, never stored by us, and never seen by us</b>.</p>
        <p className="text-[13.5px] text-slate-600 mb-2">When you click Build, we receive <b className="text-wowzer-text">three things and nothing else: your name, your firm, and your email.</b> Nothing about your security.</p>
        <p className="text-[13.5px] text-slate-600">Your plan is <b className="text-wowzer-text">never emailed</b>, because emailing it would mean uploading it to us. It downloads to your machine, and it stays there.</p>
        <div className="mt-3 pt-3 border-t border-wowzer-light text-[13px] text-slate-400"><b className="text-wowzer-primary">Don&apos;t take our word for it. Check.</b> Open developer tools, watch the Network tab, and fill this in. You&apos;ll see your answers go nowhere.</div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap mb-2">
        <span className="text-[11.5px] text-green-600 font-semibold">{saved}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={clearAll} className="bg-white border border-wowzer-primary text-wowzer-primary rounded-lg px-3.5 py-2 text-[13px] font-semibold hover:bg-wowzer-lighter transition-colors">Clear</button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* SECTION 1 — FIRM */}
      <Section tag="Section 1" title="Your firm"
        law='&sect;314.4(a) &mdash; you must designate <b>one named individual</b> to oversee and implement the program.'
        plain="Security that is everyone's job is nobody's job. When a staffer sees something odd at 4pm on a Friday, they need to know whose problem it is. This person does not need to be technical. It can be you."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="firmName" label="Firm legal name" placeholder="Henderson &amp; Partners LLP" value={v('firmName')} onChange={onFieldChange} />
          <TextField dataKey="firmAddr" label="Address" placeholder="1 Main St, Springfield IL" value={v('firmAddr')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3">
          <TextField dataKey="qiName" label="Qualified Individual &mdash; full name" placeholder="Jane Partner" value={v('qiName')} onChange={onFieldChange} />
          <TextField dataKey="qiTitle" label="Their title" placeholder="Managing Partner" value={v('qiTitle')} onChange={onFieldChange} />
          <TextField dataKey="qiPhone" label="Direct phone" placeholder="+1 555 123 4567" value={v('qiPhone')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="qiEmail" label="Their email" placeholder="jane@firm.com" type="email" value={v('qiEmail')} onChange={onFieldChange} />
          <TextField dataKey="reportsTo" label="They report to" placeholder="The partners / the board" value={v('reportsTo')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="consumers" label="How many individuals' information do you hold?" placeholder="e.g. 850" type="number" value={v('consumers')} onChange={onFieldChange} optLabel="&mdash; people, not businesses" />
          <TextField dataKey="reviewDate" label="Next review date" type="date" value={v('reviewDate')} onChange={onFieldChange} />
        </div>
        <p className="text-[12.5px] text-slate-400">Under 5,000 and &sect;314.6 exempts you from four requirements. We&apos;ll apply that automatically.</p>
      </Section>

      {/* SECTION 2 — SYSTEMS */}
      <Section tag="Section 2" title="What you hold &mdash; and where"
        law='&sect;314.4(c)(2) &mdash; identify and manage the data, devices and systems that enable your business.'
        plain='Not &ldquo;the cloud&rdquo; &mdash; name the systems. The tax software. The accounting platform. The email. The shared drive. The laptop in someone&apos;s spare room. Almost every firm doing this finds something it forgot. <b>That forgotten thing is usually the one that gets you.</b>'
      >
        <DynTable tableKey="systems" cols={COLS.systems} rows={data.systems} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Examples: tax software &middot; accounting platform &middot; email &middot; document storage &middot; payroll &middot; staff laptops &middot; phones &middot; backup service." />
      </Section>

      {/* SECTION 3 — VENDORS */}
      <Section tag="Section 3" title="Who else can see your clients' data"
        law='&sect;314.4(f) &mdash; you must <b>select</b> service providers capable of appropriate safeguards, <b>require</b> them by contract, and <b>periodically assess</b> them.'
        plain='Your data path is rarely one hop. Every hop is a company holding your clients&apos; financial information. Sooner or later a client will ask, in writing, <b>&ldquo;which companies have access to our financial information?&rdquo;</b> That is a completely reasonable question, and &ldquo;I don&apos;t know&rdquo; is a bad answer.'
      >
        <DynTable tableKey="vendors" cols={COLS.vendors} rows={data.vendors} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Ask each one for their subprocessor list. Reputable ones publish it." />
      </Section>

      {/* SECTION 4 — MFA */}
      <Section tag="Section 4" title="Multi-factor authentication"
        law='&sect;314.4(c)(5) &mdash; MFA is required for <b>any individual accessing any information system</b>. Not &ldquo;where practical.&rdquo; Not &ldquo;encouraged.&rdquo;'
        plain='<b>This is the single most important page in this workbook.</b> Firms are not destroyed by anything exotic. Someone&apos;s password turns up in a breach dump, an attacker walks in the front door of the email account. MFA stops nearly all of it. It is usually free. It takes an hour.'
      >
        <Checkbox dataKey="mfaEmail" label="Email &mdash; MFA on for everyone" checked={!!data.mfaEmail} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAcct" label="Accounting platform" checked={!!data.mfaAcct} onChange={onCheckChange} />
        <Checkbox dataKey="mfaTax" label="Tax software" checked={!!data.mfaTax} onChange={onCheckChange} />
        <Checkbox dataKey="mfaDocs" label="Document storage" checked={!!data.mfaDocs} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAdmin" label="<b>Admin accounts</b> &mdash; the ones that can change settings or add users" checked={!!data.mfaAdmin} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAll" label="Everything else that holds client data" checked={!!data.mfaAll} onChange={onCheckChange} />
        <TextArea dataKey="mfaExcept" label="Any system that cannot support MFA &mdash; name it, and say what you do instead" placeholder="e.g. Legacy X has no MFA; access is restricted to two named people on the office network only." value={v('mfaExcept')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 5 — ENCRYPTION / ACCESS / DISPOSAL */}
      <Section tag="Section 5" title="Encryption, access and disposal"
        law='&sect;314.4(c)(3) encryption in transit and at rest &middot; &sect;314.4(c)(1) access controls &middot; &sect;314.4(c)(6) secure disposal &middot; &sect;314.4(c)(8) logging.'
        plain='The one everybody forgets is <b>laptops</b>. A stolen laptop with an unencrypted drive is a data breach with a police report attached &mdash; and BitLocker and FileVault are free and take ten minutes.'
      >
        <Checkbox dataKey="encTransit" label="Data is encrypted in transit (email, uploads, platform connections)" checked={!!data.encTransit} onChange={onCheckChange} />
        <Checkbox dataKey="encCloud" label="Encrypted at rest in cloud systems" checked={!!data.encCloud} onChange={onCheckChange} />
        <Checkbox dataKey="encLaptop" label="<b>Staff laptops and phones are encrypted</b> (BitLocker / FileVault)" checked={!!data.encLaptop} onChange={onCheckChange} />
        <Checkbox dataKey="encBackup" label="Backups are encrypted" checked={!!data.encBackup} onChange={onCheckChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 mt-4">
          <TextField dataKey="accessReview" label="How often do you review who-can-see-what?" placeholder="e.g. Quarterly" value={v('accessReview')} onChange={onFieldChange} />
          <TextField dataKey="accessOwner" label="Who does that review?" placeholder="e.g. Jane Partner" value={v('accessOwner')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="leaver" label="What happens to someone's access on their last day?" placeholder="e.g. Offboarding checklist: all logins disabled same day by [name]; devices returned; email forwarded for 30 days then closed." value={v('leaver')} onChange={onFieldChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="retain" label="How long do you keep client files?" placeholder="e.g. 7 years" value={v('retain')} onChange={onFieldChange} />
          <TextField dataKey="disposal" label="How is old data destroyed?" placeholder="e.g. Shredded; drives wiped before disposal" value={v('disposal')} onChange={onFieldChange} />
        </div>
      </Section>

      {/* SECTION 6 — BACKUPS */}
      <Section tag="Section 6" title="Backups &mdash; and the question nobody asks"
        law='Availability of customer information is part of a comprehensive program under &sect;314.3.'
        plain='<b>A backup is not a restore.</b> An untested backup is a hypothesis, and the day you discover the hypothesis was wrong is the day you needed it to be true.<br><br>Your clients&apos; books live in QuickBooks Online or Xero. <b>If a client&apos;s ledger were deleted, corrupted or encrypted tomorrow &mdash; who restores it?</b>'
      >
        <TextArea dataKey="bakWhat" label="What is backed up, where, and how often?" placeholder="e.g. All client files to [provider], nightly. Accounting data via [provider], daily." value={v('bakWhat')} onChange={onFieldChange} />
        <Checkbox dataKey="bakImmutable" label="Backups are isolated or immutable &mdash; ransomware cannot encrypt them too" checked={!!data.bakImmutable} onChange={onCheckChange} />
        <Checkbox dataKey="bakIndep" label="We hold <b>independent</b> backups of client accounting data &mdash; not just relying on the platform" checked={!!data.bakIndep} onChange={onCheckChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="bakLast" label="Date we last actually performed a restore, on purpose" type="date" value={v('bakLast')} onChange={onFieldChange} />
          <TextField dataKey="bakNext" label="Next restore test scheduled" type="date" value={v('bakNext')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="bakWho" label="We have read our platform's terms. Who restores a client's ledger if it is lost?" placeholder="Write down what the terms actually say. If you have not read them, leave this blank &mdash; it will appear in your gap register." value={v('bakWho')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 7 — PEOPLE */}
      <Section tag="Section 7" title="Your people"
        law='&sect;314.4(e) &mdash; security awareness training for personnel, kept current. <b>Not exempt for small firms.</b>'
        plain='Go back through every real-world failure. Not one of them was a firewall problem. <b>Every single one was a person, in a moment, doing something reasonable.</b> Your people are your last line. Arm them.'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="trainWho" label="Who provides your security training?" placeholder="e.g. [vendor], or in-house" value={v('trainWho')} onChange={onFieldChange} />
          <TextField dataKey="trainWhen" label="How often is it refreshed?" placeholder="e.g. Annually, every January" value={v('trainWhen')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="trainNew" label="New staff are trained within" placeholder="e.g. 30 days of start, before system access" value={v('trainNew')} onChange={onFieldChange} />
          <TextField dataKey="phishLast" label="Last simulated phishing test" type="date" value={v('phishLast')} onChange={onFieldChange} />
        </div>
        <DynTable tableKey="staff" cols={COLS.staff} rows={data.staff} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd} />
      </Section>

      {/* SECTION 8 — MONEY MOVEMENT */}
      <Section tag="Section 8" title="Verifying money movement"
        law='Not a single line in &sect;314.4 &mdash; but this is <b>where the actual losses happen</b>.'
        plain='In 2024 a finance worker at Arup paid out about <b>US$25 million</b> after a video call with what he believed were his CFO and colleagues. Every person on that call was a digital fake. You will not out-perceive the fakes. You just have to move the last check onto a channel the attacker doesn&apos;t control.'
      >
        <Checkbox dataKey="cbRule" label="<b>Call-back rule:</b> any request to move money or change bank details is verified by calling a <b>known, pre-saved number</b>" checked={!!data.cbRule} onChange={onCheckChange} />
        <Checkbox dataKey="cbCode" label="We use a codeword for unusual or high-value transfers, agreed in advance" checked={!!data.cbCode} onChange={onCheckChange} />
        <Checkbox dataKey="cbTold" label="Staff have been told that <b>slowing down a genuine payment will never get them in trouble</b>" checked={!!data.cbTold} onChange={onCheckChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="cbThresh" label="Two people must approve payments above" placeholder="e.g. $5,000" value={v('cbThresh')} onChange={onFieldChange} />
          <TextField dataKey="cbWho" label="Who are the two approvers?" placeholder="e.g. Jane Partner and Sam Ops" value={v('cbWho')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="cbProc" label="Write the rule in your own words &mdash; this goes into the plan verbatim" placeholder="e.g. Any request to change vendor bank details must be confirmed by phoning the requester on the number stored in our contacts." value={v('cbProc')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 9 — AI INVENTORY */}
      <Section tag="Section 9" title="AI &mdash; what is in your firm, and what can it DO"
        law='&sect;314.4(c)(2) &mdash; your inventory must include <b>all</b> systems touching client information; an AI tool a staffer signed up for is a system.'
        plain='<b>The most important table in this workbook, and almost no firm can fill it in.</b> There is a difference between a chatbot and an agent. A <b>chatbot</b> produces text. An <b>agent</b> produces text <i>and does things</i>. Every control you have ever relied on assumes a human is the last step. <b>An agent is on the other side of that gate.</b>'
      >
        <div className="border border-red-300 bg-red-50 rounded-lg p-4 mb-4">
          <b className="text-red-600 block mb-1 text-[13px]">Fill in the last two columns carefully.</b>
          <p className="text-[13.5px] text-slate-600">For every AI that can move money, send externally, or change a record &mdash; is there a human approving <b>that specific action</b>, every time? If the answer is &ldquo;never&rdquo; or &ldquo;I didn&apos;t know we had it&rdquo; &mdash; <b>remove it.</b></p>
        </div>
        <DynTable tableKey="ai" cols={COLS.ai} rows={data.ai} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Don&apos;t forget: meeting note-takers &middot; browser extensions &middot; AI baked into apps &middot; personal ChatGPT/Claude accounts &middot; Make/Zapier scenarios." />
      </Section>

      {/* SECTION 10 — AI RULES */}
      <Section tag="Section 10" title="AI &mdash; the rules you set"
        law='&sect;314.4(c)(3). <b>And if you prepare tax returns: IRC &sect;7216</b> makes it an offence for a preparer to knowingly or recklessly disclose tax return information &mdash; a <b>misdemeanor</b>.'
        plain='The likeliest way client data leaves your firm this year is not a hacker. It is a good employee at 9pm, under pressure, pasting a client&apos;s ledger into a free chatbot. That is a disclosure of client information to a third party.'
      >
        <TextArea dataKey="aiRed" label="RED &mdash; never goes into an unapproved tool" placeholder="SSNs &middot; bank and account numbers &middot; full client ledgers &middot; payroll detail &middot; passwords" value={v('aiRed')} onChange={onFieldChange} />
        <TextArea dataKey="aiAmber" label="AMBER &mdash; allowed, but strip identifiers first" placeholder="Draft narratives &middot; redacted or anonymised figures" value={v('aiAmber')} onChange={onFieldChange} />
        <TextArea dataKey="aiGreen" label="GREEN &mdash; fine anywhere approved" placeholder="Public information &middot; general how-to questions &middot; research that touches no client" value={v('aiGreen')} onChange={onFieldChange} />
        <TextField dataKey="aiApproved" label="Our approved AI tools are" placeholder="e.g. Firm ChatGPT Team account; Copilot in M365" value={v('aiApproved')} onChange={onFieldChange} />
        <Checkbox dataKey="aiPaid" label="Staff use <b>approved, protected</b> accounts &mdash; not personal free ones" checked={!!data.aiPaid} onChange={onCheckChange} />
        <Checkbox dataKey="aiNoTrain" label="We have confirmed <b>contractually</b> that our data is not used to train the vendor's models" checked={!!data.aiNoTrain} onChange={onCheckChange} />
        <Checkbox dataKey="aiEngage" label="Our engagement letters address AI use and third-party disclosure" checked={!!data.aiEngage} onChange={onCheckChange} />
        <Checkbox dataKey="ai7216" label="We have spoken to counsel about &sect;7216 consent" checked={!!data.ai7216} onChange={onCheckChange} />
        <Checkbox dataKey="aiSep" label="<b>The AI that reads our incoming documents is separate from anything that can send or pay</b>" checked={!!data.aiSep} onChange={onCheckChange} />
        <p className="text-[12.5px] text-slate-400 mt-1">That last one matters more than it looks. If a document your AI reads can contain instructions &mdash; and it can &mdash; then a malicious invoice can carry instructions to the assistant that is able to pay it.</p>
      </Section>

      {/* SECTION 11 — AI MONITORING */}
      <Section tag="Section 11" title="AI &mdash; would you notice, and could you prove it?"
        law='&sect;314.4(c)(8) &mdash; logging and monitoring of authorised users. An AI acting on your behalf is activity that must be visible.'
        plain='Two things. <b>Detect:</b> does a <i>named</i> human see a list of what the AI actually did? An alert that goes to a shared inbox goes nowhere. <b>Prove:</b> if a client asked &ldquo;that email on the 14th &mdash; where did that come from?&rdquo;, could you answer with a record rather than a recollection?'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="aiWatcher" label="Who reviews what the AI actually did?" placeholder="A named person &mdash; not 'the team'" value={v('aiWatcher')} onChange={onFieldChange} />
          <TextField dataKey="aiWatchFreq" label="How often?" placeholder="e.g. Daily / weekly" value={v('aiWatchFreq')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="aiProv" label="How is AI-generated output identifiable after the fact?" placeholder="e.g. A note in the workpaper recording which tool, when, and what it was asked." value={v('aiProv')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 12 — INCIDENT RESPONSE */}
      <Section tag="Section 12" title="When something goes wrong"
        law='&sect;314.4(h) &mdash; a written incident response plan covering roles, communications, remediation and post-incident revision.'
        plain='<b>You will not be thinking clearly on the day.</b> That is the entire reason this gets written down now, while you are calm and nothing is on fire. Fill in the phone numbers. You will not be looking them up calmly at 4pm on a Friday.'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="irFirst" label="Who does a staff member call, immediately?" placeholder="Name" value={v('irFirst')} onChange={onFieldChange} />
          <TextField dataKey="irFirstPhone" label="Their phone" type="tel" value={v('irFirstPhone')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="irInsurer" label="Cyber insurer + policy number" placeholder="Look it up now" value={v('irInsurer')} onChange={onFieldChange} />
          <TextField dataKey="irInsurerPhone" label="Insurer claims line" type="tel" value={v('irInsurerPhone')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="irLawyer" label="Legal counsel" placeholder="Name and firm" value={v('irLawyer')} onChange={onFieldChange} />
          <TextField dataKey="irLawyerPhone" label="Their phone" type="tel" value={v('irLawyerPhone')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="irBank" label="Bank fraud line" type="tel" value={v('irBank')} onChange={onFieldChange} />
          <TextField dataKey="irIT" label="IT support / MSP" value={v('irIT')} onChange={onFieldChange} />
        </div>
        <TextField dataKey="irClients" label="Who tells the clients, and when?" placeholder="e.g. Jane Partner, within 24 hours of confirming a breach" value={v('irClients')} onChange={onFieldChange} />
        <TextArea dataKey="irStates" label="Which breach-notification laws apply to you?" placeholder="US: state laws vary. Canada: PIPEDA requires reporting to the Privacy Commissioner where there is a real risk of significant harm." value={v('irStates')} onChange={onFieldChange} />
        <Checkbox dataKey="irLog" label="We keep a breach log &mdash; including breaches we concluded were harmless" checked={!!data.irLog} onChange={onCheckChange} />
      </Section>

      {/* SECTION 13 — TESTING */}
      <Section tag="Section 13" title="Has anyone actually tried to break in?"
        law='&sect;314.4(d) &mdash; continuous monitoring, <b>or</b> annual penetration testing plus vulnerability assessments every six months.'
        plain='A <b>scan</b> looks for known weaknesses. A <b>penetration test</b> hires someone to actually try to get in. <b>Until somebody has actually tried, everything you believe about your defences is a belief.</b>'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="scanLast" label="Last vulnerability scan" type="date" value={v('scanLast')} onChange={onFieldChange} />
          <TextField dataKey="penLast" label="Last penetration test" type="date" value={v('penLast')} onChange={onFieldChange} />
        </div>
        <Checkbox dataKey="penFixed" label="Findings from the last test were <b>fixed, with dates</b> &mdash; not just filed" checked={!!data.penFixed} onChange={onCheckChange} />
        <Checkbox dataKey="penRetest" label="We re-tested to confirm the fixes held" checked={!!data.penRetest} onChange={onCheckChange} />
        <TextArea dataKey="penFindings" label="What did the last test find, and what did you do about it?" placeholder="If findings were filed and not fixed, say so." value={v('penFindings')} onChange={onFieldChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="testNext" label="Next test scheduled" type="date" value={v('testNext')} onChange={onFieldChange} />
          <TextField dataKey="testOwner" label="Who owns it?" value={v('testOwner')} onChange={onFieldChange} />
        </div>
      </Section>

      {/* ================================================================== */}
      {/* BUILD PANEL */}
      {!showResult && (
        <div className="mt-9 border border-slate-200 rounded-xl p-7 bg-slate-50">
          <h3 className="font-heading font-semibold text-[22px] text-wowzer-text mb-2">Build your plan</h3>
          <p className="text-[14.5px] text-slate-500 mb-4">{progress < 100 ? `${progress}% complete. Fill in what you can \u2014 blanks become gaps, and that\u2019s the point.` : 'Complete. Build your plan.'}</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleBuild} className="bg-wowzer-primary text-white border-none rounded-lg px-5 py-3 text-sm font-semibold cursor-pointer hover:bg-wowzer-dark transition-colors">Build my WISP (.docx)</button>
            <button onClick={() => downloadTxt(data, userName, firmName)} className="bg-white text-wowzer-primary border border-wowzer-primary rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-lighter transition-colors">Plain text</button>
            <button onClick={handlePrint} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Printable Worksheet
            </button>
          </div>
          <p className="text-[12.5px] text-slate-400 mt-3">Generated on your device &mdash; we never see your answers.</p>
        </div>
      )}

      {/* RESULTS PANEL */}
      {showResult && (
        <div className="mt-7">
          {/* Score */}
          <div className="border-2 border-wowzer-primary rounded-xl p-5 mb-5 bg-wowzer-lighter flex items-center gap-5 flex-wrap">
            <div className="text-5xl font-bold text-wowzer-primary font-heading leading-none">{pct}<small className="text-xl text-slate-400 font-normal"> / 100</small></div>
            <div>
              <div className="text-base font-bold text-wowzer-primary">{band(pct)}</div>
              <p className="text-[12.5px] text-slate-400 mt-0.5">Computed on your device. Never transmitted, never seen by us.</p>
              <div className="w-full h-2 rounded bg-wowzer-light overflow-hidden mt-1"><div className="h-full bg-wowzer-primary" style={{ width: `${pct}%` }} /></div>
            </div>
          </div>

          {/* Gaps */}
          <div className="border border-slate-200 rounded-xl p-5 mb-5">
            <h4 className="text-[11px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-3">{G.length} gap{G.length === 1 ? '' : 's'} carried into your plan{critCount ? ` \u00b7 ${critCount} critical` : ''}</h4>
            {G.length === 0 && <div className="text-sm text-green-600">No gaps identified.</div>}
            {G.map((g, i) => (
              <div key={i} className="flex gap-2.5 p-2.5 border border-slate-200 rounded-md mb-1.5 text-[13.5px]">
                <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded h-fit whitespace-nowrap ${g.s === 'c' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{g.s === 'c' ? 'CRITICAL' : 'HIGH'}</span>
                <div><b>{g.t}</b><br/><span className="text-slate-500">{g.x}</span></div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="text-[11px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-2 mt-5">Your WISP &mdash; preview</div>
          <div className="border border-slate-200 rounded-xl bg-white max-h-[400px] overflow-auto p-5 font-mono text-[12px] leading-relaxed text-slate-500 whitespace-pre-wrap">
            {buildPlainText(data, userName, firmName)}
          </div>

          {/* Download buttons */}
          <div className="flex gap-3 flex-wrap mt-4">
            <button onClick={() => downloadDocx(data, userName, firmName)} className="bg-wowzer-primary text-white rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-dark transition-colors">&darr; Download your WISP (.docx)</button>
            <button onClick={() => downloadTxt(data, userName, firmName)} className="bg-white text-wowzer-primary border border-wowzer-primary rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-lighter transition-colors">Plain text</button>
            <button onClick={handlePrint} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Printable Worksheet
            </button>
            <button onClick={() => setShowResult(false)} className="bg-white text-wowzer-primary border border-wowzer-primary rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-lighter transition-colors">&larr; Keep editing</button>
          </div>
          <p className="text-[12.5px] text-slate-400 mt-3">Downloaded straight from your browser &mdash; this file never touched our servers.</p>
        </div>
      )}

      {/* Protocol note */}
      <div className="mt-8 p-4 border border-dashed border-slate-200 rounded-lg text-[12.5px] text-slate-400 leading-relaxed">
        <b>Your plan is never emailed.</b> It is assembled on your device as a Word document and downloaded to your disk. The only thing we receive is a three-field note &mdash; name, firm, email &mdash; so we know a firm built a plan. Nothing about your security travels with it.
      </div>
    </div>
  );
}
