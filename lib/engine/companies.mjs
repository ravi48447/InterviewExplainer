/**
 * companies.mjs — the loop-archetype database: how real companies interview.
 *
 * 100 companies cluster into ~8 archetypes. Each archetype is a round
 * sequence (camera flags, coding modes, personas, durations) with per-level
 * variants (fresher drills fundamentals, intermediate goes deep on design
 * and debate). Company entries map to archetypes with toughness bumps and
 * notes ("what's special about interviewing HERE").
 *
 * No LLM — deterministic config over the existing engine.
 */

// ---------------- round kinds ----------------
// camera: 'required' | 'optional' | 'off'
// mode: technical | coding | behavioral | mixed
// Each round runs the real engine (same Director/personas/AVE).

export const ARCHETYPES = {
  faang_swe: {
    id: 'faang_swe',
    name: 'Big Tech SWE Loop',
    description: 'DSA-heavy, collaborative, system design at scale. 4-5 rounds over a day.',
    rounds: {
      fresher: [
        { label: 'Online Coding Screen', minutes: 45, mode: 'coding', tier: 2, persona: 'mentor', camera: 'required', note: '2 DSA problems, camera proctored' },
        { label: 'Coding Round 1 — DSA', minutes: 45, mode: 'coding', tier: 3, persona: 'detail', camera: 'required', note: 'Arrays/strings/graphs, dry-run expected' },
        { label: 'Coding Round 2 — DSA', minutes: 45, mode: 'coding', tier: 3, persona: 'skeptic', camera: 'required', note: 'Harder problem, optimization follow-up' },
        { label: 'CS Fundamentals', minutes: 30, mode: 'technical', tier: 2, persona: 'detail', camera: 'optional', note: 'OS/DBMS/networks basics' },
        { label: 'Googleyness / Values', minutes: 30, mode: 'behavioral', tier: 2, persona: 'silent', camera: 'optional', note: 'Collaboration stories' },
      ],
      intermediate: [
        { label: 'Phone Screen', minutes: 45, mode: 'coding', tier: 2, persona: 'skeptic', camera: 'required', note: 'Live coding + complexity analysis' },
        { label: 'Coding — Algorithms', minutes: 45, mode: 'coding', tier: 3, persona: 'detail', camera: 'required', note: 'Optimal solution expected, complexity debate' },
        { label: 'System Design', minutes: 45, mode: 'technical', tier: 4, persona: 'architect', camera: 'required', note: 'HLD at 10M+ users scale' },
        { label: 'Domain Deep Dive', minutes: 45, mode: 'technical', tier: 3, persona: 'detail', camera: 'optional', note: 'Your stack, 3 levels deep' },
        { label: 'Behavioral / Leadership', minutes: 30, mode: 'behavioral', tier: 3, persona: 'skeptic', camera: 'optional', note: 'Conflict, failure, influence' },
      ],
    },
  },
  amazon_loop: {
    id: 'amazon_loop',
    name: 'Amazon-Style Loop',
    description: 'Leadership principles in every round, bar-raiser energy, data-driven stories.',
    rounds: {
      fresher: [
        { label: 'Screen — LP + basics', minutes: 30, mode: 'mixed', tier: 2, persona: 'mentor', camera: 'optional', note: '1-2 LP questions + CS basics' },
        { label: 'Coding — DSA', minutes: 45, mode: 'coding', tier: 2, persona: 'rapid', camera: 'required', note: 'Working code fast' },
        { label: 'LP Round 1', minutes: 30, mode: 'behavioral', tier: 3, persona: 'detail', camera: 'required', note: 'STAR with metrics required' },
        { label: 'LP Bar Raiser', minutes: 45, mode: 'behavioral', tier: 4, persona: 'skeptic', camera: 'required', note: 'Challenges every claim' },
        { label: 'Hiring Manager', minutes: 30, mode: 'behavioral', tier: 3, persona: 'silent', camera: 'optional', note: 'Dive deep on projects' },
      ],
      intermediate: [
        { label: 'Screen — LP + coding', minutes: 45, mode: 'coding', tier: 2, persona: 'skeptic', camera: 'required', note: 'SDE-2 bar: LP + code in one' },
        { label: 'Coding — Problem Solving', minutes: 45, mode: 'coding', tier: 3, persona: 'rapid', camera: 'required', note: 'Time-boxed, production-quality code' },
        { label: 'System Design', minutes: 45, mode: 'technical', tier: 4, persona: 'architect', camera: 'required', note: 'Distributed systems focus' },
        { label: 'LP Bar Raiser', minutes: 45, mode: 'behavioral', tier: 4, persona: 'skeptic', camera: 'required', note: 'Influence at scale stories' },
        { label: 'Hiring Manager — Depth', minutes: 45, mode: 'technical', tier: 3, persona: 'silent', camera: 'optional', note: 'Dive deep, insist on highest standards' },
      ],
    },
  },
  india_product: {
    id: 'india_product',
    name: 'India Product Company Loop',
    description: 'Practical machine coding + HLD + values. Flipkart/Swiggy/Razorpay style.',
    rounds: {
      fresher: [
        { label: 'Machine Coding', minutes: 60, mode: 'coding', tier: 2, persona: 'detail', camera: 'required', note: 'Build a working module — design + code + demo' },
        { label: 'DSA Round', minutes: 30, mode: 'coding', tier: 2, persona: 'rapid', camera: 'optional', note: '1-2 medium problems' },
        { label: 'CS Fundamentals', minutes: 30, mode: 'technical', tier: 2, persona: 'skeptic', camera: 'optional', note: 'DBMS, OS, networks — product bar' },
        { label: 'Values / HM', minutes: 30, mode: 'behavioral', tier: 2, persona: 'mentor', camera: 'optional', note: 'Culture-add check' },
      ],
      intermediate: [
        { label: 'Machine Coding', minutes: 90, mode: 'coding', tier: 3, persona: 'detail', camera: 'required', note: 'OOP design + working code + extensibility debate' },
        { label: 'DSA — Problem Solving', minutes: 45, mode: 'coding', tier: 3, persona: 'skeptic', camera: 'optional', note: 'Medium-hard, complexity discussion' },
        { label: 'HLD / System Design', minutes: 45, mode: 'technical', tier: 3, persona: 'architect', camera: 'required', note: 'Rate a real product flow' },
        { label: 'Domain Deep Dive', minutes: 45, mode: 'technical', tier: 3, persona: 'detail', camera: 'optional', note: 'Your tech choices interrogated' },
        { label: 'Hiring Manager', minutes: 30, mode: 'behavioral', tier: 3, persona: 'silent', camera: 'optional', note: 'Ownership stories' },
      ],
    },
  },
  gcc_product: {
    id: 'gcc_product',
    name: 'GCC / Captive R&D Loop',
    description: 'Walmart/Target/Intel style — fundamentals + domain + coding, professional.',
    rounds: {
      fresher: [
        { label: 'Coding — Fundamentals', minutes: 45, mode: 'coding', tier: 2, persona: 'mentor', camera: 'optional', note: 'Clean code on basics' },
        { label: 'Technical Core', minutes: 30, mode: 'technical', tier: 2, persona: 'skeptic', camera: 'optional', note: 'CS fundamentals depth' },
        { label: 'Domain / Manager', minutes: 30, mode: 'behavioral', tier: 2, persona: 'mentor', camera: 'off', note: 'Team fit + projects' },
      ],
      intermediate: [
        { label: 'Coding — Practical', minutes: 60, mode: 'coding', tier: 2, persona: 'detail', camera: 'required', note: 'Real-world problem, quality matters' },
        { label: 'System Design', minutes: 45, mode: 'technical', tier: 3, persona: 'architect', camera: 'optional', note: 'Design within constraints' },
        { label: 'Domain Round', minutes: 45, mode: 'technical', tier: 3, persona: 'detail', camera: 'optional', note: 'Deep in their stack' },
        { label: 'Manager + HR', minutes: 30, mode: 'behavioral', tier: 2, persona: 'silent', camera: 'off', note: 'Stability + collaboration' },
      ],
    },
  },
  it_services: {
    id: 'it_services',
    name: 'IT Services Loop',
    description: 'TCS/Infosys/Wipro style — basics, simple coding, heavy HR. Fresher volume hiring.',
    rounds: {
      fresher: [
        { label: 'Technical Basics', minutes: 20, mode: 'technical', tier: 1, persona: 'mentor', camera: 'off', note: 'OOP, DBMS, basic programs' },
        { label: 'Simple Coding', minutes: 20, mode: 'coding', tier: 1, persona: 'mentor', camera: 'off', note: 'Pattern/strings/loops level' },
        { label: 'HR Round', minutes: 20, mode: 'behavioral', tier: 1, persona: 'mentor', camera: 'off', note: 'Relocation, bond, communication' },
      ],
      intermediate: [
        { label: 'Technical Screening', minutes: 30, mode: 'technical', tier: 2, persona: 'skeptic', camera: 'optional', note: 'Your listed skills, verified live' },
        { label: 'Coding + Scenario', minutes: 30, mode: 'coding', tier: 2, persona: 'detail', camera: 'optional', note: 'Fix this bug / extend this module' },
        { label: 'Client Round', minutes: 30, mode: 'behavioral', tier: 2, persona: 'silent', camera: 'optional', note: 'Can you face the client?' },
      ],
    },
  },
  finance_quant: {
    id: 'finance_quant',
    name: 'Finance / HFT Loop',
    description: 'Goldman/DE Shaw style — math, low-level C++, brutal efficiency questions.',
    rounds: {
      fresher: [
        { label: 'Quant Screen', minutes: 45, mode: 'technical', tier: 3, persona: 'skeptic', camera: 'required', note: 'Probability + puzzles + mental math' },
        { label: 'Coding — Efficiency', minutes: 45, mode: 'coding', tier: 3, persona: 'rapid', camera: 'required', note: 'Cache-friendly code, no wasted cycles' },
        { label: 'Technical Deep', minutes: 45, mode: 'technical', tier: 3, persona: 'detail', camera: 'optional', note: 'Memory layout, concurrency' },
        { label: 'Behavioral', minutes: 30, mode: 'behavioral', tier: 2, persona: 'silent', camera: 'optional', note: 'Composure under pressure counts' },
      ],
      intermediate: [
        { label: 'Quant Round', minutes: 60, mode: 'technical', tier: 4, persona: 'skeptic', camera: 'required', note: 'Stochastic + market intuition' },
        { label: 'Low-level C++/Systems', minutes: 60, mode: 'coding', tier: 4, persona: 'detail', camera: 'required', note: 'Lock-free, memory model debate' },
        { label: 'System Design — Trading', minutes: 45, mode: 'technical', tier: 4, persona: 'architect', camera: 'required', note: 'Microseconds matter' },
        { label: 'Final — Stress', minutes: 45, mode: 'mixed', tier: 5, persona: 'panelist', camera: 'required', note: 'Rapid-fire, hostile, on purpose' },
      ],
    },
  },
  hardware_embed: {
    id: 'hardware_embed',
    name: 'Chip / Embedded Loop',
    description: 'Qualcomm/Intel/Nvidia style — C systems, debugging, hardware thinking.',
    rounds: {
      fresher: [
        { label: 'C Coding', minutes: 45, mode: 'coding', tier: 2, persona: 'detail', camera: 'optional', note: 'Pointers, memory, bit manipulation' },
        { label: 'Digital / Domain', minutes: 30, mode: 'technical', tier: 2, persona: 'skeptic', camera: 'off', note: 'CS + electronics fundamentals' },
        { label: 'Debug Round', minutes: 30, mode: 'coding', tier: 3, persona: 'detail', camera: 'optional', note: 'Find the bug in our snippet' },
      ],
      intermediate: [
        { label: 'Systems Coding', minutes: 60, mode: 'coding', tier: 3, persona: 'detail', camera: 'required', note: 'Concurrency + memory + perf' },
        { label: 'Architecture Round', minutes: 45, mode: 'technical', tier: 3, persona: 'architect', camera: 'optional', note: 'Pipeline/bandwidth tradeoffs' },
        { label: 'Debug Gauntlet', minutes: 45, mode: 'coding', tier: 4, persona: 'skeptic', camera: 'required', note: 'Race conditions, cache effects' },
        { label: 'Manager Round', minutes: 30, mode: 'behavioral', tier: 2, persona: 'silent', camera: 'off', note: 'Ownership of silicon-level bugs' },
      ],
    },
  },
  startup_practical: {
    id: 'startup_practical',
    name: 'Startup Practical Loop',
    description: 'Founder chat + build something real + review it. Ship-energy.',
    rounds: {
      fresher: [
        { label: 'Founder Chat', minutes: 20, mode: 'behavioral', tier: 1, persona: 'rapid', camera: 'required', note: 'Why us? What have you built?' },
        { label: 'Practical Coding', minutes: 45, mode: 'coding', tier: 2, persona: 'rapid', camera: 'required', note: 'Small working feature, fast' },
        { label: 'Build Review', minutes: 30, mode: 'technical', tier: 2, persona: 'detail', camera: 'optional', note: 'Defend your choices' },
      ],
      intermediate: [
        { label: 'Founder/CTO Chat', minutes: 30, mode: 'behavioral', tier: 2, persona: 'rapid', camera: 'required', note: 'Ownership history' },
        { label: 'Practical Build', minutes: 90, mode: 'coding', tier: 3, persona: 'rapid', camera: 'required', note: 'Real feature, judged on ship quality' },
        { label: 'Architecture Debate', minutes: 45, mode: 'technical', tier: 4, persona: 'architect', camera: 'required', note: 'Boring tech vs clever tech debate' },
      ],
    },
  },
};

// ---------------- the 100 companies ----------------
// toughness: bump on top of the archetype (1.0 = as defined, 1.2 = harder)
// levels: which levels we support loops for

export const COMPANIES = {
  // --- Big Tech ---
  google: { name: 'Google', archetype: 'faang_swe', toughness: 1.2, levels: ['fresher', 'intermediate'], note: 'Collaboration graded as much as correctness. Think out loud, always.' },
  meta: { name: 'Meta', archetype: 'faang_swe', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Speed matters — they expect two problems per coding round.' },
  microsoft: { name: 'Microsoft', archetype: 'faang_swe', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Calmer pace, deeper CS fundamentals. AA round at the end.' },
  apple: { name: 'Apple', archetype: 'faang_swe', toughness: 1.15, levels: ['fresher', 'intermediate'], note: 'Perfectionism bar: working code, no edge cases missed.' },
  netflix: { name: 'Netflix', archetype: 'faang_swe', toughness: 1.3, levels: ['intermediate'], note: 'Seniority-heavy; fresher roles rare. Expect systems depth.' },
  linkedin: { name: 'LinkedIn', archetype: 'faang_swe', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Culture-fit weighted heavily alongside code.' },
  adobe: { name: 'Adobe', archetype: 'faang_swe', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'CS fundamentals + clean OOP design emphasis.' },
  salesforce: { name: 'Salesforce', archetype: 'faang_swe', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Java-heavy, design patterns probed.' },
  oracle: { name: 'Oracle', archetype: 'gcc_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Database fundamentals weighted high.' },
  sap: { name: 'SAP', archetype: 'gcc_product', toughness: 0.85, levels: ['fresher', 'intermediate'], note: 'OOP + domain depth over DSA.' },
  ibm: { name: 'IBM', archetype: 'gcc_product', toughness: 0.85, levels: ['fresher', 'intermediate'], note: 'Enterprise scenarios, methodical pace.' },
  cisco: { name: 'Cisco', archetype: 'gcc_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Networking domain questions in every loop.' },
  vmware: { name: 'VMware', archetype: 'gcc_product', toughness: 1.1, levels: ['intermediate'], note: 'Virtualization + systems fundamentals.' },
  nvidia: { name: 'NVIDIA', archetype: 'hardware_embed', toughness: 1.3, levels: ['fresher', 'intermediate'], note: 'CUDA-aware systems thinking. Performance paranoia.' },
  qualcomm: { name: 'Qualcomm', archetype: 'hardware_embed', toughness: 1.15, levels: ['fresher', 'intermediate'], note: 'C + digital logic + embedded depth.' },
  intel: { name: 'Intel', archetype: 'hardware_embed', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Architecture + low-level C.' },
  amd: { name: 'AMD', archetype: 'hardware_embed', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Performance analysis mindset.' },
  broadcom: { name: 'Broadcom', archetype: 'hardware_embed', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Embedded + networking blend.' },
  samsung_rnd: { name: 'Samsung R&D', archetype: 'hardware_embed', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'C coding + domain + Korean-culture formality.' },
  ti: { name: 'Texas Instruments', archetype: 'hardware_embed', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Analog/digital + embedded C.' },

  // --- India product / unicorns ---
  amazon: { name: 'Amazon', archetype: 'amazon_loop', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'LP stories with metrics in every round. Bar-raiser challenges everything.' },
  flipkart: { name: 'Flipkart', archetype: 'india_product', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Machine coding is the make-or-break round.' },
  swiggy: { name: 'Swiggy', archetype: 'india_product', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Practical problem solving + HLD blend.' },
  zomato: { name: 'Zomato', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Speed + product sense.' },
  razorpay: { name: 'Razorpay', archetype: 'india_product', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Fintech rigor: correctness + idempotency questions.' },
  phonepe: { name: 'PhonePe', archetype: 'india_product', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Scale-first thinking from round 2.' },
  paytm: { name: 'Paytm', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Full-stack breadth expected.' },
  cred: { name: 'CRED', archetype: 'india_product', toughness: 1.15, levels: ['intermediate'], note: 'Design taste + craft bar is unusually high.' },
  meesho: { name: 'Meesho', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Cost-conscious design questions.' },
  groww: { name: 'Groww', archetype: 'india_product', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Reliability + fintech compliance angle.' },
  zepto: { name: 'Zepto', archetype: 'india_product', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Latency-first thinking.' },
  dream11: { name: 'Dream11', archetype: 'india_product', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Traffic spikes + consistency questions.' },
  ola: { name: 'Ola', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Ops-aware engineering expected.' },
  byjus: { name: 'BYJU\'S', archetype: 'india_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Faster loops, product-heavy.' },
  policybazaar: { name: 'PolicyBazaar', archetype: 'india_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Insurance domain questions.' },
  nykaa: { name: 'Nykaa', archetype: 'india_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'E-commerce fundamentals.' },
  urban_company: { name: 'Urban Company', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Marketplace design questions.' },
  freshworks: { name: 'Freshworks', archetype: 'india_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'SaaS product thinking.' },
  postman: { name: 'Postman', archetype: 'india_product', toughness: 1.1, levels: ['intermediate'], note: 'API-first everything.' },
  zoho: { name: 'Zoho', archetype: 'india_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Long practical tests; no-fancy-tools culture.' },
  mindtickle: { name: 'Mindtickle', archetype: 'india_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Data-heavy product questions.' },
  sprinklr: { name: 'Sprinklr', archetype: 'faang_swe', toughness: 1.15, levels: ['fresher', 'intermediate'], note: 'Product company bar with brutal practicals.' },
  nutanix: { name: 'Nutanix', archetype: 'faang_swe', toughness: 1.15, levels: ['intermediate'], note: 'Distributed systems depth from round 1.' },
  rubrik: { name: 'Rubrik', archetype: 'faang_swe', toughness: 1.2, levels: ['intermediate'], note: 'Systems + scale, serious bar.' },
  snowflake: { name: 'Snowflake', archetype: 'faang_swe', toughness: 1.25, levels: ['intermediate'], note: 'Data infrastructure depth.' },
  atlassian: { name: 'Atlassian', archetype: 'faang_swe', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Values round matters as much as code.' },
  duckcreek: { name: 'Duck Creek', archetype: 'gcc_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Insurance tech domain.' },

  // --- GCCs in India ---
  walmart: { name: 'Walmart Global Tech', archetype: 'gcc_product', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'E-commerce scale + strong fundamentals bar.' },
  target: { name: 'Target in India', archetype: 'gcc_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Retail domain + steady pace.' },
  lowes: { name: 'Lowe\'s India', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Enterprise patterns + fundamentals.' },
  tesco: { name: 'Tesco Technology', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Retail + data questions.' },
  bosch: { name: 'Bosch', archetype: 'gcc_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Embedded/auto domain option.' },
  mercedes: { name: 'Mercedes-Benz R&D', archetype: 'gcc_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Auto domain + German thoroughness.' },
  siemens: { name: 'Siemens', archetype: 'gcc_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Industrial systems domain.' },
  philips: { name: 'Philips', archetype: 'gcc_product', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Healthcare domain sensitivity.' },
  nokia: { name: 'Nokia', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Networks + C/C++ expected.' },
  ericsson: { name: 'Ericsson', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Telecom domain questions.' },
  amex: { name: 'American Express', archetype: 'gcc_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Fintech + data + SQL heavy.' },
  wellsfargo: { name: 'Wells Fargo', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Banking tech + compliance angle.' },
  hsbc: { name: 'HSBC Technology', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Banking domain + SQL.' },
  jpmc: { name: 'JPMorgan Chase', archetype: 'finance_quant', toughness: 1.1, levels: ['fresher', 'intermediate'], note: 'Low-level Java + data structures rigor.' },
  goldman: { name: 'Goldman Sachs', archetype: 'finance_quant', toughness: 1.25, levels: ['fresher', 'intermediate'], note: 'Interview gauntlet is famous — math + code + pressure.' },
  morganstanley: { name: 'Morgan Stanley', archetype: 'finance_quant', toughness: 1.15, levels: ['fresher', 'intermediate'], note: 'Low-level + domain + composure.' },
  deshaw: { name: 'D.E. Shaw', archetype: 'finance_quant', toughness: 1.4, levels: ['fresher', 'intermediate'], note: 'The hardest loop in this list. Puzzles + systems + stress.' },
  tower: { name: 'Tower Research', archetype: 'finance_quant', toughness: 1.4, levels: ['intermediate'], note: 'HFT: lock-free code or bust.' },
  graviton: { name: 'Graviton', archetype: 'finance_quant', toughness: 1.35, levels: ['intermediate'], note: 'Low-latency everything.' },
  quadeye: { name: 'Quadeye', archetype: 'finance_quant', toughness: 1.35, levels: ['intermediate'], note: 'C++ template-level depth.' },
  worldquant: { name: 'WorldQuant', archetype: 'finance_quant', toughness: 1.3, levels: ['fresher', 'intermediate'], note: 'Math + coding + research mindset.' },
  optiver: { name: 'Optiver', archetype: 'finance_quant', toughness: 1.35, levels: ['intermediate'], note: 'Mental math speed screens.' },
  marvel: { name: 'Marvel Semicon', archetype: 'finance_quant', toughness: 1.25, levels: ['intermediate'], note: 'Low-latency firmware.' },

  // --- IT services ---
  tcs: { name: 'TCS', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Volume hiring: basics + communication + HR.' },
  infosys: { name: 'Infosys', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'SP/systems mix; communication counted.' },
  wipro: { name: 'Wipro', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Basics + project explanation.' },
  hcl: { name: 'HCLTech', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Client-project scenarios.' },
  cognizant: { name: 'Cognizant', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Domain + communication round.' },
  accenture: { name: 'Accenture', archetype: 'it_services', toughness: 0.85, levels: ['fresher', 'intermediate'], note: 'Slightly stronger coding bar.' },
  capgemini: { name: 'Capgemini', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Pseudo-code + tech basics.' },
  techm: { name: 'Tech Mahindra', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Telecom domain flavor.' },
  ltimindtree: { name: 'LTIMindtree', archetype: 'it_services', toughness: 0.85, levels: ['fresher', 'intermediate'], note: 'Slightly product-ier bar.' },
  persistent: { name: 'Persistent Systems', archetype: 'it_services', toughness: 0.85, levels: ['fresher', 'intermediate'], note: 'Product-engineering tilt.' },
  mphasis: { name: 'Mphasis', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Standard services loop.' },
  virtusa: { name: 'Virtusa', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Java-heavy basics.' },
  hexaware: { name: 'Hexaware', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Standard services loop.' },
  cybage: { name: 'Cybage', archetype: 'it_services', toughness: 0.8, levels: ['fresher', 'intermediate'], note: 'Practical basics test.' },
  xion: { name: 'Xion Global', archetype: 'it_services', toughness: 0.8, levels: ['fresher'], note: 'Fresher volume loop.' },

  // --- Startups (archetypal) ---
  seed_startup: { name: 'Seed-Stage Startup', archetype: 'startup_practical', toughness: 0.9, levels: ['fresher', 'intermediate'], note: 'Founder face-time from round 1.' },
  series_a: { name: 'Series-A Startup', archetype: 'startup_practical', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Ship-something-real round dominates.' },
  series_c: { name: 'Growth-Stage Startup', archetype: 'startup_practical', toughness: 1.1, levels: ['intermediate'], note: 'Scale problems arrive in the loop.' },
  yc_startup: { name: 'YC-Style Startup', archetype: 'startup_practical', toughness: 1.05, levels: ['fresher', 'intermediate'], note: 'Velocity judged over polish.' },
  aifocused: { name: 'AI-Focused Startup', archetype: 'startup_practical', toughness: 1.15, levels: ['intermediate'], note: 'ML-systems build round included.' },

  // --- Remote-first western ---
  stripe: { name: 'Stripe', archetype: 'faang_swe', toughness: 1.25, levels: ['intermediate'], note: 'API design + correctness bar is extreme.' },
  cloudflare: { name: 'Cloudflare', archetype: 'faang_swe', toughness: 1.15, levels: ['intermediate'], note: 'Systems + networking depth.' },
  gitlab: { name: 'GitLab', archetype: 'gcc_product', toughness: 1.0, levels: ['intermediate'], note: 'Fully remote: async communication graded.' },
  automatic: { name: 'Automattic', archetype: 'startup_practical', toughness: 1.0, levels: ['intermediate'], note: 'Famous trial-project loop.' },
  doist: { name: 'Doist', archetype: 'startup_practical', toughness: 0.95, levels: ['intermediate'], note: 'Async-first culture interview.' },
  toptal: { name: 'Toptal', archetype: 'faang_swe', toughness: 1.2, levels: ['intermediate'], note: 'Screening is timed + strict.' },
  andela: { name: 'Andela', archetype: 'gcc_product', toughness: 0.95, levels: ['fresher', 'intermediate'], note: 'Global-placement loop.' },
  Turing: { name: 'Turing.com', archetype: 'gcc_product', toughness: 1.0, levels: ['fresher', 'intermediate'], note: 'Automated + human hybrid loops.' },
};

/** Count sanity: expose the full list. */
export const COMPANY_LIST = Object.entries(COMPANIES).map(([id, c]) => ({
  id,
  name: c.name,
  archetype: c.archetype,
  archetypeName: ARCHETYPES[c.archetype]?.name ?? '',
  toughness: c.toughness,
  levels: c.levels,
  note: c.note,
  roundCount: { fresher: ARCHETYPES[c.archetype]?.rounds?.fresher?.length ?? 0, intermediate: ARCHETYPES[c.archetype]?.rounds?.intermediate?.length ?? 0 },
}));

export function getCompany(id) {
  const c = COMPANIES[id];
  if (!c) return null;
  const a = ARCHETYPES[c.archetype];
  return { id, ...c, archetypeName: a.name, archetypeDescription: a.description, roundsByLevel: a.rounds };
}

/** Concrete loop for a company + level, with toughness applied. */
export function getCompanyLoop(companyId, level) {
  const c = getCompany(companyId);
  if (!c) return null;
  const lvl = c.levels.includes(level) ? level : c.levels[0];
  const rounds = (c.roundsByLevel[lvl] ?? []).map((r, i) => ({
    index: i + 1,
    ...r,
    toughness: c.toughness,
    company: c.name,
  }));
  return {
    companyId,
    companyName: c.name,
    archetypeName: c.archetypeName,
    level: lvl,
    toughness: c.toughness,
    note: c.note,
    totalMinutes: rounds.reduce((a, r) => a + r.minutes, 0),
    rounds,
  };
}

/** Browse/filter: by archetype, level, or search. */
export function browseCompanies({ archetype, level, search, limit = 100 } = {}) {
  let list = COMPANY_LIST;
  if (archetype) list = list.filter((c) => c.archetype === archetype);
  if (level) list = list.filter((c) => c.levels.includes(level));
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(s) || c.note.toLowerCase().includes(s));
  }
  return list.slice(0, limit);
}

export const ARCHETYPE_LIST = Object.values(ARCHETYPES).map((a) => ({
  id: a.id,
  name: a.name,
  description: a.description,
  levels: Object.keys(a.rounds),
}));
