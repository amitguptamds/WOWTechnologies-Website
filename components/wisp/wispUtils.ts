export interface WispData {
  [key: string]: any;
  systems: Record<string, string>[];
  vendors: Record<string, string>[];
  ai: Record<string, string>[];
  staff: Record<string, string>[];
}

export interface Gap {
  s: 'c' | 'h'; // critical or high
  t: string; // title
  x: string; // explanation
}

export interface ColDef {
  k: string;
  p?: string;
  t?: 'sel' | 'date' | 'text';
  o?: string[];
}

export const COLS: Record<string, ColDef[]> = {
  systems: [
    { k: 'name', p: 'e.g. QuickBooks Online' },
    { k: 'data', p: 'e.g. All client ledgers' },
    { k: 'who', p: 'e.g. All staff' },
    { k: 'where', t: 'sel', o: ['Cloud', 'On-premise', 'Laptop', 'Phone'] },
    { k: 'mfa', t: 'sel', o: ['Yes', 'No'] }
  ],
  vendors: [
    { k: 'name', p: 'e.g. Intuit' },
    { k: 'touch', p: 'e.g. Hosts all client accounting data' },
    { k: 'contract', t: 'sel', o: ['Yes', 'No', "Don't know"] },
    { k: 'assessed', t: 'date' }
  ],
  ai: [
    { k: 'name', p: 'e.g. ChatGPT' },
    { k: 'who', p: 'e.g. Whole team' },
    { k: 'data', p: 'e.g. Draft emails' },
    { k: 'act', t: 'sel', o: ['Text only', 'Can send', 'Can pay', 'Can change records'] },
    { k: 'appr', t: 'sel', o: ['Yes — every action', 'No', 'N/A — text only'] },
    { k: 'last', p: 'e.g. Never' }
  ],
  staff: [
    { k: 'name', p: 'Name' },
    { k: 'role', p: 'Role' },
    { k: 'trained', t: 'date' }
  ]
};

export const QUICKADD: Record<string, string[]> = {
  systems: ['QuickBooks Online', 'Xero', 'Microsoft 365', 'Google Workspace', 'Drake', 'Lacerte', 'UltraTax', 'Dropbox', 'Staff laptops'],
  vendors: ['Intuit', 'Xero', 'Microsoft', 'Google', 'Backup provider', 'Payroll provider'],
  ai: ['ChatGPT', 'Copilot', 'Claude', 'Gemini', 'Meeting note-taker', 'Make/Zapier scenario']
};

export const TABLE_HEADERS: Record<string, string[]> = {
  systems: ['System / place', 'What client data is in it', 'Who can access it', 'Where', 'MFA on?'],
  vendors: ['Vendor', 'What they hold or touch', 'Contract requires safeguards?', 'Last assessed'],
  ai: ['AI tool / automation', 'Who uses it', 'What data goes in', 'Can it ACT?', 'Human approves each action?', 'Last used that power'],
  staff: ['Name', 'Role', 'Last trained']
};

export const PROGRESS_FIELDS = ['firmName','qiName','qiEmail','qiPhone','reportsTo','consumers','reviewDate','accessReview','leaver','retain','disposal','bakWhat','bakLast','bakWho','trainWho','trainWhen','cbProc','aiApproved','aiWatcher','aiProv','irFirst','irInsurer','irLawyer','irBank','irClients','penLast','testNext'];

interface ScoreItem {
  w: number;
  label: string;
  ok: (data: WispData) => boolean;
}

export const SCORING: ScoreItem[] = [
  { w: 20, label: 'MFA on all six system groups', ok: (d) => ['mfaEmail','mfaAcct','mfaTax','mfaDocs','mfaAdmin','mfaAll'].every(k => !!d[k]) },
  { w: 10, label: 'Qualified Individual named', ok: (d) => !!(d.qiName || '').toString().trim() },
  { w: 10, label: 'Systems inventory started', ok: (d) => d.systems.some(r => r.name) },
  { w: 8, label: 'Vendor list started', ok: (d) => d.vendors.some(r => r.name) },
  { w: 8, label: 'AI inventory started', ok: (d) => d.ai.some(r => r.name) },
  { w: 10, label: 'Every acting AI has per-action human approval', ok: (d) => { const a = d.ai.filter(r => r.name && r.act && r.act !== 'Text only'); return a.every(r => r.appr === 'Yes — every action'); } },
  { w: 6, label: 'Reading AI separated from acting AI', ok: (d) => !!d.aiSep },
  { w: 8, label: 'Restore actually tested (date present)', ok: (d) => !!(d.bakLast || '').toString().trim() },
  { w: 5, label: 'Who-restores-the-ledger established', ok: (d) => !!(d.bakWho || '').toString().trim() },
  { w: 6, label: 'Call-back rule in force', ok: (d) => !!d.cbRule },
  { w: 5, label: 'Encryption including laptops', ok: (d) => !!d.encLaptop },
  { w: 4, label: 'Insurer + counsel recorded', ok: (d) => !!(d.irInsurer || '').toString().trim() && !!(d.irLawyer || '').toString().trim() },
  { w: 5, label: 'Training recorded with cadence', ok: (d) => !!(d.trainWho || '').toString().trim() && !!(d.trainWhen || '').toString().trim() },
  { w: 5, label: 'Penetration test done, findings fixed', ok: (d) => !!(d.penLast || '').toString().trim() && !!d.penFixed }
];

const SCORE_MAX = SCORING.reduce((a, s) => a + s.w, 0);

export function scorePct(data: WispData): number {
  const raw = SCORING.filter(s => s.ok(data)).reduce((a, s) => a + s.w, 0);
  return Math.round(raw / SCORE_MAX * 100);
}

export function band(pct: number): string {
  return pct >= 90 ? 'Trusted Machine' : pct >= 70 ? 'Governed' : pct >= 40 ? 'Partial' : 'Exposed';
}

export function gaps(data: WispData): Gap[] {
  const g: Gap[] = [];
  const v = (k: string) => (data[k] || '').toString().trim();
  const B = (k: string) => !!data[k];
  const A = (s: 'c' | 'h', t: string, x: string) => g.push({ s, t, x });

  if (!v('qiName')) A('c', 'No Qualified Individual named', '§314.4(a) requires one named person. Name someone today — it can be you.');
  const mfa = ['mfaEmail','mfaAcct','mfaTax','mfaDocs','mfaAdmin','mfaAll'].filter(k => !B(k));
  if (mfa.length) A('c', `MFA not confirmed on ${mfa.length} system group${mfa.length === 1 ? '' : 's'}`, '§314.4(c)(5) requires MFA for any individual accessing any information system. This is the control that stops the most real attacks. Free. One hour. Do it this week.');
  if (!B('encLaptop')) A('c', 'Staff laptops are not confirmed encrypted', 'A stolen laptop with an unencrypted drive is a data breach with a police report attached. BitLocker / FileVault — ten minutes.');
  if (!v('bakLast')) A('c', 'No restore has ever been tested', 'An untested backup is a hypothesis. If you have never restored a backup, you do not have backups — you have files, and a feeling.');
  if (!v('bakWho')) A('c', 'You have not confirmed who restores a client ledger', 'Read your accounting platform\'s terms. Most firms assume the platform does it. Most firms are wrong.');
  if (!B('cbRule')) A('c', 'No call-back rule for money movement', 'Your highest-value fix after MFA. It costs nothing — and it is the control that would have saved Arup US$25 million.');
  const acting = data.ai.filter(r => r.name && r.act && r.act !== 'Text only');
  const unappr = acting.filter(r => r.appr !== 'Yes — every action');
  if (unappr.length) A('c', `${unappr.length} AI tool${unappr.length === 1 ? '' : 's'} can act without a human approving each action`, `${unappr.map(r => r.name).join(', ')}. For every AI that can send, pay or change a record, a human must approve THAT specific action.`);
  if (!B('aiSep')) A('c', 'The AI that reads your documents may also be able to send or pay', 'A malicious invoice can carry instructions to the assistant that is able to pay it. Separate reading from acting.');
  if (!B('ai7216') && data.ai.some(r => r.name)) A('c', 'No legal advice taken on §7216', 'If you prepare returns, an unauthorised disclosure of tax return information is a criminal matter. Thirty minutes with counsel.');
  if (!v('irInsurer')) A('h', 'Cyber insurer not recorded', 'You will not be looking this up calmly at 4pm on a Friday.');
  if (!v('irLawyer')) A('h', 'Legal counsel not recorded', 'Same.');
  if (!data.systems.some(r => r.name)) A('h', 'No systems inventory', '§314.4(c)(2). Everything else depends on this.');
  if (!data.vendors.some(r => r.name)) A('h', 'No vendor list', '§314.4(f) is a legal duty to oversee your service providers.');
  if (!data.ai.some(r => r.name)) A('h', 'No AI inventory', 'Including the tools nobody approved.');
  if (!v('penLast')) A('h', 'Nobody has ever tried to break in', 'Until somebody has, everything you believe about your defences is a belief.');
  if (v('penLast') && !B('penFixed')) A('c', 'Test findings were not fixed', 'A vulnerability you documented and did not fix is worse than one you never found. Because now you knew.');
  if (!v('trainWho')) A('h', 'No security training recorded', '§314.4(e) — not exempt for small firms.');
  if (!v('aiWatcher') && acting.length) A('h', 'Nobody named reviews what the AI did', 'An alert nobody answers has already failed. It just hasn\'t told you yet.');
  if (!v('accessReview')) A('h', 'Access is not reviewed on a schedule', 'Somebody still has a login they stopped needing in 2023.');
  if (!v('retain')) A('h', 'No retention schedule', '§314.4(c)(6).');
  if (!B('irLog')) A('h', 'No breach log', 'PIPEDA requires a record of every breach for 24 months — including ones you decide not to report.');
  if (!v('reviewDate')) A('h', 'No review date set', 'A plan written once and filed is a record of what you used to do.');
  return g;
}

export function computeProgress(data: WispData): number {
  const v = (k: string) => (data[k] || '').toString().trim();
  let f = PROGRESS_FIELDS.filter(k => v(k)).length;
  const rows = data.systems.filter(r => r.name).length + data.vendors.filter(r => r.name).length + data.ai.filter(r => r.name).length;
  return Math.min(100, Math.round(((f + Math.min(rows, 6)) / (PROGRESS_FIELDS.length + 6)) * 100));
}

export function defaultData(): WispData {
  return { systems: [{}], vendors: [{}], ai: [{}], staff: [{}] };
}
