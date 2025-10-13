// verifier: OCR + QA + summarizer + contradiction rules + OCR cleanup + cue overlap
import { pipeline, env } from '@huggingface/transformers';

// ------- Use remote Hugging Face models -------
env.cacheDir = 'indexeddb://transformers';
env.allowLocalModels = false;
delete (env as any).localModelPath;
;(env as any).HF_ENDPOINT = 'https://huggingface.co';
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.wasmPaths =
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/dist/';
}

// ------- Models (QA + summarizer only) -------
const ID_QA  = 'Xenova/distilbert-base-cased-distilled-squad';
const ID_SUM = 'Xenova/distilbart-cnn-6-6';

let qaP:  Promise<any> | null = null;
let sumP: Promise<any> | null = null;

async function getQA()  { if (!qaP)  qaP  = pipeline('question-answering', ID_QA);  return qaP; }
async function getSUM() { if (!sumP) sumP = pipeline('summarization',      ID_SUM); return sumP; }

// Safe wrappers
async function safeQA(input: { question: string; context: string }) {
  try {
    const ctx = (input.context || '').trim();
    if (ctx.length < 16) return null; // guard ONNX flake on tiny contexts
    const qa = await getQA();
    return await qa(input);
  } catch { return null; }
}
async function safeSUM(text: string, max_new_tokens = 96) {
  try {
    const t = (text || '').trim();
    if (!t) return null;
    const sum = await getSUM();
    return await sum(t.slice(0, 1200), { max_new_tokens });
  } catch { return null; }
}

function clean(s: string) { return (s || '').replace(/\s+/g, ' ').trim(); }

function cleanOCR(raw: string) {
  if (!raw) return '';
  let t = raw;
  t = t.replace(/https?:\/\/\S+/gi, ' ');                // remove http(s) URLs
  t = t.replace(/\b[a-z0-9.-]+\.[a-z]{2,}\S*/gi, ' ');   // remove domain-like blobs
  t = t.replace(/[#/_\\|()[\]{}~`^<>*+=:;,"'’]/g, ' ');  // strip symbols
  t = t.replace(/\d+[.:/-]?\d*/g, ' ');                  // drop most numbers (OCR junk)
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

const STOP = new Set(['the','a','an','and','or','to','for','of','in','on','at','by','with','from','this','that','is','are','be','was','were','it','as','we','our','you','your','they','their','i','me','my','us','them','will','can']);
function tokens(t: string) {
  return t
    .toLowerCase()
    .replace(/[#@]/g,'')
    .split(/[^\w]+/)
    .filter(w => w && !STOP.has(w) && !/\d/.test(w)); // drop tokens containing digits
}
function topKeywords(t: string, k=8){
  const f=new Map<string,number>();
  for(const w of tokens(t)) f.set(w,(f.get(w)||0)+1);
  return [...f].sort((a,b)=>b[1]-a[1]).slice(0,k).map(([w])=>w);
}
function overlap(a: string, b: string){
  const A=new Set(tokens(a)), B=new Set(tokens(b));
  if(!A.size||!B.size) return 0;
  let i=0; for(const w of A) if(B.has(w)) i++;
  return i/Math.min(A.size,B.size); // 0..1
}
function hostOf(url?: string){
  try{ return url ? new URL(url).host.toLowerCase() : ''; } catch { return ''; }
}
function pathKeywords(url?: string){
  try{ if(!url) return []; const u=new URL(url); return u.pathname.toLowerCase().split(/[^\w]+/).filter(Boolean); } catch { return []; }
}

// Amount extraction: require currency cues for OCR/QA paths to avoid noise
type AmtOpts = { requireCurrency?: boolean };
function extractAmountLike(text: string, opts: AmtOpts = {}){
  const t = text ?? '';
  // currency forms
  const m1 = t.match(/(?:\$|usd|sgd|s\$)\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+(?:\.[0-9]+)?)/i);
  if (m1) return parseFloat(m1[1].replace(/,/g,''));
  if (!opts.requireCurrency) {
    const m2 = t.match(/\b([0-9]+(?:\.[0-9]+)?)\s*(k|thousand)\b/i);
    if (m2) { let n = parseFloat(m2[1]); if (!isFinite(n)) return null; return n*1000; }
    const m3 = t.match(/\b([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+(?:\.[0-9]+)?)\b(?=[^\n]{0,10}\b(goal|raise|raising|target|needs)\b)/i);
    if (m3) return parseFloat(m3[1].replace(/,/g,''));
  }
  return null;
}
function approxEqual(a:number,b:number,pct=0.25){
  const d=Math.abs(a-b), tol=Math.max(1,pct*Math.max(a,b));
  return d<=tol;
}

// Known terms (for soft gates)
const COMMON_MEDICAL = new Set([
  'cancer','leukemia','surgery','fracture','pneumonia','sepsis','diabetes','stroke','asthma',
  'appendicitis','tumor','chemotherapy','transplant','dialysis','liver','kidney','heart',
  'pyometra','operation','hospital','doctor','treatment','injury','vet','patient','clinical'
]);
const PET_TERMS = new Set(['dog','cat','puppy','kitten','pet','canine','feline','stray','animal','rescue','shelter']);
const FUNDRAISE_TERMS = new Set(['donate','donation','fund','fundraiser','gofundme','goal','raise','raising','target','help','support']);
const AWARENESS_TERMS = new Set(['awareness','month','ptsd','symptoms','educate','information','signs','tips','campaign','misunderstood','unnoticed']);

// Cue keys (used to override low lexical sim when both sides clearly talk about the same thing)
const CUE_KEYS = ['surgery','emergency','help','gofundme','donate','fundraiser','vet','medical','pyometra'];

const CATEGORY_KEYWORDS: Record<string,string[]> = {
  'medical': ['hospital','surgery','treatment','doctor','medicine','illness','injury','vet','operation','diagnosis','emergency','clinic','patient','pyometra'],
  'medical-emergency': ['surgery','emergency','urgent','operation','icu','trauma','vet','procedure','ambulance','critical','pyometra'],
  'disaster-relief': ['flood','earthquake','hurricane','typhoon','wildfire','evacuation','storm','relief','rebuild','disaster'],
  'food-security': ['food','meals','supplies','hunger','kitchen','pantry','groceries','nutrition'],
  'community': ['community','neighbour','mutual','aid','school','local','support','drive'],
  'environment': ['tree','forest','wildlife','conservation','cleanup','recycling','climate','beach'],
  'awareness': ['awareness','inform','educate','learn','share','campaign','information','ptsd','symptoms']
};
function categoryAlignScore(category: string, text: string){
  const keys = CATEGORY_KEYWORDS[category] || [];
  if (!keys.length) return { ratio: 0.5, hits: 0 };
  const bag = new Set(tokens(text));
  let hit = 0; for (const k of keys) if (bag.has(k)) hit++;
  return { ratio: hit / Math.max(3, keys.length), hits: hit };
}

function classifyText(text: string){
  const tks = tokens(text);
  let medical=0, awareness=0, pet=0, fund=0;
  for (const w of tks) {
    if (COMMON_MEDICAL.has(w)) medical++;
    if (AWARENESS_TERMS.has(w)) awareness++;
    if (PET_TERMS.has(w)) pet++;
    if (FUNDRAISE_TERMS.has(w)) fund++;
  }
  return { medical, awareness, pet, fund, len: tks.length };
}

// ------- Rules/Types -------
const ALLOW_HOSTS = new Set(['gofundme.com','www.gofundme.com','justgiving.com','www.justgiving.com','give.asia','www.give.asia','giving.sg','www.giving.sg','globalgiving.org','www.globalgiving.org']);
const NGO_HOSTS   = new Set(['globalgiving.org','www.globalgiving.org','giving.sg','www.giving.sg']);

export type VerifyTier = 'NGO-Verified' | 'Community-Verified' | 'Awareness';

export type LocalVerifyInput = {
  title: string;
  description: string;
  goals?: string;
  category: string;
  fundraiserUrl?: string;
  transcriptText?: string; // OCR/captions
};

export type LocalVerifySuccess = {
  approved: true;
  message: string;
  aiSummary: string;
  hashtags: string[];
  verificationTier: VerifyTier;
  scores: { consistency: number; reliability: number };
  reasons?: string[];
};

export type LocalVerifyFailure = {
  approved: false;
  message: string;
  reasons: string[];
  step: 'consistency' | 'reliability' | 'api';
  scores?: { consistency?: number; reliability?: number };
};

export type LocalVerifyOutput = LocalVerifySuccess | LocalVerifyFailure;

// ------- Core -------
export async function verifyClientSide(input: LocalVerifyInput): Promise<LocalVerifyOutput> {
  const reasons: string[] = [];
  const title = clean(input.title);
  const desc  = clean(input.description);

  // Clean OCR heavily
  const ocrRaw = clean(input.transcriptText || '');
  const ocr = cleanOCR(ocrRaw);
  const ocrSufficient = ocr.length >= 40 || /awareness|ptsd|symptom|donat|fund|surgery|emergency/i.test(ocr);

  const combined = clean([desc, title, ocr].filter(Boolean).join('. ')).slice(0, 1200);
  const formBundle = clean([title, desc, input.goals, input.category].filter(Boolean).join('. '));

  // --- Title vs Description (soft) ---
  const titleDescSim = overlap(title, desc);
  const bothHaveName = /[A-Z][a-z]{2,}/.test(input.title) && desc.toLowerCase().includes(input.title.match(/[A-Z][a-z]{2,}/)?.[0]?.toLowerCase() || ''); // crude shared proper noun (e.g., Layla)
  const descHasMedical = tokens(desc).some(w => COMMON_MEDICAL.has(w));
  const titleDescOK  = titleDescSim >= 0.50 || bothHaveName || descHasMedical;
  if (!titleDescOK) reasons.push(`Title and description look mismatched (sim ${titleDescSim.toFixed(2)} < 0.50).`);

  // --- Cue overlap (helps valid cases even with noisy OCR) ---
  const formCues = new Set(tokens(`${title} ${desc} ${input.category}`));
  const ocrCues  = new Set(tokens(ocr));
  const sharedCues = CUE_KEYS.filter(k => formCues.has(k) && ocrCues.has(k)).length;

  // --- OCR vs Form (HARD if OCR is sufficient) ---
  const ocrVsFormSim = ocr ? overlap(ocr, formBundle) : 0;
  const ocrVsFormOK  = !ocrSufficient || (ocrVsFormSim >= 0.55 || sharedCues >= 1);
  if (ocrSufficient && !ocrVsFormOK) {
    reasons.push(`Video text does not match the form (sim ${ocrVsFormSim.toFixed(2)} < 0.55).`);
  }

  // --- Combined vs Form (backup consistency) ---
  const combinedSim = overlap(combined, formBundle);
  const combinedOK  = combinedSim >= 0.60 || sharedCues >= 1; // cue match can rescue
  if (!(combinedSim >= 0.60) && sharedCues < 1) {
    reasons.push(`Details don’t match combined content (sim ${combinedSim.toFixed(2)} < 0.60).`);
  }

  // --- Category alignment ---
  const { ratio: catRatio, hits: catHits } = categoryAlignScore(input.category, `${title} ${desc} ${ocr}`);
  const catOK = catRatio >= 0.35 || catHits >= 2;
  if (!catOK) reasons.push(`Category keywords do not align (score ${catRatio.toFixed(2)}, hits ${catHits}).`);

  // --- Contradiction rules (OCR awareness vs fundraiser medical/pet surgery) ---
  if (ocrSufficient) {
    const c = classifyText(ocr);
    const formIsFundraiser = /(fund|donat|gofund|help|goal|raise)/i.test(`${title} ${desc} ${input.category}`) || !!input.fundraiserUrl;
    const formMentionsMedical = /(surgery|illness|medical|hospital|pyometra|vet|emergency)/i.test(`${title} ${desc} ${input.category}`);
    const formMentionsPet = /(dog|cat|pet|puppy|kitten)/i.test(`${title} ${desc}`);

    if (c.awareness >= 2 && c.fund === 0 && (formIsFundraiser && (formMentionsMedical || formMentionsPet))) {
      reasons.push(`OCR indicates awareness content (e.g., “awareness/PTSD”) while the form describes a fundraiser.`);
    }
  }

  // --- QA assisted checks (best-effort) ---
  let formVsContent = combinedOK ? 0.7 : 0.4; // heuristic baseline
  const qaContext = ocrSufficient ? ocr : combined;
  if (qaContext.length >= 16) {
    const qPurpose = await safeQA({ question: 'What is this about?',             context: qaContext });
    const qType    = await safeQA({ question: 'Is this fundraising or awareness?', context: qaContext });
    const purposeScore = overlap(qPurpose?.answer || '', `${title} ${desc}`);
    const typeOK = /awareness/i.test(input.category)
      ? !/fund|donat/i.test((qType?.answer || ''))
      : true;
    formVsContent = Math.max(formVsContent, (purposeScore + (typeOK ? 1 : 0)) / 2);

    const goalC = extractAmountLike(qPurpose?.answer || qaContext, { requireCurrency: true });
    const goalF = extractAmountLike(String(input.goals||'')) ?? extractAmountLike(desc);
    if (goalC !== null && goalF !== null && !approxEqual(goalC, goalF, 0.25)) {
      reasons.push(`Goal mismatch: content ≈ ${Math.round(goalC)} vs form ≈ ${Math.round(goalF)}.`);
    }
  } else {
    reasons.push('QA skipped due to short/empty context.');
  }

  // --- Aggregate consistency ---
  const consistency = Math.max(0, Math.min(1,
    0.15 * titleDescSim +
    0.45 * (ocrSufficient ? ocrVsFormSim : combinedSim) +
    0.20 * catRatio +
    0.20 * formVsContent
  ));

  // Decision rule:
  // If OCR sufficient: need (ocrVsFormOK) AND (titleDescOK OR catOK).
  // If OCR not sufficient: need (combinedOK) AND (titleDescOK OR catOK).
  const coreOK = (ocrSufficient ? ocrVsFormOK : combinedOK) && (titleDescOK || catOK);
  const hasContradiction = reasons.some(r => /OCR indicates awareness/.test(r));
  const consistencyOK = coreOK && !hasContradiction;

  // ------- RELIABILITY -------
  let reliability = 0;
  let reliabilityOK = true;

  if (input.fundraiserUrl) {
    const host = hostOf(input.fundraiserUrl);
    const isAllowed = ALLOW_HOSTS.has(host);
    const isHttps   = /^https:\/\//i.test(input.fundraiserUrl);
    const slug = new Set(pathKeywords(input.fundraiserUrl));
    const titleWords = new Set(topKeywords(title, 8));
    let overlapSlug = 0; titleWords.forEach(w => { if (slug.has(w)) overlapSlug++; });

    reliability = (isAllowed ? 0.6 : 0) + (isHttps ? 0.2 : 0) + Math.min(0.2, overlapSlug * 0.05);
    reliabilityOK = isAllowed && isHttps;

    if (!isAllowed) reasons.push(`Domain not in allowlist: ${host || 'invalid URL'}.`);
    if (!isHttps)   reasons.push('Fundraiser link is not HTTPS.');
  } else {
    if (/(fund|donate|relief|medical|aid|drive|charity|ngo|surgery|help)/i.test(`${title} ${input.category}`)) {
      reliabilityOK = false;
      reasons.push('Missing external donation/charity link.');
    } else {
      reliabilityOK = true; reliability = 0.8;
    }
  }

  const host = hostOf(input.fundraiserUrl);
  const verificationTier: VerifyTier = input.fundraiserUrl
    ? (NGO_HOSTS.has(host) ? 'NGO-Verified' : 'Community-Verified')
    : 'Awareness';

  // ------- Final decision -------
  if (consistencyOK && reliabilityOK) {
    const hashtags = Array.from(new Set(topKeywords(`${title} ${desc}`, 8))).slice(0, 6);
    const out = await safeSUM(clean([title, desc].join('. ')));
    const aiSummary = (Array.isArray(out) ? out?.[0]?.summary_text : (out as any)?.summary_text || '')?.trim()
                   || (desc.match(/^.{1,160}([.!?]|$)/)?.[0] || desc.slice(0,160));

    return {
      approved: true,
      message: 'Verified. Badge + boost enabled.',
      aiSummary,
      hashtags,
      verificationTier,
      scores: { consistency, reliability },
      reasons: reasons.length ? reasons : undefined,
    };
  }

  return {
    approved: false,
    message: reasons[0] || 'Verification failed.',
    reasons,
    step: !consistencyOK ? 'consistency' : 'reliability',
    scores: { consistency, reliability },
  };
}

// Optional prewarm (QA + SUM only)
let once: Promise<void> | null = null;
export function prewarmModels() {
  if (once) return once;
  once = (async () => {
    try {
      await Promise.all([
        pipeline('question-answering', ID_QA),
        pipeline('summarization',      ID_SUM),
      ]);
    } catch {/* ignore */}
  })();
  return once;
}
