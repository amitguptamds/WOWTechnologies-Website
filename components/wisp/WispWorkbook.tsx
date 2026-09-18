'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WispData, COLS, defaultData, computeProgress, scorePct, band, gaps } from './wispUtils';
import { downloadDocx, downloadTxt, buildPlainText } from './wispDocx';
import { Section, TextField, TextArea, Checkbox, DynTable } from './WispSection';

export default function WispWorkbook() {
  const [data, setData] = useState<WispData>(defaultData());
  const [saved, setSaved] = useState('');
  const [you, setYou] = useState('');
  const [firm, setFirm] = useState('');
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wisp');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.systems = parsed.systems || [{}];
        parsed.vendors = parsed.vendors || [{}];
        parsed.ai = parsed.ai || [{}];
        parsed.staff = parsed.staff || [{}];
        setData(parsed);
        if (parsed.firmName) setFirm(parsed.firmName);
      }
    } catch {}
    setMounted(true);
  }, []);

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
      setYou(''); setFirm(''); setEmail('');
    }
  };

  const v = (k: string) => (data[k] || '').toString().trim();
  const progress = mounted ? computeProgress(data) : 0;
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const handleBuild = () => {
    if (!validEmail) return;
    setShowResult(true);
    downloadDocx(data, you || v('qiName') || '[NAME]', firm || v('firmName') || '[FIRM NAME]');
  };

  const pct = mounted ? scorePct(data) : 0;
  const G = mounted ? gaps(data) : [];
  const critCount = G.filter(g => g.s === 'c').length;

  return (
    <div className="max-w-[880px] mx-auto px-5 pb-28">
      {/* Progress bar */}
      <div className="h-[3px] bg-slate-100 sticky top-[49px] z-30">
        <div className="h-full bg-wowzer-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Hero */}
      <div className="pt-10 pb-5">
        <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-wowzer-primary mb-3">Free · No account · Save as you go</div>
        <h1 className="font-heading font-semibold text-[38px] leading-[1.1] tracking-tight text-wowzer-text mb-3">Build Your Written Information Security Plan</h1>
        <p className="text-[17.5px] text-slate-500 leading-relaxed">Fill in the blanks. It&rsquo;s a workbook, not a quiz. What you type here becomes the actual text of your plan, and anything you leave blank becomes an honest gap with a date against it.</p>
      </div>

      {/* Privacy panel */}
      <div className="my-6 border-2 border-wowzer-primary rounded-xl p-5 bg-wowzer-lighter">
        <h3 className="text-[14.5px] font-bold text-wowzer-primary mb-2">🔒 Everything you type stays on this device</h3>
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
        law='§314.4(a) — you must designate <b>one named individual</b> to oversee and implement the program.'
        plain="Security that is everyone's job is nobody's job. When a staffer sees something odd at 4pm on a Friday, they need to know whose problem it is. This person does not need to be technical. It can be you."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="firmName" label="Firm legal name" placeholder="Henderson & Partners LLP" value={v('firmName')} onChange={onFieldChange} />
          <TextField dataKey="firmAddr" label="Address" placeholder="1 Main St, Springfield IL" value={v('firmAddr')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3">
          <TextField dataKey="qiName" label="Qualified Individual — full name" placeholder="Jane Partner" value={v('qiName')} onChange={onFieldChange} />
          <TextField dataKey="qiTitle" label="Their title" placeholder="Managing Partner" value={v('qiTitle')} onChange={onFieldChange} />
          <TextField dataKey="qiPhone" label="Direct phone" placeholder="+1 555 123 4567" value={v('qiPhone')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="qiEmail" label="Their email" placeholder="jane@firm.com" type="email" value={v('qiEmail')} onChange={onFieldChange} />
          <TextField dataKey="reportsTo" label="They report to" placeholder="The partners / the board" value={v('reportsTo')} onChange={onFieldChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="consumers" label="How many individuals' information do you hold?" placeholder="e.g. 850" type="number" value={v('consumers')} onChange={onFieldChange} optLabel="— people, not businesses" />
          <TextField dataKey="reviewDate" label="Next review date" type="date" value={v('reviewDate')} onChange={onFieldChange} />
        </div>
        <p className="text-[12.5px] text-slate-400">Under 5,000 and §314.6 exempts you from four requirements. We&apos;ll apply that automatically.</p>
      </Section>

      {/* SECTION 2 — SYSTEMS */}
      <Section tag="Section 2" title="What you hold — and where"
        law='§314.4(c)(2) — identify and manage the data, devices and systems that enable your business.'
        plain='Not "the cloud" — name the systems. The tax software. The accounting platform. The email. The shared drive. The laptop in someone&apos;s spare room. Almost every firm doing this finds something it forgot. <b>That forgotten thing is usually the one that gets you.</b>'
      >
        <DynTable tableKey="systems" cols={COLS.systems} rows={data.systems} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Examples: tax software · accounting platform · email · document storage · payroll · staff laptops · phones · backup service." />
      </Section>

      {/* SECTION 3 — VENDORS */}
      <Section tag="Section 3" title="Who else can see your clients' data"
        law='§314.4(f) — you must <b>select</b> service providers capable of appropriate safeguards, <b>require</b> them by contract, and <b>periodically assess</b> them.'
        plain='Your data path is rarely one hop. Every hop is a company holding your clients&apos; financial information. Sooner or later a client will ask, in writing, <b>"which companies have access to our financial information?"</b> That is a completely reasonable question, and "I don&apos;t know" is a bad answer.'
      >
        <DynTable tableKey="vendors" cols={COLS.vendors} rows={data.vendors} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Ask each one for their subprocessor list. Reputable ones publish it." />
      </Section>

      {/* SECTION 4 — MFA */}
      <Section tag="Section 4" title="Multi-factor authentication"
        law='§314.4(c)(5) — MFA is required for <b>any individual accessing any information system</b>. Not "where practical." Not "encouraged."'
        plain='<b>This is the single most important page in this workbook.</b> Firms are not destroyed by anything exotic. Someone&apos;s password turns up in a breach dump, an attacker walks in the front door of the email account. MFA stops nearly all of it. It is usually free. It takes an hour.'
      >
        <Checkbox dataKey="mfaEmail" label="Email — MFA on for everyone" checked={!!data.mfaEmail} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAcct" label="Accounting platform" checked={!!data.mfaAcct} onChange={onCheckChange} />
        <Checkbox dataKey="mfaTax" label="Tax software" checked={!!data.mfaTax} onChange={onCheckChange} />
        <Checkbox dataKey="mfaDocs" label="Document storage" checked={!!data.mfaDocs} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAdmin" label="<b>Admin accounts</b> — the ones that can change settings or add users" checked={!!data.mfaAdmin} onChange={onCheckChange} />
        <Checkbox dataKey="mfaAll" label="Everything else that holds client data" checked={!!data.mfaAll} onChange={onCheckChange} />
        <TextArea dataKey="mfaExcept" label="Any system that cannot support MFA — name it, and say what you do instead" placeholder="e.g. Legacy X has no MFA; access is restricted to two named people on the office network only." value={v('mfaExcept')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 5 — ENCRYPTION / ACCESS / DISPOSAL */}
      <Section tag="Section 5" title="Encryption, access and disposal"
        law='§314.4(c)(3) encryption in transit and at rest · §314.4(c)(1) access controls · §314.4(c)(6) secure disposal · §314.4(c)(8) logging.'
        plain='The one everybody forgets is <b>laptops</b>. A stolen laptop with an unencrypted drive is a data breach with a police report attached — and BitLocker and FileVault are free and take ten minutes.'
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
      <Section tag="Section 6" title="Backups — and the question nobody asks"
        law='Availability of customer information is part of a comprehensive program under §314.3.'
        plain='<b>A backup is not a restore.</b> An untested backup is a hypothesis, and the day you discover the hypothesis was wrong is the day you needed it to be true.<br><br>Your clients&apos; books live in QuickBooks Online or Xero. <b>If a client&apos;s ledger were deleted, corrupted or encrypted tomorrow — who restores it?</b>'
      >
        <TextArea dataKey="bakWhat" label="What is backed up, where, and how often?" placeholder="e.g. All client files to [provider], nightly. Accounting data via [provider], daily." value={v('bakWhat')} onChange={onFieldChange} />
        <Checkbox dataKey="bakImmutable" label="Backups are isolated or immutable — ransomware cannot encrypt them too" checked={!!data.bakImmutable} onChange={onCheckChange} />
        <Checkbox dataKey="bakIndep" label="We hold <b>independent</b> backups of client accounting data — not just relying on the platform" checked={!!data.bakIndep} onChange={onCheckChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="bakLast" label="Date we last actually performed a restore, on purpose" type="date" value={v('bakLast')} onChange={onFieldChange} />
          <TextField dataKey="bakNext" label="Next restore test scheduled" type="date" value={v('bakNext')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="bakWho" label="We have read our platform's terms. Who restores a client's ledger if it is lost?" placeholder="Write down what the terms actually say. If you have not read them, leave this blank — it will appear in your gap register." value={v('bakWho')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 7 — PEOPLE */}
      <Section tag="Section 7" title="Your people"
        law='§314.4(e) — security awareness training for personnel, kept current. <b>Not exempt for small firms.</b>'
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
        law='Not a single line in §314.4 — but this is <b>where the actual losses happen</b>.'
        plain='In 2024 a finance worker at Arup paid out about <b>US$25 million</b> after a video call with what he believed were his CFO and colleagues. Every person on that call was a digital fake. You will not out-perceive the fakes. You just have to move the last check onto a channel the attacker doesn&apos;t control.'
      >
        <Checkbox dataKey="cbRule" label="<b>Call-back rule:</b> any request to move money or change bank details is verified by calling a <b>known, pre-saved number</b>" checked={!!data.cbRule} onChange={onCheckChange} />
        <Checkbox dataKey="cbCode" label="We use a codeword for unusual or high-value transfers, agreed in advance" checked={!!data.cbCode} onChange={onCheckChange} />
        <Checkbox dataKey="cbTold" label="Staff have been told that <b>slowing down a genuine payment will never get them in trouble</b>" checked={!!data.cbTold} onChange={onCheckChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="cbThresh" label="Two people must approve payments above" placeholder="e.g. $5,000" value={v('cbThresh')} onChange={onFieldChange} />
          <TextField dataKey="cbWho" label="Who are the two approvers?" placeholder="e.g. Jane Partner and Sam Ops" value={v('cbWho')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="cbProc" label="Write the rule in your own words — this goes into the plan verbatim" placeholder="e.g. Any request to change vendor bank details must be confirmed by phoning the requester on the number stored in our contacts." value={v('cbProc')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 9 — AI INVENTORY */}
      <Section tag="Section 9" title="AI — what is in your firm, and what can it DO"
        law='§314.4(c)(2) — your inventory must include <b>all</b> systems touching client information; an AI tool a staffer signed up for is a system.'
        plain='<b>The most important table in this workbook, and almost no firm can fill it in.</b> There is a difference between a chatbot and an agent. A <b>chatbot</b> produces text. An <b>agent</b> produces text <i>and does things</i>. Every control you have ever relied on assumes a human is the last step. <b>An agent is on the other side of that gate.</b>'
      >
        <div className="border border-red-300 bg-red-50 rounded-lg p-4 mb-4">
          <b className="text-red-600 block mb-1 text-[13px]">Fill in the last two columns carefully.</b>
          <p className="text-[13.5px] text-slate-600">For every AI that can move money, send externally, or change a record — is there a human approving <b>that specific action</b>, every time? If the answer is &ldquo;never&rdquo; or &ldquo;I didn&apos;t know we had it&rdquo; — <b>remove it.</b></p>
        </div>
        <DynTable tableKey="ai" cols={COLS.ai} rows={data.ai} onRowChange={onRowChange} onAddRow={onAddRow} onDeleteRow={onDeleteRow} onQuickAdd={onQuickAdd}
          hint="Don't forget: meeting note-takers · browser extensions · AI baked into apps · personal ChatGPT/Claude accounts · Make/Zapier scenarios." />
      </Section>

      {/* SECTION 10 — AI RULES */}
      <Section tag="Section 10" title="AI — the rules you set"
        law='§314.4(c)(3). <b>And if you prepare tax returns: IRC §7216</b> makes it an offence for a preparer to knowingly or recklessly disclose tax return information — a <b>misdemeanor</b>.'
        plain='The likeliest way client data leaves your firm this year is not a hacker. It is a good employee at 9pm, under pressure, pasting a client&apos;s ledger into a free chatbot. That is a disclosure of client information to a third party.'
      >
        <TextArea dataKey="aiRed" label="RED — never goes into an unapproved tool" placeholder="SSNs · bank and account numbers · full client ledgers · payroll detail · passwords" value={v('aiRed')} onChange={onFieldChange} />
        <TextArea dataKey="aiAmber" label="AMBER — allowed, but strip identifiers first" placeholder="Draft narratives · redacted or anonymised figures" value={v('aiAmber')} onChange={onFieldChange} />
        <TextArea dataKey="aiGreen" label="GREEN — fine anywhere approved" placeholder="Public information · general how-to questions · research that touches no client" value={v('aiGreen')} onChange={onFieldChange} />
        <TextField dataKey="aiApproved" label="Our approved AI tools are" placeholder="e.g. Firm ChatGPT Team account; Copilot in M365" value={v('aiApproved')} onChange={onFieldChange} />
        <Checkbox dataKey="aiPaid" label="Staff use <b>approved, protected</b> accounts — not personal free ones" checked={!!data.aiPaid} onChange={onCheckChange} />
        <Checkbox dataKey="aiNoTrain" label="We have confirmed <b>contractually</b> that our data is not used to train the vendor's models" checked={!!data.aiNoTrain} onChange={onCheckChange} />
        <Checkbox dataKey="aiEngage" label="Our engagement letters address AI use and third-party disclosure" checked={!!data.aiEngage} onChange={onCheckChange} />
        <Checkbox dataKey="ai7216" label="We have spoken to counsel about §7216 consent" checked={!!data.ai7216} onChange={onCheckChange} />
        <Checkbox dataKey="aiSep" label="<b>The AI that reads our incoming documents is separate from anything that can send or pay</b>" checked={!!data.aiSep} onChange={onCheckChange} />
        <p className="text-[12.5px] text-slate-400 mt-1">That last one matters more than it looks. If a document your AI reads can contain instructions — and it can — then a malicious invoice can carry instructions to the assistant that is able to pay it.</p>
      </Section>

      {/* SECTION 11 — AI MONITORING */}
      <Section tag="Section 11" title="AI — would you notice, and could you prove it?"
        law='§314.4(c)(8) — logging and monitoring of authorised users. An AI acting on your behalf is activity that must be visible.'
        plain='Two things. <b>Detect:</b> does a <i>named</i> human see a list of what the AI actually did? An alert that goes to a shared inbox goes nowhere. <b>Prove:</b> if a client asked "that email on the 14th — where did that come from?", could you answer with a record rather than a recollection?'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="aiWatcher" label="Who reviews what the AI actually did?" placeholder="A named person — not 'the team'" value={v('aiWatcher')} onChange={onFieldChange} />
          <TextField dataKey="aiWatchFreq" label="How often?" placeholder="e.g. Daily / weekly" value={v('aiWatchFreq')} onChange={onFieldChange} />
        </div>
        <TextArea dataKey="aiProv" label="How is AI-generated output identifiable after the fact?" placeholder="e.g. A note in the workpaper recording which tool, when, and what it was asked." value={v('aiProv')} onChange={onFieldChange} />
      </Section>

      {/* SECTION 12 — INCIDENT RESPONSE */}
      <Section tag="Section 12" title="When something goes wrong"
        law='§314.4(h) — a written incident response plan covering roles, communications, remediation and post-incident revision.'
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
        <Checkbox dataKey="irLog" label="We keep a breach log — including breaches we concluded were harmless" checked={!!data.irLog} onChange={onCheckChange} />
      </Section>

      {/* SECTION 13 — TESTING */}
      <Section tag="Section 13" title="Has anyone actually tried to break in?"
        law='§314.4(d) — continuous monitoring, <b>or</b> annual penetration testing plus vulnerability assessments every six months.'
        plain='A <b>scan</b> looks for known weaknesses. A <b>penetration test</b> hires someone to actually try to get in. <b>Until somebody has actually tried, everything you believe about your defences is a belief.</b>'
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <TextField dataKey="scanLast" label="Last vulnerability scan" type="date" value={v('scanLast')} onChange={onFieldChange} />
          <TextField dataKey="penLast" label="Last penetration test" type="date" value={v('penLast')} onChange={onFieldChange} />
        </div>
        <Checkbox dataKey="penFixed" label="Findings from the last test were <b>fixed, with dates</b> — not just filed" checked={!!data.penFixed} onChange={onCheckChange} />
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
          <p className="text-[14.5px] text-slate-500 mb-4">{progress < 100 ? `${progress}% complete. Fill in what you can — blanks become gaps, and that's the point.` : 'Complete. Build your plan.'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Your name</label><input type="text" value={you} onChange={e => setYou(e.target.value)} placeholder="Jane Partner" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wowzer-primary/20 focus:border-wowzer-primary" /></div>
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Your firm</label><input type="text" value={firm} onChange={e => setFirm(e.target.value)} placeholder="Henderson & Partners LLP" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wowzer-primary/20 focus:border-wowzer-primary" /></div>
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Your email <span className="font-normal text-slate-400">— unlocks Build</span></label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@firm.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wowzer-primary/20 focus:border-wowzer-primary" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleBuild} disabled={!validEmail} className="bg-wowzer-primary text-white border-none rounded-lg px-5 py-3 text-sm font-semibold cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-wowzer-dark transition-colors">Build my WISP</button>
          </div>
          <p className="text-[12.5px] text-slate-400 mt-3">{validEmail ? 'Ready. Building generates the document on your device and sends only your name, firm and email.' : 'Enter a valid email to build. Generated on your device — we never see your answers.'}</p>
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
            <h4 className="text-[11px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-3">{G.length} gap{G.length === 1 ? '' : 's'} carried into your plan{critCount ? ` · ${critCount} critical` : ''}</h4>
            {G.length === 0 && <div className="text-sm text-green-600">No gaps identified.</div>}
            {G.map((g, i) => (
              <div key={i} className="flex gap-2.5 p-2.5 border border-slate-200 rounded-md mb-1.5 text-[13.5px]">
                <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded h-fit whitespace-nowrap ${g.s === 'c' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{g.s === 'c' ? 'CRITICAL' : 'HIGH'}</span>
                <div><b>{g.t}</b><br/><span className="text-slate-500">{g.x}</span></div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="text-[11px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-2 mt-5">Your WISP — preview</div>
          <div className="border border-slate-200 rounded-xl bg-white max-h-[400px] overflow-auto p-5 font-mono text-[12px] leading-relaxed text-slate-500 whitespace-pre-wrap">
            {buildPlainText(data, you || v('qiName') || '[NAME]', firm || v('firmName') || '[FIRM NAME]')}
          </div>

          {/* Download buttons */}
          <div className="flex gap-3 flex-wrap mt-4">
            <button onClick={() => downloadDocx(data, you || v('qiName') || '[NAME]', firm || v('firmName') || '[FIRM NAME]')} className="bg-wowzer-primary text-white rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-dark transition-colors">⬇ Download your WISP (.docx)</button>
            <button onClick={() => downloadTxt(data, you || v('qiName') || '[NAME]', firm || v('firmName') || '[FIRM NAME]')} className="bg-white text-wowzer-primary border border-wowzer-primary rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-lighter transition-colors">Plain text</button>
            <button onClick={() => setShowResult(false)} className="bg-white text-wowzer-primary border border-wowzer-primary rounded-lg px-5 py-3 text-sm font-semibold hover:bg-wowzer-lighter transition-colors">← Keep editing</button>
          </div>
          <p className="text-[12.5px] text-slate-400 mt-3">Downloaded straight from your browser — this file never touched our servers.</p>
        </div>
      )}

      {/* Protocol note */}
      <div className="mt-8 p-4 border border-dashed border-slate-200 rounded-lg text-[12.5px] text-slate-400 leading-relaxed">
        <b>Your plan is never emailed.</b> It is assembled on your device as a Word document and downloaded to your disk. The only thing we receive is a three-field note — name, firm, email — so we know a firm built a plan. Nothing about your security travels with it.
      </div>
    </div>
  );
}
