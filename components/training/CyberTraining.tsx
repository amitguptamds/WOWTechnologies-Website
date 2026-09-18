'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MODULES, FINAL_EXAM, PASS_PCT } from './trainingData';

type User = {
  name: string;
  org: string;
  email: string;
};

type CourseState = {
  completedModules: string[];
  moduleQuizState: Record<string, Record<number, number>>; // moduleId -> questionIndex -> optionIndex
  finalExamState: Record<number, number>; // questionIndex -> optionIndex
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

  const [activeTab, setActiveTab] = useState<string>('module-0'); // 'module-X', 'exam', 'cert'

  const [signInData, setSignInData] = useState({ name: '', org: '', email: '' });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('wowzer_course_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        loadState(parsed.email);
      } catch (e) {
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
      } catch (e) {
        console.error("Error parsing course state");
      }
    }
  };

  const saveState = (newState: CourseState, email: string) => {
    setState(newState);
    localStorage.setItem(`wowzer_course_state_${email}`, JSON.stringify(newState));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInData.name && signInData.org && signInData.email) {
      setUser(signInData);
      localStorage.setItem('wowzer_course_user', JSON.stringify(signInData));
      loadState(signInData.email);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('wowzer_course_user');
    setActiveTab('module-0');
    setSignInData({ name: '', org: '', email: '' });
  };

  const progress = useMemo(() => {
    const totalSteps = MODULES.length + 1; // Modules + Exam
    const completedSteps = state.completedModules.length + (state.finalScore !== null && state.finalScore >= PASS_PCT ? 1 : 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [state]);

  const handleModuleQuizOption = (moduleId: string, qIdx: number, oIdx: number) => {
    if (!user) return;
    const newState = { ...state };
    if (!newState.moduleQuizState[moduleId]) {
      newState.moduleQuizState[moduleId] = {};
    }
    newState.moduleQuizState[moduleId][qIdx] = oIdx;

    // Check if module is completed
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
        newState.completedModules = newState.completedModules.filter(id => id !== moduleId);
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
    const newState = { ...state };
    newState.finalExamState[qIdx] = oIdx;
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
      newState.certDate = new Date().toLocaleDateString();
    }
    
    saveState(newState, user.email);
  };

  if (!isMounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wowzer-lighter p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-wowzer-darker mb-6 text-center font-heading">Security Awareness Training</h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wowzer-text mb-1">Full Name</label>
              <input type="text" required value={signInData.name} onChange={e => setSignInData({ ...signInData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-wowzer-primary focus:border-wowzer-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wowzer-text mb-1">Organization / Company</label>
              <input type="text" required value={signInData.org} onChange={e => setSignInData({ ...signInData, org: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-wowzer-primary focus:border-wowzer-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wowzer-text mb-1">Email Address</label>
              <input type="email" required value={signInData.email} onChange={e => setSignInData({ ...signInData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-wowzer-primary focus:border-wowzer-primary outline-none" />
            </div>
            <button type="submit" className="w-full bg-wowzer-primary hover:bg-wowzer-dark text-white font-semibold py-2 px-4 rounded transition-colors">Start Training</button>
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
      <header className="bg-wowzer-darker text-white p-4 flex justify-between items-center shadow-md print:hidden">
        <div className="font-heading font-bold text-xl">WOWZer Security Training</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <button onClick={handleSignOut} className="text-sm text-wowzer-light hover:text-white underline">Sign out</button>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b px-4 py-2 flex items-center space-x-4 print:hidden">
        <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-wowzer-primary h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-sm font-semibold text-wowzer-muted">{progress}% Complete</div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r overflow-y-auto flex-shrink-0 print:hidden">
          <nav className="p-4 space-y-2">
            <div className="text-xs font-bold text-wowzer-muted uppercase tracking-wider mb-2">Modules</div>
            {MODULES.map((mod, idx) => {
              const mId = `module-${idx}`;
              const isDone = state.completedModules.includes(mId);
              const isActive = activeTab === mId;
              return (
                <button 
                  key={mId} 
                  onClick={() => setActiveTab(mId)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? 'bg-wowzer-lighter text-wowzer-primary' : 'hover:bg-gray-100 text-wowzer-text'} ${isDone ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'}`}
                >
                  {idx + 1}. {mod.title}
                </button>
              );
            })}

            <div className="text-xs font-bold text-wowzer-muted uppercase tracking-wider mt-6 mb-2">Evaluation</div>
            <button
              onClick={() => setActiveTab('exam')}
              disabled={!allModulesDone}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${!allModulesDone ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'exam' ? 'bg-wowzer-lighter text-wowzer-primary' : 'hover:bg-gray-100 text-wowzer-text'} ${examPassed ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'}`}
            >
              Final Assessment
            </button>
            <button
              onClick={() => setActiveTab('cert')}
              disabled={!examPassed}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${!examPassed ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'cert' ? 'bg-wowzer-lighter text-wowzer-primary' : 'hover:bg-gray-100 text-wowzer-text'}`}
            >
              Certificate
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8 overflow-y-auto print:p-0 print:overflow-visible">
          
          {activeTab.startsWith('module-') && (() => {
            const mIdx = parseInt(activeTab.split('-')[1]);
            const mod = MODULES[mIdx];
            return (
              <div className="max-w-3xl mx-auto print:hidden">
                <h2 className="text-3xl font-heading font-bold text-wowzer-darker mb-6">{mod.title}</h2>
                <div className="prose prose-blue max-w-none text-wowzer-text mb-8" dangerouslySetInnerHTML={{ __html: mod.content }} />
                
                {mod.quiz && mod.quiz.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-wowzer-dark">Knowledge Check</h3>
                    <div className="space-y-6">
                      {mod.quiz.map((q, qIdx) => {
                        const selected = state.moduleQuizState[activeTab]?.[qIdx];
                        return (
                          <div key={qIdx} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                            <p className="font-semibold mb-3">{q.q}</p>
                            <div className="space-y-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selected === oIdx;
                                const isCorrect = q.correct === oIdx;
                                const showResult = selected !== undefined;
                                
                                let style = "border-gray-200 hover:border-wowzer-primary";
                                if (showResult) {
                                  if (isSelected && isCorrect) style = "bg-green-50 border-green-500 text-green-900";
                                  else if (isSelected && !isCorrect) style = "bg-red-50 border-red-500 text-red-900";
                                  else if (isCorrect) style = "bg-green-50/50 border-green-300"; // show correct if wrong
                                  else style = "opacity-50 border-gray-200";
                                }

                                return (
                                  <label key={oIdx} className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${style}`}>
                                    <input type="radio" name={`m${mIdx}-q${qIdx}`} checked={isSelected} onChange={() => handleModuleQuizOption(activeTab, qIdx, oIdx)} disabled={showResult && isSelected && isCorrect} className="mr-3 text-wowzer-primary focus:ring-wowzer-primary" />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                            {selected !== undefined && selected !== q.correct && (
                              <p className="text-red-600 text-sm mt-2 font-medium">Incorrect. Please try again to complete the module.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex justify-end">
                   {mIdx < MODULES.length - 1 ? (
                     <button 
                       onClick={() => setActiveTab(`module-${mIdx+1}`)}
                       disabled={!state.completedModules.includes(activeTab)}
                       className="bg-wowzer-primary hover:bg-wowzer-dark text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Next Module
                     </button>
                   ) : (
                     <button 
                       onClick={() => setActiveTab(`exam`)}
                       disabled={!state.completedModules.includes(activeTab)}
                       className="bg-wowzer-primary hover:bg-wowzer-dark text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Proceed to Final Assessment
                     </button>
                   )}
                </div>
              </div>
            );
          })()}

          {activeTab === 'exam' && (
            <div className="max-w-3xl mx-auto print:hidden">
              <h2 className="text-3xl font-heading font-bold text-wowzer-darker mb-6">Final Assessment</h2>
              <p className="text-wowzer-text mb-6">You must score at least {PASS_PCT}% to pass and receive your certificate.</p>
              
              {state.finalScore !== null && (
                <div className={`p-4 rounded mb-6 font-bold ${state.finalScore >= PASS_PCT ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Your score: {state.finalScore}% {state.finalScore >= PASS_PCT ? '- Passed!' : '- Please review the material and try again.'}
                </div>
              )}

              <div className="space-y-8">
                {FINAL_EXAM.map((q, qIdx) => {
                  const selected = state.finalExamState[qIdx];
                  const showResult = state.finalScore !== null;
                  return (
                    <div key={qIdx} className="bg-white p-6 rounded shadow-sm border border-gray-100">
                      <p className="font-semibold mb-4 text-lg">{qIdx + 1}. {q.q}</p>
                      <div className="space-y-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selected === oIdx;
                          const isCorrect = q.correct === oIdx;
                          let style = "border-gray-200";
                          
                          if (showResult) {
                             if (isSelected && isCorrect) style = "bg-green-50 border-green-500 text-green-900";
                             else if (isSelected && !isCorrect) style = "bg-red-50 border-red-500 text-red-900";
                             else if (isCorrect) style = "bg-green-50/50 border-green-300";
                          } else {
                             if (isSelected) style = "border-wowzer-primary bg-wowzer-lighter";
                          }

                          return (
                            <label key={oIdx} className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${style} ${!showResult && 'hover:border-wowzer-primary'}`}>
                              <input 
                                type="radio" 
                                name={`exam-q${qIdx}`} 
                                checked={isSelected} 
                                onChange={() => handleExamOption(qIdx, oIdx)} 
                                disabled={showResult}
                                className="mr-3 text-wowzer-primary focus:ring-wowzer-primary" 
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

              <div className="mt-8 flex justify-end pb-12">
                <button 
                  onClick={submitExam}
                  disabled={Object.keys(state.finalExamState).length < FINAL_EXAM.length || (state.finalScore !== null && state.finalScore >= PASS_PCT)}
                  className="bg-wowzer-dark hover:bg-wowzer-darker text-white px-8 py-3 rounded text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.finalScore !== null && state.finalScore >= PASS_PCT ? 'Passed' : (state.finalScore !== null ? 'Retry Exam' : 'Submit Exam')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cert' && examPassed && (
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="w-full bg-white border-8 border-wowzer-darker p-12 text-center shadow-xl relative mt-10 print:mt-0 print:border-4 print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:h-screen flex flex-col justify-center items-center">
                 <div className="absolute top-4 left-4 text-wowzer-primary font-bold text-2xl font-heading">WOWZer Technologies</div>
                 <h1 className="text-5xl font-heading font-bold text-wowzer-darker mt-12 mb-6">Certificate of Completion</h1>
                 <p className="text-xl text-gray-600 mb-8">This certifies that</p>
                 <p className="text-4xl font-bold text-wowzer-primary mb-8 border-b-2 border-gray-300 pb-2 inline-block min-w-[300px]">{user.name}</p>
                 <p className="text-xl text-gray-600 mb-2">of</p>
                 <p className="text-2xl font-semibold text-wowzer-text mb-12">{user.org}</p>
                 <p className="text-xl text-gray-800 mb-12 max-w-2xl leading-relaxed">
                   Has successfully completed the comprehensive <br/><span className="font-bold">Cybersecurity Awareness Training</span> program, demonstrating a clear understanding of security best practices, threat identification, and data protection.
                 </p>
                 <div className="w-full flex justify-between items-end mt-12 px-12">
                   <div className="text-left">
                     <p className="font-bold text-lg border-b border-gray-400 pb-1">{state.certDate}</p>
                     <p className="text-sm text-gray-500 mt-1">Date Completed</p>
                   </div>
                   <div className="text-right">
                     <p className="font-mono text-lg font-bold border-b border-gray-400 pb-1">{state.certId}</p>
                     <p className="text-sm text-gray-500 mt-1">Certificate ID</p>
                   </div>
                 </div>
              </div>
              <button onClick={() => window.print()} className="mt-8 bg-wowzer-primary hover:bg-wowzer-dark text-white px-8 py-3 rounded font-bold print:hidden flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                <span>Print Certificate</span>
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
