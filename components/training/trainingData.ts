export interface QuizOption {
  q: string;
  options: string[];
  correct: number;
  explain?: string;
  img?: string;
}

export interface ModuleData {
  id: string;
  title: string;
  content: string;
  quiz: QuizOption[];
}

export const PASS_PCT = 80;

export const MODULES: ModuleData[] = [
  {
    id: "m1",
    title: "Passwords, Passkeys & MFA",
    content: `
      <h3>Length beats complexity</h3>
      <p>Current guidance (NIST SP 800-63B) favors <b>long passphrases — 16 or more characters</b>, such as four unrelated words — over short passwords with forced symbols. "correct-horse-battery-staple" style passphrases are both stronger and easier to remember than "P@ssw0rd1!".</p>
      <div class="my-5 text-center">
        <img src="/assets/training/password-table.jpg" alt="Password cracking time table" class="border border-slate-200 rounded-lg mx-auto">
        <p class="text-sm text-slate-500 italic mt-2">Estimated time to brute-force a password. These numbers shrink every year as attackers gain faster GPUs and AI-assisted cracking — treat anything under 16 characters as at risk.</p>
      </div>
      <h3>The rules that matter</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>One account, one password.</b> Never reuse a work password on a personal account, or vice versa.</li>
        <li><b>Use the approved password manager.</b> Let it generate and remember your passwords — you only memorize one strong master passphrase. Don't keep passwords in email, notes apps, spreadsheets, or on paper.</li>
        <li><b>No forced expiry — but change fast on compromise.</b> Scheduled rotation is no longer recommended; it produces weaker, predictable passwords. Change immediately (and report it) if you suspect exposure.</li>
        <li><b>MFA everywhere.</b> Prefer an authenticator app or hardware key over SMS codes, which can be intercepted by SIM-swapping.</li>
        <li><b>Use passkeys where offered.</b> They can't be phished, guessed, or reused.</li>
        <li><b>Never share credentials</b> — with anyone, on any channel. IT will never ask for your password or an MFA code.</li>
      </ul>
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4"><b>MFA fatigue:</b> attackers who steal a password will spam you with sign-in push notifications hoping you tap "Approve" to make them stop. Never approve a prompt you didn't initiate — deny it and report it.</div>
    `,
    quiz: [
      { q: "Which of these is the strongest approach to a work password?",
        options: [
          "P@ssw0rd1! — it has uppercase, a symbol, and a number",
          "A 16+ character passphrase of unrelated words, unique to that account",
          "One very strong password reused everywhere so you never forget it",
          "An 8-character password changed every 60 days"],
        correct: 1,
        explain: "Length beats complexity. A long, unique passphrase per account (stored in your password manager) is the current standard — forced rotation and symbol rules are outdated." },
      { q: "Your phone buzzes with an MFA approval request — but you weren't signing in to anything. What do you do?",
        options: [
          "Approve it — the system is probably just re-checking",
          "Ignore it and carry on",
          "Deny it and report it to IT immediately",
          "Approve it once to see what happens, deny it if it repeats"],
        correct: 2,
        explain: "An unexpected MFA push means someone likely has your password and is trying to get in. Deny and report immediately so the password can be reset." },
      { q: "Where should your work passwords live?",
        options: [
          "In the password manager your organization has approved",
          "In a note on your phone, protected by your phone's PIN",
          "In the browser's 'remember password' feature on any computer",
          "In a private spreadsheet only you can open"],
        correct: 0,
        explain: "Only the approved password manager. Notes, spreadsheets, and browser storage on unmanaged devices are common sources of credential theft." }
    ]
  },
  {
    id: "m2",
    title: "Internet & Social Media Safety",
    content: `
      <p><b>What you post publicly is now raw material for attacks.</b> AI tools let criminals scrape your social profiles to build convincing, personalized phishing — and clone your voice from any video you've posted.</p>
      <h3>Social media habits</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Don't share sensitive company information — internal reports, customer names, upcoming projects, or photos showing badges, screens, or whiteboards.</li>
        <li>Set privacy on personal accounts to the highest level, and re-check it periodically — platforms change defaults.</li>
        <li>Avoid posting travel plans in real time; announce trips after you return.</li>
        <li>Treat unsolicited connection requests, recruiter approaches, and overly friendly strangers with suspicion — long-con investment and romance scams routinely start with an innocent-looking message.</li>
        <li>Report suspicious contact that references your work — you may be the first sign of a targeted campaign.</li>
      </ul>
      <h3>General internet use</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Do sensitive work only on company-managed devices — never shared or public computers.</li>
        <li>On public Wi-Fi, use the company VPN where required.</li>
        <li><b>Browser extensions are software:</b> install only approved ones. A malicious extension can read everything in your browser, including passwords and customer data.</li>
      </ul>
    `,
    quiz: [
      { q: "You're headed to a conference next week and want to post about it. What's the safest play?",
        options: [
          "Post your travel dates now so contacts can plan to meet you",
          "Post about the trip after you're back",
          "Post live from the airport, but only to friends-of-friends",
          "It makes no difference either way"],
        correct: 1,
        explain: "Real-time travel posts tell attackers exactly when you're distracted and away — prime conditions for impersonation scams targeting your colleagues (\"I'm traveling, need this urgently\")." },
      { q: "A free browser extension promises to summarize any webpage with AI. Installing it on your work laptop is…",
        options: [
          "Fine — extensions are sandboxed and harmless",
          "Fine, as long as it has good reviews",
          "Only okay if IT has approved it — extensions can read everything in your browser",
          "Okay if you only use it on non-work sites"],
        correct: 2,
        explain: "Extensions run inside your browser and can access pages, keystrokes, and session cookies. They're software and need approval like any other install." }
    ]
  },
  {
    id: "m3",
    title: "Approved Software & Updates",
    content: `
      <p>Only software approved by IT may be installed on company devices — desktop applications, mobile apps, browser extensions, and <b>AI tools</b> included.</p>
      <h3>Why it matters</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Vetting:</b> approved software comes from vendors that patch vulnerabilities quickly.</li>
        <li><b>Visibility:</b> IT can only protect what it knows about. Unapproved tools ("shadow IT") are invisible until they cause a breach.</li>
        <li><b>Data protection:</b> free tools are often paid for with your data — an unapproved file converter or AI assistant may ship company documents to unknown servers.</li>
      </ul>
      <h3>Keep everything updated</h3>
      <p>Enable automatic updates and restart promptly when patches need it. Most successful attacks exploit vulnerabilities for which a fix already existed. <b>WannaCry (2017)</b> infected roughly 300,000 computers across 150 countries — every one of them missing a patch that had been available for months.</p>
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4 mt-4"><b>When in doubt, ask first.</b> If you see an unexpected prompt to install or update software, confirm with IT before you click — fake update pop-ups are a common malware delivery method.</div>
    `,
    quiz: [
      { q: "A pop-up appears on your work laptop: \"Your video player is out of date — click to update now.\" What do you do?",
        options: [
          "Click update — staying patched is critical",
          "Close it and confirm with IT before installing anything",
          "Click update, but only if the pop-up looks professional",
          "Ignore updates entirely; they cause downtime"],
        correct: 1,
        explain: "Fake update pop-ups are a classic malware delivery trick. Real updates come through the software itself or IT — verify before you click." },
      { q: "What was the core lesson of WannaCry?",
        options: [
          "Antivirus software is unnecessary",
          "Ransomware only targets large enterprises",
          "Unpatched systems get compromised — the fix existed months before the attack",
          "Email attachments are the only infection route"],
        correct: 2,
        explain: "WannaCry only infected machines missing an available patch. Keeping systems updated is one of the highest-value defenses there is." }
    ]
  },
  {
    id: "m4",
    title: "Phishing in the AI Era",
    content: `
      <p><b>The typo era is over.</b> Generative AI writes flawless, personalized phishing in any language and style. Bad grammar used to be a warning sign; today a polished, professional message is no guarantee of safety. <b>Judge messages by what they ask you to do, not by how well they're written.</b></p>
      <h3>Warning signs that still work</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Urgency, pressure, or secrecy: "urgent matter," "expires today," "don't tell anyone until this is done."</li>
        <li>Unusual requests: gift cards, wire transfers, changes to payroll or vendor banking details, passwords, MFA codes.</li>
        <li>Authority and name-dropping: "the CEO needs this now," claims of being IT, HR, or a help desk.</li>
        <li>A sender address that doesn't match the claimed organization, or a lookalike domain ("rn" in place of "m").</li>
        <li>Unexpected links, attachments (especially .zip or invoice files), or QR codes.</li>
        <li>Requests to move to WhatsApp, personal email, or a phone number supplied in the message.</li>
      </ul>
      <h3>Checking links safely</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Hover (or long-press on mobile) to see the real destination before clicking.</li>
        <li>A padlock or HTTPS means the connection is <b>encrypted — not legitimate</b>. Most phishing sites use HTTPS.</li>
        <li>Never sign in from a link in a message. Go to the site via bookmark or type the address — or let your password manager refuse to autofill on the fake domain.</li>
      </ul>
      <h3>Study these real examples</h3>
      <div class="my-5 text-center">
        <img src="/assets/training/phish-office365.jpg" alt="Fake Office 365 email" class="border border-slate-200 rounded-lg mx-auto">
        <p class="text-sm text-slate-500 italic mt-2">Claims to be Microsoft — but sent from gmaich@nobleys.com, with a generic "Dear user," an account-closure threat, and a "Microsoft.com Team" sign-off.</p>
      </div>
      <div class="my-5 text-center">
        <img src="/assets/training/phish-creditcard.jpg" alt="Fake credit card email" class="border border-slate-200 rounded-lg mx-auto">
        <p class="text-sm text-slate-500 italic mt-2">A "bank" writing from bmo_paymnts@yahoo.com (note the misspelling) with a .zip "statement" — a classic malware carrier.</p>
      </div>
      <div class="my-5 text-center">
        <img src="/assets/training/phish-gmail.jpg" alt="Fake Google alert email" class="border border-slate-200 rounded-lg mx-auto">
        <p class="text-sm text-slate-500 italic mt-2">Unfilled template placeholders — {fname} {lname}, {email} — expose a mass-phishing kit behind a fake Google sign-in harvest page.</p>
      </div>
      <div class="bg-wowzer-lighter border-l-4 border-wowzer-primary p-4 rounded mb-4 mt-4"><b>If you clicked — report it immediately.</b> Entering a password on a fake page is recoverable if IT acts within minutes. You'll never face retaliation for reporting; silence turns a mistake into a breach.</div>
    `,
    quiz: [
      { q: "An email is beautifully written, correctly branded, and personally addressed to you. This means…",
        options: [
          "It's legitimate — scammers write sloppy emails",
          "Nothing by itself — AI writes flawless phishing; judge it by what it asks you to do",
          "It's legitimate if it also has the company logo",
          "It's legitimate if the padlock shows when you click through"],
        correct: 1,
        explain: "Writing quality is no longer a signal. Evaluate the request itself: unexpected urgency, credentials, payments, or attachments all warrant out-of-band verification." },
      { q: "The padlock / HTTPS icon on a website proves…",
        options: [
          "The site is run by who it claims",
          "The site has been verified as safe",
          "Only that the connection is encrypted — most phishing sites use HTTPS too",
          "The site is safe to enter credentials on"],
        correct: 2,
        explain: "HTTPS encrypts traffic to the site — including to a criminal's site. It says nothing about who owns it." },
      { q: "An email from a long-time supplier asks you to update their banking details for future invoices. Best response?",
        options: [
          "Update the details — you recognize the sender",
          "Reply asking them to confirm the new account",
          "Call the supplier on the number you already have on file and verify before changing anything",
          "Update, but flag the first payment for review"],
        correct: 2,
        explain: "Banking-change requests are the signature move of business email compromise. Verify out-of-band using contact details you already hold — never those in the message." }
    ]
  },
  {
    id: "m5",
    title: "AI Threats & Safe AI Use",
    content: `
      <h3>Deepfakes: seeing and hearing are no longer believing</h3>
      <p>A few seconds of audio is enough to clone a voice, and live video can be faked. In a widely reported 2024 case, an employee at the engineering firm Arup transferred <b>US$25 million</b> after a video conference in which every other participant — including the "CFO" — was an AI deepfake.</p>
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4 mt-4"><b>The rule:</b> any request to move money, change banking details, share credentials, or bypass a normal process gets verified <b>out-of-band</b> — a known-good phone number or in person — no matter who appears to ask, even by live video or a familiar voice.</div>
      <p><b>Slow down under pressure.</b> Deepfake fraud relies on urgency and hierarchy ("the executives are on the line, do it now"). A legitimate leader will never punish you for verifying a payment.</p>
      <h3>Using AI tools safely</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Use only AI tools and accounts approved by your organization. Consumer chatbots and free AI utilities are unapproved by default.</li>
        <li><b>Never enter confidential company, customer, or personal data into an unapproved AI tool.</b> Treat anything typed into a public chatbot as potentially public.</li>
        <li>Verify AI output before acting on it — models can be confidently wrong, and content an AI reads can carry hidden malicious instructions (prompt injection).</li>
        <li>Never let an AI tool send messages, move files, or take actions without your review.</li>
        <li>Report suspected deepfake calls or AI impersonation attempts immediately — even unsuccessful ones.</li>
      </ul>
    `,
    quiz: [
      { q: "You're on a video call with your CFO and two directors. The CFO asks you to wire funds to a new account before end of day. You can see and hear them clearly. What do you do?",
        options: [
          "Send it — video confirmation is the strongest identity proof there is",
          "Send it, but email the CFO afterwards to confirm",
          "Verify through a separate, known-good channel (call the CFO's known number) before moving anything",
          "Ask the people on the call to confirm their identities verbally"],
        correct: 2,
        explain: "This is exactly the Arup deepfake scenario — the entire call was fake. Money movement always gets out-of-band verification, even when you can 'see' the requester." },
      { q: "You want a quick summary of a confidential client contract. Which is acceptable?",
        options: [
          "Paste it into any free AI chatbot — it's just a summary",
          "Paste it into your personal AI account since you're the one responsible for the work",
          "Use only an AI tool your organization has approved for confidential data",
          "Paste it into a free tool but delete the chat afterwards"],
        correct: 2,
        explain: "Anything entered into an unapproved AI tool may be retained, reviewed, or used for training. Confidential data goes only into tools the organization has approved for it." }
    ]
  },
  {
    id: "m_data",
    title: "Data Handling & Privacy",
    content: `
      <p><b>The data you handle is the business.</b> Customer records, financials, tax documents, payroll — losing control of them is what turns a security incident into a legal and reputational crisis. Privacy laws across North America require companies to protect personal information and to notify the people affected when it's breached.</p>
      <h3>Know what's sensitive</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Personal information (names plus contact details, dates of birth, government ID numbers), financial and tax records, payroll and health details, and every kind of credential.</li>
        <li>Not sure whether something is sensitive? Treat it as if it is.</li>
      </ul>
      <h3>Handle it like money</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Need-to-know:</b> access only the data your work requires, and don't make personal copies "just in case."</li>
        <li><b>Share through approved channels only</b> — the company's secure portal or approved sharing tools, never personal email, personal cloud drives, or chat apps.</li>
        <li><b>Double-check the recipient before you hit send.</b> Misaddressed email is one of the most common data breaches there is — autocomplete is not your friend.</li>
        <li><b>Lock your screen every time you step away</b> (Windows: Win+L &middot; Mac: Ctrl+Cmd+Q) — at the office, at home, everywhere.</li>
        <li><b>Clean desk:</b> sensitive printouts go in a drawer or the shredder, never left out or sitting in the printer tray.</li>
        <li><b>Dispose properly:</b> shred paper; old laptops, phones, and drives go to IT for wiping. Deleting files is not erasing them.</li>
      </ul>
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4 mt-4">Sent something to the wrong person? That's a reportable incident — tell IT and your manager immediately so containment and any required notifications can start. Speed and honesty fix this; silence compounds it.</div>
    `,
    quiz: [
      { q: "You just realized you emailed a client's tax documents to the wrong recipient. What do you do?",
        options: [
          "Try to recall the message and hope it worked",
          "Ask the recipient to delete it and consider the matter closed",
          "Report it to IT and your manager immediately — misdirected data is a security incident",
          "Wait to see whether the recipient replies before deciding"],
        correct: 2,
        explain: "Misaddressed email is one of the most common breaches. Reporting fast lets the company contain it and meet any notification obligations — quietly handling it yourself doesn't." },
      { q: "A client needs their sensitive financial documents today. The right way to send them is…",
        options: [
          "An email attachment with 'CONFIDENTIAL' in the subject line",
          "Your personal Gmail, since the office portal is slow",
          "The company's approved secure portal, after double-checking the recipient",
          "Text message photos — texts are private"],
        correct: 2,
        explain: "Approved secure channels exist precisely for this. Email attachments, personal accounts, and texts leave copies you can't control — and the recipient check matters as much as the channel." },
      { q: "You're stepping away from your desk for two minutes. Your screen shows client records. You should…",
        options: [
          "Leave it — two minutes is nothing",
          "Lock the screen. Every time, no matter how short",
          "Turn the monitor slightly away from the aisle",
          "Close just the sensitive window"],
        correct: 1,
        explain: "Screen locking is a habit, not a judgment call. Two minutes is plenty of time for anyone passing to read, photograph, or use your session." }
    ]
  },
  {
    id: "m_ransom",
    title: "Ransomware & Backups",
    content: `
      <p><b>Ransomware is the most expensive thing that regularly happens to small businesses.</b> Attackers encrypt your files and demand payment — and most now steal a copy first, threatening to publish it ("double extortion"). It typically arrives through a phishing attachment or link, stolen remote-access credentials, or an unpatched system.</p>
      <h3>Early warning signs</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Files won't open, or filenames change to strange extensions.</li>
        <li>A "README" ransom note appears, or your wallpaper changes.</li>
        <li>The machine suddenly slows to a crawl as files churn in the background.</li>
      </ul>
      <h3>The first ten minutes</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Disconnect the machine from the network</b> — unplug the cable, turn off Wi-Fi — to stop the spread.</li>
        <li><b>Leave it powered on.</b> Evidence investigators need lives in memory.</li>
        <li><b>Report immediately.</b> Never negotiate, pay, or communicate with attackers yourself — payment decisions involve legal counsel, the insurer, and law enforcement.</li>
        <li>Don't "clean up" or restore anything until you're told to.</li>
      </ul>
      <h3>Backups are the real defense</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>The 3-2-1 rule:</b> three copies of important data, on two different types of storage, with one copy offsite.</li>
        <li><b>Keep one copy offline or immutable.</b> Modern ransomware hunts for connected backups and encrypts them too — a backup the malware can reach is not a backup.</li>
        <li><b>Test your restores.</b> A backup that's never been restored is a hope, not a plan.</li>
      </ul>
    `,
    quiz: [
      { q: "A ransom note appears on your screen demanding payment. Your first move is…",
        options: [
          "Power the machine off completely",
          "Disconnect it from the network, leave it powered on, and report immediately",
          "Pay quickly — the note says the price doubles tomorrow",
          "Search online for a free decryption tool"],
        correct: 1,
        explain: "Disconnecting stops the spread; staying powered on preserves evidence; reporting brings in the people (IT, insurer, counsel) who actually handle ransom decisions." },
      { q: "The 3-2-1 backup rule means…",
        options: [
          "Back up 3 times a day, keep for 2 years, review once a year",
          "3 copies of your data, on 2 different types of storage, 1 of them offsite",
          "3 staff with access, 2 passwords, 1 administrator",
          "3 clouds, 2 drives, 1 tape"],
        correct: 1,
        explain: "Three copies, two media types, one offsite — and ideally one of those copies offline or immutable so ransomware can't reach it." },
      { q: "Why must at least one backup copy be offline or immutable?",
        options: [
          "Offline storage is cheaper",
          "Because ransomware deliberately finds and encrypts every backup it can reach",
          "Regulators require tape backups",
          "Cloud backups are always too slow to restore"],
        correct: 1,
        explain: "Attackers know backups are your escape hatch, so encrypting or deleting them is part of the playbook. A copy the malware can't touch is what guarantees recovery." }
    ]
  },
  {
    id: "m_remote",
    title: "Remote & Mobile Work",
    content: `
      <p>Work now happens at kitchen tables, cafés, and airports. <b>The security perimeter is you.</b></p>
      <h3>Working from home</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Change your router's default admin password, use WPA2/WPA3 encryption, and keep the router's firmware updated.</li>
        <li>Work devices are for you alone — family members (and their game downloads) don't share your laptop.</li>
        <li>Lock the screen when you walk away, even at home.</li>
      </ul>
      <h3>Working in public</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Prefer your phone's hotspot over open public Wi-Fi, and use the company VPN where required.</li>
        <li>Assume shoulder surfing: use a privacy screen, sit with your back to a wall for sensitive work, and take calls where you can't be overheard.</li>
        <li>Never leave devices unattended — a bathroom break is all a thief needs.</li>
      </ul>
      <h3>Phones and tablets</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Strong PIN or biometrics, a short auto-lock, and apps from official stores only.</li>
        <li>Review app permissions — a flashlight app doesn't need your contacts.</li>
        <li>Don't forward work documents to personal email or personal devices.</li>
        <li><b>Lost or stolen device? Report it immediately.</b> IT can remotely wipe it — but only if they know. Minutes matter more than embarrassment.</li>
      </ul>
    `,
    quiz: [
      { q: "Your phone — with work email on it — is stolen at a conference. You should…",
        options: [
          "Wait a day; it may turn up at lost and found",
          "Change your email password when you're back at the office",
          "Report it to IT immediately so the device can be remotely wiped",
          "File a police report first, then tell IT next week"],
        correct: 2,
        explain: "Remote wipe only works while the window is open. Report first — everything else (police report, lost and found) can happen after IT locks the account." },
      { q: "You need to work on a confidential file at a café. The safest connection is…",
        options: [
          "The café's free Wi-Fi — it has a password from the barista",
          "Your phone's personal hotspot (plus the company VPN if required)",
          "Any network, as long as the file is only open for a few minutes",
          "The café Wi-Fi, but in your browser's incognito mode"],
        correct: 1,
        explain: "Your own hotspot removes the untrusted network entirely. Incognito mode does nothing for network security, and 'a password from the barista' means everyone in the room shares the network." },
      { q: "Your partner needs to print a boarding pass and your work laptop is right there. What's the policy?",
        options: [
          "Fine — printing is harmless",
          "Fine, if you watch them the whole time",
          "Work devices are single-user: they don't get used by family, full stop",
          "Fine, as long as they use a guest browser profile"],
        correct: 2,
        explain: "One shared session, one wrong download, one synced personal account — and the company device is compromised. Single-user means single-user." }
    ]
  },
  {
    id: "m_physical",
    title: "Physical Security",
    content: `
      <p>Not every attack comes through a screen. <b>Walking in the front door is still one of the easiest ways to steal data.</b></p>
      <h3>Doors and strangers</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Tailgating</b> is the classic move: someone with full hands, a delivery uniform, or a friendly smile follows you through a secured door. Being polite and being secure aren't the same thing — direct them to reception.</li>
        <li>Visitors and contractors get verified, signed in, and escorted. See someone unfamiliar wandering the office? "Can I help you find someone?" is both courteous and a security control.</li>
        <li>Claims of authority — "I'm the fire inspector," "IT sent me" — get verified before access. That's social engineering, in person.</li>
      </ul>
      <h3>Devices and documents</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Found a USB drive?</b> Give it to IT. Never plug it in — "lost" drives loaded with malware are a real attack, and curiosity is the delivery mechanism.</li>
        <li>Position screens away from windows and walkways, and mind what's on whiteboards and desks when visitors (or cameras) are around.</li>
        <li>Collect printouts immediately; shred, don't bin.</li>
        <li>Lock laptops away (or take them home) overnight, and lock your screen whenever you stand up.</li>
      </ul>
    `,
    quiz: [
      { q: "A delivery person with arms full of boxes asks you to badge them through the secure door. You should…",
        options: [
          "Hold the door — it's basic courtesy",
          "Badge them in, but watch where they go",
          "Offer to help carry boxes to reception, where they can be signed in",
          "Ignore them completely"],
        correct: 2,
        explain: "Full hands and time pressure are the tailgater's costume. You can be helpful and secure at once: everyone enters through reception, no exceptions." },
      { q: "You find a USB drive in the parking lot labelled 'Payroll 2026'. You should…",
        options: [
          "Plug it into your machine to identify the owner",
          "Plug it into an old spare laptop instead",
          "Hand it to IT without plugging it in anywhere",
          "Throw it in the garbage"],
        correct: 2,
        explain: "Labelled 'lost' drives are a known attack — the tempting label is the bait. Any machine you plug it into is potentially compromised, including the 'spare' one." },
      { q: "Someone at your desk says 'I'm the IT contractor — I need your laptop for ten minutes.' You've never seen them before. You should…",
        options: [
          "Hand it over — they knew the IT manager's name",
          "Verify with IT through a known channel before handing over anything",
          "Ask to see a business card first",
          "Let them work on it while you watch"],
        correct: 1,
        explain: "Name-dropping and confidence are free. A quick call to IT's known number costs one minute and defeats the entire con — business cards prove nothing." }
    ]
  },
  {
    id: "m6",
    title: "Reporting an Incident",
    content: `
      <h3>What counts as an incident?</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>A lost or stolen device (laptop, phone, USB drive).</li>
        <li>Suspected malware, ransomware, or a fake update prompt.</li>
        <li>You clicked a suspicious link, opened an attachment, entered credentials, or approved an unexpected MFA prompt.</li>
        <li>Unusual account activity or an unrecognized sign-in alert.</li>
        <li>Sensitive data sent to the wrong recipient.</li>
        <li>A suspected deepfake or impersonation attempt — even a failed one.</li>
      </ul>
      <h3>Report immediately — no matter how minor</h3>
      <p>Report every suspected incident to IT and your manager immediately, even if you're not sure it's real, and even if it started with your own mistake. <b>No one faces retaliation for good-faith reporting.</b> Minutes matter: fast reporting is the difference between resetting one password and notifying every customer.</p>
      <p>Speed also has legal weight — breach-notification laws and sector rules impose tight deadlines once a breach is discovered, so the organization must know early.</p>
      <div class="bg-wowzer-lighter border-l-4 border-wowzer-primary p-4 rounded mb-4 mt-4"><b>Containment tip:</b> if asked to contain a device, disconnect it from the network — but do <b>not</b> power it off, wipe it, or "clean it up." That destroys evidence investigators need.</div>
      <p>Don't discuss an incident with anyone outside the response team, and refer any external inquiries to management.</p>
    `,
    quiz: [
      { q: "You realize you entered your password on a page you now suspect was fake — 20 minutes ago. What now?",
        options: [
          "Change the password quietly and move on",
          "Wait to see if anything strange happens",
          "Report to IT and your manager immediately, then change the password as directed",
          "Delete the email so no one else falls for it, then monitor your account"],
        correct: 2,
        explain: "Report first, immediately. IT can reset credentials, kill sessions, and check for access you can't see. Quietly fixing it yourself leaves the attacker's foothold intact." },
      { q: "IT suspects your laptop is infected and asks you to contain it. You should…",
        options: [
          "Power it off completely to stop the malware",
          "Disconnect it from the network but leave it powered on",
          "Delete suspicious files, then keep working",
          "Run a disk wipe utility to be safe"],
        correct: 1,
        explain: "Disconnecting stops spread; leaving it powered on preserves the memory and disk evidence forensics needs. Wiping or powering off destroys that evidence." }
    ]
  }
];

export const FINAL_EXAM: QuizOption[] = [
  { img: "/assets/training/phish-office365.jpg",
    q: "What is the single biggest red flag in this email?",
    options: [
      "It mentions Office 365, which doesn't send email",
      "It claims to be Microsoft but is sent from an unrelated address (gmaich@nobleys.com)",
      "It has a blue button, and Microsoft never uses buttons",
      "It was sent on a weekend"],
    correct: 1 },
  { img: "/assets/training/phish-creditcard.jpg",
    q: "Why should this 'credit card statement' alarm you?",
    options: [
      "Banks never email customers",
      "The subject line is in lowercase",
      "A 'bank' is writing from a free Yahoo address and attaching a .zip file",
      "The email is too short to be real"],
    correct: 2 },
  { img: "/assets/training/phish-gmail.jpg",
    q: "What exposes this 'Google' alert as a mass-phishing template?",
    options: [
      "Google never sends security alerts",
      "Unfilled placeholders like {fname} {lname} and {email}",
      "The logo colors are slightly wrong",
      "It mentions an iPhone, and Google only mentions Android"],
    correct: 1 },
  { q: "The current standard for a strong work password is…",
    options: [
      "8+ characters with a symbol, changed every 60–90 days",
      "A unique 16+ character passphrase per account, kept in an approved password manager",
      "One memorized master password used across work accounts",
      "Any password, as long as MFA is enabled"],
    correct: 1 },
  { q: "You receive an MFA push notification you didn't trigger. The correct response is…",
    options: [
      "Approve it if you're currently at your desk",
      "Deny it and report it — someone likely has your password",
      "Ignore it; denying could lock your account",
      "Approve it once, then change your password later"],
    correct: 1 },
  { q: "A flawlessly written email from 'the CEO' asks you to buy gift cards for a client surprise. You should…",
    options: [
      "Do it — the writing style matches the CEO's",
      "Reply to the email asking for confirmation",
      "Verify with the CEO through a known channel; polished writing means nothing in the AI era",
      "Buy a smaller amount to limit the risk"],
    correct: 2 },
  { q: "On a live video call, your 'CFO' urgently instructs you to wire funds to a new account. The safest action is…",
    options: [
      "Comply — you can see it's really them",
      "Verify out-of-band via a known-good number before moving any money",
      "Ask them a personal question on the call",
      "Send half now and verify later"],
    correct: 1 },
  { q: "Pasting a confidential client document into a free AI chatbot is…",
    options: [
      "Fine if you delete the conversation afterwards",
      "Fine for summaries, but not full documents",
      "Never acceptable — only organization-approved AI tools may handle confidential data",
      "Acceptable if the chatbot's privacy policy looks reasonable"],
    correct: 2 },
  { q: "You clicked a link and entered your password before realizing the site was fake. The right move is…",
    options: [
      "Report to IT and your manager immediately",
      "Change the password and stay quiet — no harm done",
      "Monitor the account for a week before deciding",
      "Only report it if something bad actually happens"],
    correct: 0 },
  { q: "IT asks you to contain a possibly infected laptop. You should…",
    options: [
      "Power it down immediately",
      "Wipe the drive and reinstall",
      "Disconnect it from the network and leave it powered on",
      "Keep using it, but avoid opening files"],
    correct: 2 },
  { q: "A ransom note appears on a colleague's screen. The correct first response is…",
    options: [
      "Power the machine off to stop the encryption",
      "Disconnect it from the network, leave it on, and report immediately",
      "Pay while the ransom is still small",
      "Restore files from the connected backup drive right away"],
    correct: 1 },
  { q: "Which backup setup actually protects against ransomware?",
    options: [
      "A second copy on the same computer",
      "An external drive that stays plugged in for nightly backups",
      "3-2-1: three copies, two media types, one offsite — with one copy offline or immutable, and restores tested",
      "Cloud file-sync (e.g. a shared drive) on its own"],
    correct: 2 },
  { q: "You find a USB drive in the parking lot labelled 'Staff Bonuses'. You should…",
    options: [
      "Plug it in to identify the owner",
      "Plug it into a spare, non-work laptop",
      "Hand it to IT without plugging it into anything",
      "Leave it where it was"],
    correct: 2 },
  { q: "The right way to send a client their sensitive tax documents is…",
    options: [
      "Email attachment with 'CONFIDENTIAL' in the subject",
      "The approved secure portal, after double-checking the recipient",
      "Your personal email, since it's faster",
      "Photos by text message"],
    correct: 1 }
];
