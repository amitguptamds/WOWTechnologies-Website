'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MODULES, FINAL_EXAM, PASS_PCT } from './trainingData';
import emailjs from '@emailjs/browser';

type User = {
  name: string;
  org: string;
  email: string;
};

type CourseState = {
  completedModules: string[];
  moduleQuizState: Record<string, Record<number, number>>;
  finalExamState: Record<number, number>;
  finalScore: number | null;
  certId: string | null;
  certDate: string | null;
};

export default function CyberTraining() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<CourseState>({
    completedModules: [],
    moduleQuizState: {},
    finalExamState: {},
    finalScore: null,
    certId: null,
    certDate: null,
  });

  const [activeTab, setActiveTab] = useState<string>('module-0');
  const [signInData, setSignInData] = useState({ name: '', org: '', email: '' });
  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('wowzer_course_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        loadState(parsed.email);
      } catch {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const loadState = (email: string) => {
    const storedState = localStorage.getItem(`wowzer_course_state_${email}`);
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState);
        setState(parsed);
      } catch {
        console.error("Error parsing course state");
      }
    }
  };

  const saveState = (newState: CourseState, email: string) => {
    setState(newState);
    localStorage.setItem(`wowzer_course_state_${email}`, JSON.stringify(newState));
  };

  /* --- EmailJS Lead Capture on Sign-in --- */
  const sendLeadEmail = (data: { name: string; org: string; email: string }) => {
    const templateParams = {
      name: data.name,
      email: data.email,
      subject: 'Cybersecurity Training — New Lead',
      message: `New cybersecurity training sign-up:\n\nName: ${data.name}\nOrganization: ${data.org}\nEmail: ${data.email}\n\nThis lead was captured from the Cybersecurity Awareness Training form on WOWzer.tech.`,
      source: 'WOWzer.tech — Cybersecurity Training Form',
    };

    emailjs
      .send('default_service', 'template_ab0walg', templateParams, 'naLKp2IhB7VYtA5St')
      .then(() => console.log('Lead email sent'))
      .catch((err) => console.error('EmailJS error:', err));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInData.name && signInData.org && signInData.email) {
      setUser(signInData);
      localStorage.setItem('wowzer_course_user', JSON.stringify(signInData));
      loadState(signInData.email);
      // Fire lead-capture email immediately
      sendLeadEmail(signInData);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('wowzer_course_user');
    setActiveTab('module-0');
    setSignInData({ name: '', org: '', email: '' });
  };

  const progress = useMemo(() => {
    const totalSteps = MODULES.length + 1;
    const completedSteps =
      state.completedModules.length +
      (state.finalScore !== null && state.finalScore >= PASS_PCT ? 1 : 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [state]);

  const handleModuleQuizOption = (moduleId: string, qIdx: number, oIdx: number) => {
    if (!user) return;
    const newState = { ...state, moduleQuizState: { ...state.moduleQuizState } };
    if (!newState.moduleQuizState[moduleId]) {
      newState.moduleQuizState[moduleId] = {};
    }
    newState.moduleQuizState[moduleId] = { ...newState.moduleQuizState[moduleId], [qIdx]: oIdx };

    const moduleIndex = parseInt(moduleId.split('-')[1]);
    const currentMod = MODULES[moduleIndex];
    let allCorrect = true;

    if (currentMod.quiz) {
      for (let i = 0; i < currentMod.quiz.length; i++) {
        if (newState.moduleQuizState[moduleId][i] !== currentMod.quiz[i].correct) {
          allCorrect = false;
          break;
        }
      }
      if (allCorrect && Object.keys(newState.moduleQuizState[moduleId]).length === currentMod.quiz.length) {
        if (!newState.completedModules.includes(moduleId)) {
          newState.completedModules = [...newState.completedModules, moduleId];
        }
      } else {
        newState.completedModules = newState.completedModules.filter((id) => id !== moduleId);
      }
    } else {
      if (!newState.completedModules.includes(moduleId)) {
        newState.completedModules = [...newState.completedModules, moduleId];
      }
    }

    saveState(newState, user.email);
  };

  const handleExamOption = (qIdx: number, oIdx: number) => {
    if (!user) return;
    const newState = { ...state, finalExamState: { ...state.finalExamState, [qIdx]: oIdx } };
    saveState(newState, user.email);
  };

  const submitExam = () => {
    if (!user) return;
    let correct = 0;
    FINAL_EXAM.forEach((q, i) => {
      if (state.finalExamState[i] === q.correct) correct++;
    });
    const score = Math.round((correct / FINAL_EXAM.length) * 100);
    const newState = { ...state, finalScore: score };

    if (score >= PASS_PCT && !newState.certId) {
      newState.certId = `WT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      newState.certDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    saveState(newState, user.email);

    if (score >= PASS_PCT) {
      setActiveTab('cert');
    }
  };

  /* --- PDF Download via html2canvas + jsPDF --- */
  const downloadPDF = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`WOWzer-CyberSecurity-Certificate-${user?.name?.replace(/\s+/g, '-') || 'certificate'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  /* --- LinkedIn Share --- */
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent('https://wowzer.tech/cyber-training');
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  if (!isMounted) return null;

  /* --- Sign-In Screen --- */
  if (!user) {
    return (
      <div className="min-h-[85vh] flex flex-col lg:flex-row">
        {/* Left brand panel */}
        <div className="flex-1 bg-gradient-to-br from-wowzer-darker via-wowzer-dark to-wowzer-primary text-white p-10 lg:p-16 flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-blue-200 mb-4">
            WOWzer Technologies · Security Training
          </p>
          <h1 className="text-3xl lg:text-4xl font-heading font-extrabold leading-tight mb-4">
            Free Cybersecurity Awareness Training
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-[46ch] mb-8">
            Ten short modules on the threats that actually reach small businesses — AI-generated phishing, deepfake fraud, ransomware, data handling, and more. Pass the assessment and download your certificate.
          </p>
          <ul className="space-y-3.5">
            {[
              ['Learn', `${MODULES.length} modules, about 40 minutes total`],
              ['Prove it', `Knowledge checks + ${FINAL_EXAM.length}-question final (${PASS_PCT}% to pass)`],
              ['Certify', 'Download a PDF certificate or share it on LinkedIn'],
            ].map(([bold, desc], i) => (
              <li key={i} className="flex items-start gap-3 text-blue-50 text-[15px]">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>
                  <b>{bold}</b> — {desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-blue-300 text-[13px]">
            Presented by WOWzer Technologies · 2026 Edition
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
          <form onSubmit={handleSignIn} className="w-full max-w-[430px] bg-white rounded-2xl shadow-lg p-9" noValidate>
            <h2 className="text-2xl font-heading font-bold text-wowzer-darker mb-1">Start the course</h2>
            <p className="text-sm text-wowzer-muted mb-7">
              Your name appears on your certificate exactly as entered.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[13.5px] font-semibold text-wowzer-darker mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  value={signInData.name}
                  onChange={(e) => setSignInData({ ...signInData, name: e.target.value })}
                  className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-wowzer-primary focus:ring-2 focus:ring-wowzer-primary/15 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-wowzer-darker mb-1.5">Organization</label>
                <input
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Morgan &amp; Co. Accounting"
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
                  placeholder="alex@morganco.com"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-wowzer-primary focus:ring-2 focus:ring-wowzer-primary/15 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-wowzer-primary hover:bg-wowzer-dark text-white font-bold py-3.5 rounded-lg transition-colors text-[15.5px]"
              >
                Sign in &amp; begin
              </button>
            </div>
            <p className="mt-5 text-xs text-wowzer-muted bg-wowzer-lighter rounded-lg p-3">
              <strong>Privacy note:</strong> your sign-in and progress are stored only in this browser. Your name and email are used to personalize your certificate and to notify us about your interest in cybersecurity training.
            </p>
          </form>
        </div>
      </div>
    );
  }

  const allModulesDone = state.completedModules.length === MODULES.length;
  const examPassed = state.finalScore !== null && state.finalScore >= PASS_PCT;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Topbar */}
      <header className="bg-wowzer-darker text-white px-4 py-3 flex justify-between items-center shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white p-1"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-heading font-bold text-lg">
            WOWZer <span className="text-amber-400">&#9670;</span> Security Training
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200 hidden sm:inline">
            {user.name} · {user.org}
          </span>
          <button
            onClick={handleSignOut}
            className="text-sm border border-white/30 rounded px-3 py-1 hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-wowzer-darker/30 print:hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar - mobile overlay + desktop fixed */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r overflow-y-auto flex-shrink-0 transform transition-transform duration-200 print:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-1.5 pt-6">
            <div className="text-[11px] font-bold text-wowzer-muted uppercase tracking-[0.14em] mb-3 px-1">
              Course modules
            </div>
            {MODULES.map((mod, idx) => {
              const mId = `module-${idx}`;
              const isDone = state.completedModules.includes(mId);
              const isActive = activeTab === mId;
              return (
                <button
                  key={mId}
                  onClick={() => {
                    setActiveTab(mId);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border-[1.5px] ${
                    isActive
                      ? 'border-wowzer-primary bg-wowzer-lighter text-wowzer-primary'
                      : 'border-transparent hover:border-slate-200 text-wowzer-text'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? 'bg-green-500 text-white'
                        : 'bg-wowzer-lighter text-wowzer-dark'
                    }`}
                  >
                    {isDone ? '\u2713' : idx + 1}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block">{mod.title}</span>
                    <span className="block text-[11px] font-normal text-wowzer-muted">
                      {isDone ? 'Completed' : `Module ${idx + 1} of ${MODULES.length}`}
                    </span>
                  </span>
                </button>
              );
            })}

            <div className="text-[11px] font-bold text-wowzer-muted uppercase tracking-[0.14em] mt-6 mb-3 px-1">
              Assessment
            </div>
            <button
              onClick={() => {
                setActiveTab('exam');
                setSidebarOpen(false);
              }}
              disabled={!allModulesDone}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border-[1.5px] ${
                !allModulesDone ? 'opacity-50 cursor-not-allowed border-transparent' : ''
              } ${
                activeTab === 'exam'
                  ? 'border-wowzer-primary bg-wowzer-lighter text-wowzer-primary'
                  : 'border-transparent hover:border-slate-200 text-wowzer-text'
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  examPassed ? 'bg-green-500 text-white' : 'bg-amber-50 text-amber-600'
                }`}
              >
                {examPassed ? '\u2713' : '\u2605'}
              </span>
              <span className="text-left leading-tight">
                <span className="block">Final Assessment</span>
                <span className="block text-[11px] font-normal text-wowzer-muted">
                  {examPassed
                    ? `Passed \u2014 ${state.finalScore}%`
                    : allModulesDone
                    ? `${FINAL_EXAM.length} questions \u00b7 ${PASS_PCT}% to pass`
                    : 'Complete all modules to unlock'}
                </span>
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('cert');
                setSidebarOpen(false);
              }}
              disabled={!examPassed}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border-[1.5px] ${
                !examPassed ? 'opacity-50 cursor-not-allowed border-transparent' : ''
              } ${
                activeTab === 'cert'
                  ? 'border-wowzer-primary bg-wowzer-lighter text-wowzer-primary'
                  : 'border-transparent hover:border-slate-200 text-wowzer-text'
              }`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                &#127942;
              </span>
              <span className="text-left leading-tight">
                <span className="block">Certificate</span>
                <span className="block text-[11px] font-normal text-wowzer-muted">
                  {examPassed ? 'Ready to download' : 'Pass the assessment to unlock'}
                </span>
              </span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Module View */}
          {activeTab.startsWith('module-') &&
            (() => {
              const mIdx = parseInt(activeTab.split('-')[1]);
              const mod = MODULES[mIdx];
              return (
                <div className="max-w-3xl mx-auto print:hidden">
                  <div className="bg-white rounded-xl shadow-sm p-6 lg:p-9 border border-slate-100">
                    <p className="text-xs font-bold tracking-[0.14em] uppercase text-amber-600 mb-2">
                      Module {mIdx + 1} of {MODULES.length}
                    </p>
                    <h2 className="text-2xl lg:text-3xl font-heading font-bold text-wowzer-darker mb-6">
                      {mod.title}
                    </h2>
                    <div
                      className="prose prose-blue max-w-none text-wowzer-text"
                      dangerouslySetInnerHTML={{ __html: mod.content }}
                    />
                  </div>

                  {mod.quiz && mod.quiz.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 lg:p-9 border border-slate-100 border-t-4 border-t-wowzer-primary mt-6">
                      <h3 className="text-xl font-bold mb-1 text-wowzer-darker">Check your understanding</h3>
                      <p className="text-sm text-wowzer-muted mb-6">
                        Answer all {mod.quiz.length} questions correctly to complete this module.
                      </p>
                      <div className="space-y-6">
                        {mod.quiz.map((q, qIdx) => {
                          const selected = state.moduleQuizState[activeTab]?.[qIdx];
                          return (
                            <div key={qIdx}>
                              <p className="font-bold text-wowzer-darker mb-3">
                                {qIdx + 1}. {q.q}
                              </p>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = selected === oIdx;
                                  const isCorrect = q.correct === oIdx;
                                  const showResult = selected !== undefined;

                                  let style = 'border-slate-200 hover:border-wowzer-primary bg-slate-50/50';
                                  if (showResult) {
                                    if (isSelected && isCorrect)
                                      style = 'bg-green-50 border-green-500 text-green-900';
                                    else if (isSelected && !isCorrect)
                                      style = 'bg-red-50 border-red-500 text-red-900';
                                    else if (isCorrect) style = 'bg-green-50/50 border-green-300';
                                    else style = 'opacity-50 border-slate-200';
                                  }

                                  return (
                                    <label
                                      key={oIdx}
                                      className={`flex items-start gap-3 p-3 border-[1.5px] rounded-lg cursor-pointer transition-colors text-[14.5px] ${style}`}
                                    >
                                      <input
                                        type="radio"
                                        name={`m${mIdx}-q${qIdx}`}
                                        checked={isSelected}
                                        onChange={() => handleModuleQuizOption(activeTab, qIdx, oIdx)}
                                        disabled={showResult && isSelected && isCorrect}
                                        className="mt-0.5 text-wowzer-primary focus:ring-wowzer-primary"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              {selected !== undefined && q.explain && (
                                <div
                                  className={`text-sm rounded-lg p-3 mt-2 ${
                                    selected === q.correct
                                      ? 'bg-green-50 text-green-800'
                                      : 'bg-red-50 text-red-800'
                                  }`}
                                >
                                  {selected === q.correct ? '\u2713 ' : '\u2717 '}
                                  {q.explain}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      {mIdx > 0 && (
                        <button
                          onClick={() => setActiveTab(`module-${mIdx - 1}`)}
                          className="bg-wowzer-lighter text-wowzer-dark hover:bg-blue-100 px-5 py-2.5 rounded-lg font-semibold text-[15px] transition-colors"
                        >
                          &larr; {MODULES[mIdx - 1].title}
                        </button>
                      )}
                    </div>
                    <div>
                      {mIdx < MODULES.length - 1 ? (
                        <button
                          onClick={() => setActiveTab(`module-${mIdx + 1}`)}
                          disabled={!state.completedModules.includes(activeTab)}
                          className="bg-wowzer-primary hover:bg-wowzer-dark text-white px-5 py-2.5 rounded-lg font-semibold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next: {MODULES[mIdx + 1].title} &rarr;
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('exam')}
                          disabled={!allModulesDone}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Go to Final Assessment &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Final Assessment */}
          {activeTab === 'exam' && (
            <div className="max-w-3xl mx-auto print:hidden">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-9 border border-slate-100 border-t-4 border-t-amber-500">
                <p className="text-xs font-bold tracking-[0.14em] uppercase text-amber-600 mb-2">
                  Final Assessment
                </p>
                <h2 className="text-2xl lg:text-3xl font-heading font-bold text-wowzer-darker mb-2">
                  Show what you know
                </h2>
                <p className="text-wowzer-muted text-[14.5px] mb-8">
                  {FINAL_EXAM.length} questions covering all modules. Score {PASS_PCT}% or higher to earn your
                  certificate. You can retake as many times as you need.
                </p>

                {examPassed && (
                  <div className="text-center py-8">
                    <div
                      className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4 text-3xl font-extrabold text-wowzer-darker"
                      style={{
                        background: `conic-gradient(#2E7D32 ${(state.finalScore || 0) * 3.6}deg, #E3E8F0 0deg)`,
                      }}
                    >
                      <div className="w-[88px] h-[88px] rounded-full bg-white flex items-center justify-center">
                        {state.finalScore}%
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-1">Assessment passed</h3>
                    <p className="text-wowzer-muted mb-6">Your certificate is ready.</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button
                        onClick={() => setActiveTab('cert')}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                      >
                        View certificate &rarr;
                      </button>
                      <button
                        onClick={() => {
                          const newState = {
                            ...state,
                            finalScore: null,
                            finalExamState: {},
                          };
                          saveState(newState, user.email);
                        }}
                        className="bg-wowzer-lighter text-wowzer-dark hover:bg-blue-100 px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      >
                        Retake for a higher score
                      </button>
                    </div>
                  </div>
                )}

                {!examPassed && (
                  <>
                    {state.finalScore !== null && (
                      <div className="p-4 rounded-lg mb-6 font-bold bg-red-50 text-red-800 border border-red-200">
                        You scored {state.finalScore}% &mdash; {PASS_PCT}% is needed. Review the highlighted answers and
                        resubmit.
                      </div>
                    )}

                    <div className="space-y-8">
                      {FINAL_EXAM.map((q, qIdx) => {
                        const selected = state.finalExamState[qIdx];
                        const showResult = state.finalScore !== null;
                        return (
                          <div key={qIdx}>
                            <p className="font-bold text-wowzer-darker mb-3 text-[15.5px]">
                              {qIdx + 1}. {q.q}
                            </p>
                            {q.img && (
                              <div className="mb-3">
                                <img
                                  src={q.img}
                                  alt={`Example for question ${qIdx + 1}`}
                                  className="max-w-[480px] w-full border border-slate-200 rounded-lg"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selected === oIdx;
                                const isCorrect = q.correct === oIdx;
                                let style = 'border-slate-200 bg-slate-50/50';

                                if (showResult) {
                                  if (isSelected && isCorrect) style = 'bg-green-50 border-green-500 text-green-900';
                                  else if (isSelected && !isCorrect) style = 'bg-red-50 border-red-500 text-red-900';
                                  else if (isCorrect) style = 'bg-green-50/50 border-green-300';
                                } else {
                                  if (isSelected) style = 'border-wowzer-primary bg-wowzer-lighter';
                                }

                                return (
                                  <label
                                    key={oIdx}
                                    className={`flex items-start gap-3 p-3 border-[1.5px] rounded-lg cursor-pointer transition-colors text-[14.5px] ${style} ${
                                      !showResult ? 'hover:border-wowzer-primary' : ''
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`exam-q${qIdx}`}
                                      checked={isSelected}
                                      onChange={() => handleExamOption(qIdx, oIdx)}
                                      disabled={showResult}
                                      className="mt-0.5 text-wowzer-primary focus:ring-wowzer-primary"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex items-center gap-4 flex-wrap pb-12">
                      <button
                        onClick={submitExam}
                        disabled={Object.keys(state.finalExamState).length < FINAL_EXAM.length}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {state.finalScore !== null ? 'Retry assessment' : 'Submit assessment'}
                      </button>
                      {state.finalScore !== null && state.finalScore < PASS_PCT && (
                        <span className="text-red-600 font-semibold text-sm">
                          {state.finalScore}% &mdash; need {PASS_PCT}%
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Certificate */}
          {activeTab === 'cert' && examPassed && (
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              {/* Certificate (captured for PDF) */}
              <div className="bg-slate-200/50 rounded-xl p-4 lg:p-8 w-full" id="certPrintArea">
                <div
                  ref={certRef}
                  className="bg-[#FDFCF8] max-w-[720px] mx-auto border-2 border-amber-500 shadow-xl p-10 lg:p-14 text-center relative"
                  style={{ outline: '6px solid #FDFCF8', outlineOffset: '-12px', aspectRatio: '297/210' }}
                >
                  {/* Inner border */}
                  <div className="absolute inset-[6px] border border-amber-300/60 pointer-events-none" />

                  {/* Seal */}
                  <div className="absolute right-5 bottom-36 w-[74px] h-[74px] rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-white flex items-center justify-center text-center text-[9.5px] font-extrabold tracking-wider uppercase leading-tight shadow-lg p-2.5 hidden lg:flex">
                    Cyber Aware &middot; Certified &middot; 2026
                  </div>

                  <p className="text-[13px] font-extrabold tracking-[0.28em] uppercase text-amber-600 mb-5">
                    WOWzer Technologies
                  </p>
                  <h2 className="font-serif text-3xl lg:text-[34px] text-wowzer-darker font-normal mb-1">
                    Certificate of Completion
                  </h2>
                  <p className="text-[13px] tracking-[0.12em] uppercase text-wowzer-muted mb-7">
                    Cybersecurity Awareness Training &middot; 2026 Edition
                  </p>
                  <p className="text-sm text-wowzer-muted mb-2">This certifies that</p>
                  <p className="font-serif text-2xl lg:text-[32px] text-wowzer-text border-b-[1.5px] border-amber-500 inline-block px-6 pb-1.5 mb-2">
                    {user.name}
                  </p>
                  <p className="text-[15px] text-wowzer-muted mb-6">{user.org}</p>
                  <p className="text-[15px] max-w-[52ch] mx-auto text-wowzer-text mb-8 leading-relaxed">
                    has successfully completed the WOWzer Technologies Cybersecurity Awareness Training Course &mdash; covering
                    passwords &amp; authentication, safe internet use, approved software, phishing identification, AI-era
                    threats &amp; deepfake fraud, data handling &amp; privacy, ransomware &amp; backups, remote &amp;
                    mobile work, physical security, and incident reporting &mdash; passing the final assessment with a score of{' '}
                    <b>{state.finalScore}%</b>.
                  </p>
                  <div className="flex justify-between items-start text-left text-[12.5px] text-wowzer-muted border-t border-amber-200 pt-4 px-2">
                    <div>
                      <b className="block text-wowzer-darker text-[13.5px] mb-0.5">Date</b>
                      {state.certDate}
                    </div>
                    <div>
                      <b className="block text-wowzer-darker text-[13.5px] mb-0.5">Certificate ID</b>
                      {state.certId}
                    </div>
                    <div>
                      <b className="block text-wowzer-darker text-[13.5px] mb-0.5">Issued by</b>
                      WOWzer Technologies
                      <br />
                      wowzer.tech
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6 print:hidden">
                {/* Download PDF */}
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating PDF&hellip;
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>

                {/* Print */}
                <button
                  onClick={() => window.print()}
                  className="bg-wowzer-primary hover:bg-wowzer-dark text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>

                {/* Share on LinkedIn */}
                <button
                  onClick={shareOnLinkedIn}
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </button>
              </div>

              {/* Back to course link */}
              <button
                onClick={() => setActiveTab('module-0')}
                className="mt-4 text-wowzer-primary hover:text-wowzer-dark text-sm font-semibold underline print:hidden"
              >
                &larr; Back to course
              </button>

              <p className="text-center text-wowzer-muted text-sm mt-6 pb-10 print:hidden">
                This free course is provided by{' '}
                <a href="/" className="text-wowzer-primary font-bold hover:underline">
                  WOWzer Technologies
                </a>{' '}
                &mdash; cybersecurity awareness for small firms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
