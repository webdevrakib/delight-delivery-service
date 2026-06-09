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
