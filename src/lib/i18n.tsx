import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

const STORAGE_KEY = "krishi-lang";

type Dict = Record<string, { bn: string; en: string }>;

export const dict: Dict = {
  appName: { bn: "কৃষি বন্ধু", en: "Krishi Bondhu" },
  tagline: { bn: "কৃষকের পাশে সরকারি সাহায্য", en: "Government help, beside every farmer" },
  heroTitle: { bn: "মাটির সাথে, প্রযুক্তির হাতে", en: "Rooted in soil, powered by tech" },
  heroSub: { bn: "সরকারি যোজনা, বাজার দর ও কৃষি পরামর্শ — একটাই অ্যাপে।", en: "Government schemes, market prices and expert tips — all in one app." },
  getStarted: { bn: "শুরু করুন", en: "Get started" },
  login: { bn: "লগইন", en: "Login" },
  signup: { bn: "নিবন্ধন", en: "Sign up" },
  logout: { bn: "লগ আউট", en: "Logout" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  fullName: { bn: "পুরো নাম", en: "Full name" },
  continueWithGoogle: { bn: "গুগল দিয়ে এগিয়ে যান", en: "Continue with Google" },
  or: { bn: "অথবা", en: "or" },
  haveAccount: { bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?", en: "Already have an account?" },
  noAccount: { bn: "অ্যাকাউন্ট নেই?", en: "No account?" },
  home: { bn: "হোম", en: "Home" },
  schemes: { bn: "যোজনা", en: "Schemes" },
  tips: { bn: "পরামর্শ", en: "Tips" },
  market: { bn: "বাজার", en: "Market" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  welcome: { bn: "স্বাগতম", en: "Welcome" },
  quickActions: { bn: "দ্রুত অ্যাক্সেস", en: "Quick access" },
  govSchemes: { bn: "সরকারি যোজনা", en: "Government schemes" },
  govSchemesDesc: { bn: "সাবসিডি, ঋণ ও বীমা", en: "Subsidies, loans & insurance" },
  farmingTips: { bn: "কৃষি পরামর্শ", en: "Farming tips" },
  farmingTipsDesc: { bn: "ফসল ও আবহাওয়া সংবাদ", en: "Crop care & weather news" },
  marketPrices: { bn: "বাজার দর", en: "Market prices" },
  marketPricesDesc: { bn: "আজকের ফসলের দাম", en: "Today's crop rates" },
  latestTips: { bn: "নতুন পরামর্শ", en: "Latest tips" },
  todayPrices: { bn: "আজকের দর", en: "Today's prices" },
  viewAll: { bn: "সব দেখুন", en: "View all" },
  apply: { bn: "আবেদন করুন", en: "Apply" },
  category: { bn: "বিভাগ", en: "Category" },
  all: { bn: "সব", en: "All" },
  saveProfile: { bn: "সংরক্ষণ করুন", en: "Save profile" },
  phone: { bn: "ফোন নম্বর", en: "Phone number" },
  district: { bn: "জেলা", en: "District" },
  village: { bn: "গ্রাম", en: "Village" },
  landSize: { bn: "জমির পরিমাণ (একর)", en: "Land size (acres)" },
  primaryCrops: { bn: "প্রধান ফসল (কমা দিয়ে আলাদা)", en: "Primary crops (comma separated)" },
  language: { bn: "ভাষা", en: "Language" },
  profileSaved: { bn: "প্রোফাইল সংরক্ষিত হয়েছে", en: "Profile saved" },
  loading: { bn: "লোড হচ্ছে…", en: "Loading…" },
  noData: { bn: "কোনো তথ্য নেই", en: "No data yet" },
  perKg: { bn: "প্রতি কেজি", en: "per kg" },
  perQuintal: { bn: "প্রতি কুইন্টাল", en: "per quintal" },
  eligibility: { bn: "যোগ্যতা", en: "Eligibility" },
  learnMore: { bn: "আরও জানুন", en: "Learn more" },
  signingIn: { bn: "সাইন ইন হচ্ছে…", en: "Signing in…" },
  authError: { bn: "ভুল হয়েছে, আবার চেষ্টা করুন।", en: "Something went wrong, please try again." },
  signupCheckEmail: { bn: "ইমেইল চেক করুন কনফার্মেশনের জন্য।", en: "Check your email to confirm." },

  problemsTitle: { bn: "কৃষকের সমস্যা", en: "Farmer's challenges" },
  problemsSub: { bn: "যে সমস্যাগুলো প্রতিদিন কৃষককে সামলাতে হয়", en: "What farmers face every single day" },
  problem1: { bn: "সরকারি যোজনার তথ্য সহজে পাওয়া যায় না", en: "Government scheme info is hard to find" },
  problem1Desc: { bn: "অনেক যোজনা আছে কিন্তু কোনটা কার জন্য — জানা কঠিন।", en: "Many schemes exist, but knowing which one fits you is tough." },
  problem2: { bn: "বাজারে দাম কম, মধ্যস্বত্বভোগী বেশি", en: "Low prices, too many middlemen" },
  problem2Desc: { bn: "বাজার দর না জানলে ন্যায্য মূল্য পাওয়া যায় না।", en: "Without market rates, fair pricing is impossible." },
  problem3: { bn: "আবহাওয়া ও ফসল পরামর্শের অভাব", en: "Lack of weather & crop advice" },
  problem3Desc: { bn: "সঠিক সময়ে সঠিক পরামর্শ ছাড়া ফলন কমে যায়।", en: "Without timely advice, yield suffers." },
  problem4: { bn: "ভাষার বাধা", en: "Language barrier" },
  problem4Desc: { bn: "ইংরেজি ফর্ম ও পোর্টাল বুঝতে অসুবিধা।", en: "English forms and portals create barriers." },

  solutionsTitle: { bn: "আমাদের সমাধান", en: "Our solution" },
  solutionsSub: { bn: "এক অ্যাপে কৃষকের সব প্রয়োজন", en: "Everything a farmer needs, in one app" },
  feature1Title: { bn: "যাচাই করা সরকারি যোজনা", en: "Verified government schemes" },
  feature1Desc: { bn: "PM-Kisan, KCC, ফসল বীমা সহ সব সরকারি সাহায্যের গাইড — যোগ্যতা, আবেদন ও কাগজপত্র।", en: "PM-Kisan, KCC, crop insurance — complete guide with eligibility, applications and documents." },
  feature2Title: { bn: "রিয়েল-টাইম বাজার দর", en: "Real-time market prices" },
  feature2Desc: { bn: "প্রতিদিনের মান্ডি ও স্থানীয় বাজারের দর — জেলা অনুযায়ী।", en: "Daily mandi and local market rates — district-wise." },
  feature3Title: { bn: "বিশেষজ্ঞের কৃষি পরামর্শ", en: "Expert farming tips" },
  feature3Desc: { bn: "ফসল পরিচর্যা, কীটনাশক, সেচ ও আবহাওয়ার সতর্কতা — বাংলায়।", en: "Crop care, pesticides, irrigation and weather alerts — in simple Bangla." },
  feature4Title: { bn: "দ্বিভাষিক — বাংলা ও ইংরেজি", en: "Bilingual — Bangla & English" },
  feature4Desc: { bn: "এক ট্যাপে ভাষা পরিবর্তন করুন।", en: "Switch language with a single tap." },

  howTitle: { bn: "কীভাবে কাজ করে", en: "How it works" },
  howSub: { bn: "তিনটি সহজ ধাপে শুরু করুন", en: "Get started in three easy steps" },
  step1Title: { bn: "নিবন্ধন করুন", en: "Sign up" },
  step1Desc: { bn: "ইমেইল বা গুগল দিয়ে এক মিনিটে অ্যাকাউন্ট তৈরি করুন।", en: "Create an account in under a minute." },
  step2Title: { bn: "প্রোফাইল পূরণ করুন", en: "Fill your profile" },
  step2Desc: { bn: "জেলা, ফসল ও জমির পরিমাণ দিন।", en: "Add district, crops and land size." },
  step3Title: { bn: "সাহায্য পান", en: "Get help" },
  step3Desc: { bn: "যোজনা, বাজার দর ও পরামর্শ — সব হাতের মুঠোয়।", en: "Schemes, prices and tips — all in your pocket." },

  statSchemes: { bn: "সরকারি যোজনা", en: "Govt. schemes" },
  statDistricts: { bn: "জেলা কভারেজ", en: "Districts covered" },
  statCrops: { bn: "ফসলের দাম", en: "Crop prices tracked" },
  statTips: { bn: "কৃষি পরামর্শ", en: "Farming tips" },

  faqTitle: { bn: "সাধারণ প্রশ্ন", en: "Frequently asked questions" },
  faq1Q: { bn: "এই অ্যাপ কি বিনামূল্যে?", en: "Is the app free to use?" },
  faq1A: { bn: "হ্যাঁ, কৃষি বন্ধু সম্পূর্ণ বিনামূল্যে — কোনো লুকানো খরচ নেই।", en: "Yes, Krishi Bondhu is completely free with no hidden charges." },
  faq2Q: { bn: "যোজনার তথ্য কতটা সঠিক?", en: "How accurate is the scheme information?" },
  faq2A: { bn: "সব তথ্য সরকারি ওয়েবসাইট থেকে নেওয়া এবং নিয়মিত আপডেট করা হয়।", en: "All info is sourced from official government portals and updated regularly." },
  faq3Q: { bn: "ইন্টারনেট ছাড়া কাজ করে?", en: "Does it work offline?" },
  faq3A: { bn: "প্রথমবার লোড হলে সীমিত অফলাইন ব্যবহার সম্ভব।", en: "Once loaded, limited offline use is available for cached content." },
  faq4Q: { bn: "আমার তথ্য কি সুরক্ষিত?", en: "Is my data safe?" },
  faq4A: { bn: "আপনার সব তথ্য এনক্রিপ্টেড — শুধু আপনি দেখতে পারেন।", en: "All your data is encrypted and only visible to you." },

  ctaTitle: { bn: "আজই শুরু করুন — কৃষি হোক আরও সহজ", en: "Start today — make farming easier" },
  ctaSub: { bn: "হাজারো কৃষকের সাথে যুক্ত হন। বিনামূল্যে, চিরকাল।", en: "Join thousands of farmers. Free, forever." },
  ctaButton: { bn: "ফ্রি অ্যাকাউন্ট তৈরি করুন", en: "Create free account" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "bn" || stored === "en") setLangState(stored);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };
  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
