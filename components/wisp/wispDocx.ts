import { WispData, Gap, scorePct, band, gaps } from './wispUtils';

const CRCT = (() => {
  let c: number;
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(u8: Uint8Array): number {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < u8.length; i++) c = CRCT[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

interface ZipFile { name: string; data: Uint8Array; }

function zipStore(files: ZipFile[]): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: { head: Uint8Array; name: Uint8Array }[] = [];
  let offset = 0;
  const u16 = (n: number) => [n & 255, (n >> 8) & 255];
  const u32 = (n: number) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];
  files.forEach(f => {
    const nameB = enc.encode(f.name);
    const data = f.data;
    const crc = crc32(data);
    const local = ([] as number[]).concat(
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0)
    );
    const localA = new Uint8Array(local);
    chunks.push(localA, nameB, data);
    const cen = ([] as number[]).concat(
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)
    );
    central.push({ head: new Uint8Array(cen), name: nameB });
    offset += localA.length + nameB.length + data.length;
  });
  const cdStart = offset;
  let cdLen = 0;
  central.forEach(c => { chunks.push(c.head, c.name); cdLen += c.head.length + c.name.length; });
  chunks.push(new Uint8Array(([] as number[]).concat(
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cdLen), u32(cdStart), u16(0)
  )));
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  chunks.forEach(c => { out.set(c, p); p += c.length; });
  return out;
}

export function buildPlainText(data: WispData, you: string, firm: string): string {
  const F = firm || '[FIRM NAME]';
  const ds = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const v = (k: string) => (data[k as keyof WispData] || '').toString().trim();
  const B = (k: string) => !!data[k as keyof WispData];
  const n = parseInt(v('consumers') || '0', 10);
  const u5 = n > 0 && n < 5000;
  const G = gaps(data);
  const pct = scorePct(data);
  const yn = (b: boolean) => b ? 'Yes' : 'NOT CONFIRMED — see Gap Register';
  const or = (k: string, def?: string) => v(k) || ('*** ' + (def || 'NOT RECORDED — see Gap Register') + ' ***');

  let t = `${F.toUpperCase()}
WRITTEN INFORMATION SECURITY PLAN

Version 1.0   ·   Prepared ${ds}
Prepared by: ${you}
Qualified Individual: ${or('qiName', 'NOT YET DESIGNATED')}
Next review: ${v('reviewDate') || '*** NOT SET ***'}

READINESS SCORE: ${pct} / 100 — ${band(pct)}

================================================================================
1. PURPOSE AND OBJECTIVES
================================================================================
This Written Information Security Plan (WISP) outlines ${F}'s safeguards to protect customer information in compliance with the FTC Safeguards Rule (16 CFR Part 314) and other applicable privacy regulations.
The objectives of this WISP are to:
- Ensure the security and confidentiality of customer information.
- Protect against any anticipated threats or hazards to the security or integrity of such information.
- Protect against unauthorized access to or use of such information that could result in substantial harm or inconvenience to any customer.

================================================================================
2. SCOPE AND DEFINITIONS
================================================================================
This Plan applies to all employees, contractors, service providers, and anyone who has access to customer information collected and maintained by ${F}.
Consumer Count Exemption: ${u5 ? 'The firm handles fewer than 5,000 consumers and may be exempt from certain specific procedural requirements, but this plan reflects our overarching commitment to security.' : 'The firm handles 5,000 or more consumers and is subject to full FTC Safeguards Rule requirements.'}

================================================================================
3. QUALIFIED INDIVIDUAL AND GOVERNANCE
================================================================================
Qualified Individual: ${or('qiName')}
The Qualified Individual is responsible for overseeing and implementing the firm's information security program and enforcing this WISP.
Report to Board: ${yn(B('boardReport'))}
The Qualified Individual reports in writing, at least annually, to the board of directors or equivalent governing body regarding the overall status of the information security program and material matters related to the program.

================================================================================
4. RISK ASSESSMENT
================================================================================
The firm conducts periodic risk assessments to identify reasonably foreseeable internal and external risks to the security, confidentiality, and integrity of customer information.
Risk Assessment Completed: ${yn(B('riskAssessed'))}
Date of Last Assessment: ${or('riskDate')}
The assessments evaluate the adequacy of current safeguards in managing the identified risks.

================================================================================
5. ACCESS CONTROLS & AUTHENTICATION
================================================================================
Access to customer information is limited to authorized individuals who require such access to perform their duties.
Multi-Factor Authentication (MFA) enabled: ${yn(B('mfa'))}
MFA details: ${or('mfaDetails')}
Access rights are reviewed periodically and access is terminated when it is no longer required.

================================================================================
6. SYSTEM AND DATA SECURITY
================================================================================
Customer information is protected in transit and at rest using reasonable encryption measures or alternative compensating controls.
Encryption at Rest: ${yn(B('encryptRest'))}
Encryption in Transit: ${yn(B('encryptTransit'))}
The firm maintains secure development practices and tests or monitors the security of information systems.

================================================================================
7. DATA RETENTION AND DISPOSAL
================================================================================
Customer information is retained only as long as necessary for legitimate business purposes or as required by law.
Data Inventory & Disposal Policy: ${yn(B('inventory'))}
Retention Policy Details: ${or('retention')}
When no longer needed, customer information is disposed of securely in a manner that renders it unreadable and undecipherable.

================================================================================
8. TRAINING & AWARENESS
================================================================================
All personnel who have access to customer information receive security awareness training.
Employee Training Conducted: ${yn(B('training'))}
Training Date/Frequency: ${or('trainingDate')}

================================================================================
9. THIRD-PARTY RISK MANAGEMENT
================================================================================
The firm takes reasonable steps to select and retain service providers that are capable of maintaining appropriate safeguards for customer information.
Vendor Assessments Conducted: ${yn(B('vendors'))}
Service providers are required by contract to implement and maintain such safeguards.

================================================================================
10. INCIDENT RESPONSE PLAN
================================================================================
The firm has developed and implemented a written incident response plan to respond to, and recover from, any security event materially affecting the confidentiality, integrity, or availability of customer information.
Incident Response Plan in place: ${yn(B('incidentPlan'))}

================================================================================
11. SYSTEM MAINTENANCE & AUDIT
================================================================================
The information security program is continuously monitored and evaluated to ensure it remains effective. The firm performs regular testing of key controls.
Logging and Monitoring: ${yn(B('logging'))}
Vulnerability Assessments: ${yn(B('vulnScans'))}

================================================================================
GAP REGISTER
================================================================================
`;
  if (G.length === 0) {
    t += "No gaps identified. All required controls have been confirmed.\n";
  } else {
    G.forEach(g => {
      t += `[ ] GAP: ${g.t}\n    SUGGESTED ACTION: ${g.x}\n\n`;
    });
  }

  t += `
================================================================================
DECLARATION
================================================================================
I, ${or('qiName')}, confirm that I am the designated Qualified Individual for ${F}.
I have reviewed this Written Information Security Plan and assert that it accurately represents our current security posture and operational guidelines.

Signature: ___________________________
Date: _______________________________
`;

  return t;
}

export function buildDocxBytes(data: WispData, you: string, firm: string): Uint8Array {
  const enc = new TextEncoder();
  
  const F = firm || '[FIRM NAME]';
  const ds = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const v = (k: string) => (data[k as keyof WispData] || '').toString().trim();
  const B = (k: string) => !!data[k as keyof WispData];
  const G = gaps(data);
  const pct = scorePct(data);
  const yn = (b: boolean) => b ? 'Yes' : 'NOT CONFIRMED — see Gap Register';
  const or = (k: string, def?: string) => v(k) || ('*** ' + (def || 'NOT RECORDED — see Gap Register') + ' ***');
  const n = parseInt(v('consumers') || '0', 10);
  const u5 = n > 0 && n < 5000;

  const esc = (s: string) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const runs = (text: string) => String(text == null ? '' : text).split('\n').map((ln, i) => (i ? '<w:br/>' : '') + '<w:t xml:space="preserve">' + esc(ln) + '</w:t>').join('');

  const pTitle = (txt: string) => `<w:p><w:pPr><w:pStyle w:val="Title"/><w:jc w:val="center"/></w:pPr><w:r><w:t>${esc(txt)}</w:t></w:r></w:p>`;
  const pSub = (txt: string) => `<w:p><w:pPr><w:pStyle w:val="Subtitle"/><w:jc w:val="center"/></w:pPr><w:r><w:t>${esc(txt)}</w:t></w:r></w:p>`;
  const pHeading = (txt: string) => `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${esc(txt)}</w:t></w:r></w:p>`;
  const pText = (txt: string) => `<w:p><w:r>${runs(txt)}</w:r></w:p>`;
  const pBold = (label: string, txt: string) => `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${esc(label)}</w:t></w:r><w:r>${runs(txt)}</w:r></w:p>`;

  let docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
${pTitle(F.toUpperCase())}
${pSub('WRITTEN INFORMATION SECURITY PLAN')}
${pText(`Version 1.0   ·   Prepared ${ds}`)}
${pText(`Prepared by: ${you}`)}
${pText(`Qualified Individual: ${or('qiName', 'NOT YET DESIGNATED')}`)}
${pText(`Next review: ${v('reviewDate') || '*** NOT SET ***'}`)}
${pText(`READINESS SCORE: ${pct} / 100 — ${band(pct)}`)}

${pHeading('1. PURPOSE AND OBJECTIVES')}
${pText(`This Written Information Security Plan (WISP) outlines ${F}'s safeguards to protect customer information in compliance with the FTC Safeguards Rule (16 CFR Part 314) and other applicable privacy regulations.`)}
${pText('The objectives of this WISP are to:')}
${pText('- Ensure the security and confidentiality of customer information.')}
${pText('- Protect against any anticipated threats or hazards to the security or integrity of such information.')}
${pText('- Protect against unauthorized access to or use of such information that could result in substantial harm or inconvenience to any customer.')}

${pHeading('2. SCOPE AND DEFINITIONS')}
${pText(`This Plan applies to all employees, contractors, service providers, and anyone who has access to customer information collected and maintained by ${F}.`)}
${pBold('Consumer Count Exemption: ', u5 ? 'The firm handles fewer than 5,000 consumers and may be exempt from certain specific procedural requirements, but this plan reflects our overarching commitment to security.' : 'The firm handles 5,000 or more consumers and is subject to full FTC Safeguards Rule requirements.')}

${pHeading('3. QUALIFIED INDIVIDUAL AND GOVERNANCE')}
${pBold('Qualified Individual: ', or('qiName'))}
${pText('The Qualified Individual is responsible for overseeing and implementing the firm\'s information security program and enforcing this WISP.')}
${pBold('Report to Board: ', yn(B('boardReport')))}
${pText('The Qualified Individual reports in writing, at least annually, to the board of directors or equivalent governing body regarding the overall status of the information security program and material matters related to the program.')}

${pHeading('4. RISK ASSESSMENT')}
${pText('The firm conducts periodic risk assessments to identify reasonably foreseeable internal and external risks to the security, confidentiality, and integrity of customer information.')}
${pBold('Risk Assessment Completed: ', yn(B('riskAssessed')))}
${pBold('Date of Last Assessment: ', or('riskDate'))}
${pText('The assessments evaluate the adequacy of current safeguards in managing the identified risks.')}

${pHeading('5. ACCESS CONTROLS & AUTHENTICATION')}
${pText('Access to customer information is limited to authorized individuals who require such access to perform their duties.')}
${pBold('Multi-Factor Authentication (MFA) enabled: ', yn(B('mfa')))}
${pBold('MFA details: ', or('mfaDetails'))}
${pText('Access rights are reviewed periodically and access is terminated when it is no longer required.')}

${pHeading('6. SYSTEM AND DATA SECURITY')}
${pText('Customer information is protected in transit and at rest using reasonable encryption measures or alternative compensating controls.')}
${pBold('Encryption at Rest: ', yn(B('encryptRest')))}
${pBold('Encryption in Transit: ', yn(B('encryptTransit')))}
${pText('The firm maintains secure development practices and tests or monitors the security of information systems.')}

${pHeading('7. DATA RETENTION AND DISPOSAL')}
${pText('Customer information is retained only as long as necessary for legitimate business purposes or as required by law.')}
${pBold('Data Inventory & Disposal Policy: ', yn(B('inventory')))}
${pBold('Retention Policy Details: ', or('retention'))}
${pText('When no longer needed, customer information is disposed of securely in a manner that renders it unreadable and undecipherable.')}

${pHeading('8. TRAINING & AWARENESS')}
${pText('All personnel who have access to customer information receive security awareness training.')}
${pBold('Employee Training Conducted: ', yn(B('training')))}
${pBold('Training Date/Frequency: ', or('trainingDate'))}

${pHeading('9. THIRD-PARTY RISK MANAGEMENT')}
${pText('The firm takes reasonable steps to select and retain service providers that are capable of maintaining appropriate safeguards for customer information.')}
${pBold('Vendor Assessments Conducted: ', yn(B('vendors')))}
${pText('Service providers are required by contract to implement and maintain such safeguards.')}

${pHeading('10. INCIDENT RESPONSE PLAN')}
${pText('The firm has developed and implemented a written incident response plan to respond to, and recover from, any security event materially affecting the confidentiality, integrity, or availability of customer information.')}
${pBold('Incident Response Plan in place: ', yn(B('incidentPlan')))}

${pHeading('11. SYSTEM MAINTENANCE & AUDIT')}
${pText('The information security program is continuously monitored and evaluated to ensure it remains effective. The firm performs regular testing of key controls.')}
${pBold('Logging and Monitoring: ', yn(B('logging')))}
${pBold('Vulnerability Assessments: ', yn(B('vulnScans')))}

${pHeading('GAP REGISTER')}
`;

  if (G.length === 0) {
    docXml += pText('No gaps identified. All required controls have been confirmed.');
  } else {
    G.forEach(g => {
      docXml += pBold('GAP: ', g.t);
      docXml += pText(`SUGGESTED ACTION: ${g.x}`);
      docXml += `<w:p></w:p>`;
    });
  }

  docXml += `
${pHeading('DECLARATION')}
${pText(`I, ${or('qiName')}, confirm that I am the designated Qualified Individual for ${F}.`)}
${pText('I have reviewed this Written Information Security Plan and assert that it accurately represents our current security posture and operational guidelines.')}
<w:p></w:p>
${pText('Signature: ___________________________')}
${pText('Date: _______________________________')}

</w:body></w:document>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Open Sans" w:hAnsi="Open Sans"/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="300" w:line="360" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="48"/><w:jc w:val="center"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="300" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:sz w:val="32"/><w:jc w:val="center"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="240" w:after="120" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0052CC"/></w:rPr>
  </w:style>
</w:styles>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const files: ZipFile[] = [
    { name: '[Content_Types].xml', data: enc.encode(contentTypesXml) },
    { name: '_rels/.rels', data: enc.encode(relsXml) },
    { name: 'word/document.xml', data: enc.encode(docXml) },
    { name: 'word/_rels/document.xml.rels', data: enc.encode(docRelsXml) },
    { name: 'word/styles.xml', data: enc.encode(stylesXml) }
  ];

  return zipStore(files);
}

export function fileStem(firm: string): string {
  return (firm || 'firm').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'firm';
}

export function downloadDocx(data: WispData, you: string, firm: string): void {
  const blob = new Blob([buildDocxBytes(data, you, firm) as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fileStem(firm)}-WISP.docx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function downloadTxt(data: WispData, you: string, firm: string): void {
  const blob = new Blob([buildPlainText(data, you, firm)], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fileStem(firm)}-WISP.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
