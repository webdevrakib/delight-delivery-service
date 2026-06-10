import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sprout, ChevronLeft, ChevronRight, Tractor, ShoppingBag, Leaf,
  Bell, MessageCircle, User, ShieldCheck, Users, Sparkles, Home, X,
  Play, Pause, Code2, Database, Cloud, Rocket, Globe, Smartphone,
  Languages, LogIn, Search, FileText, CreditCard, Server, Cpu, Wrench,
  CheckCircle2, BookOpen, Target, TrendingUp, HeartHandshake, Phone,
  MapPin, Camera, Lock, Zap, GitBranch, Package,
} from "lucide-react";

export const Route = createFileRoute("/presentation")({
  head: () => ({ meta: [{ title: "App Presentation — Krishi Bondhu" }] }),
  component: PresentationPage,
});

type Bullet = { icon: React.ElementType; title: string; desc: string };
type Slide = {
  kicker: string;
  title: string;
  body?: string;
  bullets?: Bullet[];
  gradient: string;
  icon: React.ElementType;
};

const slides: Slide[] = [
  // 1. Cover
  {
    kicker: "কৃষি বন্ধু",
    title: "বাংলাদেশের কৃষকদের জন্য সম্পূর্ণ ডিজিটাল প্ল্যাটফর্ম",
    body: "ফসল বিক্রি, যন্ত্র ভাড়া, রোগবালাই সমাধান, সরকারি স্কিম ও ২৪/৭ হেল্পলাইন — সব এক অ্যাপে।",
    gradient: "from-emerald-500/30 via-green-500/20 to-teal-500/10",
    icon: Sprout,
  },
  // 2. Problem
  {
    kicker: "সমস্যা",
    title: "কৃষকরা যে সমস্যাগুলোর মুখোমুখি হন",
    bullets: [
      { icon: ShoppingBag, title: "মধ্যস্বত্বভোগীর চাপ", desc: "ন্যায্য দামে ফসল বিক্রির সুযোগ কম।" },
      { icon: Tractor, title: "যন্ত্রের অভাব", desc: "মৌসুমে সময়মতো যন্ত্র ভাড়া পাওয়া কঠিন।" },
      { icon: Leaf, title: "রোগবালাইয়ে ক্ষতি", desc: "দ্রুত ও সঠিক পরামর্শ পাওয়া যায় না।" },
      { icon: BookOpen, title: "তথ্যের ঘাটতি", desc: "সরকারি স্কিম ও প্রকল্প সম্পর্কে অজ্ঞতা।" },
    ],
    gradient: "from-rose-500/25 via-orange-500/20 to-amber-500/10",
    icon: Target,
  },
  // 3. Solution overview
  {
    kicker: "সমাধান",
    title: "এক অ্যাপেই সব সমাধান",
    bullets: [
      { icon: ShoppingBag, title: "মার্কেটপ্লেস", desc: "সরাসরি ক্রেতা-বিক্রেতা সংযোগ।" },
      { icon: Tractor, title: "যন্ত্র ভাড়া", desc: "কাছাকাছি যন্ত্র খুঁজুন ও বুক করুন।" },
      { icon: Leaf, title: "কৃষি বন্ধু", desc: "রোগবালাই ও পরামর্শ।" },
      { icon: MessageCircle, title: "হেল্পলাইন", desc: "চ্যাটবট দিয়ে সাপোর্ট।" },
    ],
    gradient: "from-emerald-500/25 via-green-500/20 to-lime-500/10",
    icon: Sparkles,
  },
  // 4. Registration & Login
  {
    kicker: "ফিচার ১",
    title: "রেজিস্ট্রেশন ও লগইন",
    body: "Email/Password বা Google দিয়ে এক ক্লিকে অ্যাকাউন্ট খুলুন।",
    bullets: [
      { icon: LogIn, title: "একাধিক লগইন অপশন", desc: "Email + Google OAuth সাপোর্ট।" },
      { icon: ShieldCheck, title: "নিরাপদ পাসওয়ার্ড", desc: "Reset password ও email verification।" },
      { icon: User, title: "ভূমিকা নির্বাচন", desc: "কৃষক, ক্রেতা বা যন্ত্র মালিক হিসেবে যুক্ত হন।" },
    ],
    gradient: "from-sky-500/25 via-blue-500/20 to-indigo-500/10",
    icon: LogIn,
  },
  // 5. Profile
  {
    kicker: "ফিচার ২",
    title: "প্রোফাইল ও ভাষা",
    bullets: [
      { icon: User, title: "ব্যক্তিগত তথ্য", desc: "নাম, ফোন, ঠিকানা, NID সংরক্ষণ।" },
      { icon: MapPin, title: "জমির তথ্য", desc: "জমির পরিমাণ ও অবস্থান যোগ করুন।" },
      { icon: Languages, title: "দ্বিভাষিক UI", desc: "বাংলা ও English এক ক্লিকে পরিবর্তন।" },
      { icon: Lock, title: "ডেটা সুরক্ষা", desc: "Row Level Security দিয়ে protected।" },
    ],
    gradient: "from-purple-500/25 via-violet-500/20 to-fuchsia-500/10",
    icon: User,
  },
  // 6. Marketplace - how it works
  {
    kicker: "ফিচার ৩",
    title: "মার্কেটপ্লেস — কীভাবে কাজ করে",
    bullets: [
      { icon: Camera, title: "ফসল লিস্ট করুন", desc: "ছবি, পরিমাণ ও দাম দিয়ে পোস্ট করুন।" },
      { icon: Search, title: "ক্রেতা খুঁজুন", desc: "ক্যাটাগরি ও এলাকা ভিত্তিক সার্চ।" },
      { icon: MessageCircle, title: "চ্যাটে দরদাম", desc: "ইন-অ্যাপ চ্যাটে সরাসরি কথা বলুন।" },
      { icon: Bell, title: "তাৎক্ষণিক নোটিফিকেশন", desc: "নতুন অফার সাথে সাথে জানুন।" },
    ],
    gradient: "from-amber-500/25 via-yellow-500/20 to-orange-500/10",
    icon: ShoppingBag,
  },
  // 7. Machine rental
  {
    kicker: "ফিচার ৪",
    title: "যন্ত্র ভাড়া — কীভাবে কাজ করে",
    bullets: [
      { icon: Tractor, title: "যন্ত্র ব্রাউজ", desc: "ট্রাক্টর, পাওয়ার টিলার, হারভেস্টার লিস্ট।" },
      { icon: FileText, title: "বিস্তারিত দেখুন", desc: "ছবি, রেট, মালিকের তথ্য।" },
      { icon: HeartHandshake, title: "ভাড়ার অনুরোধ", desc: "এক ক্লিকে মালিকের কাছে রিকোয়েস্ট।" },
      { icon: Bell, title: "কনফার্মেশন", desc: "অনুমোদন হলে নোটিফিকেশন পাবেন।" },
    ],
    gradient: "from-orange-500/25 via-amber-500/20 to-yellow-500/10",
    icon: Tractor,
  },
  // 8. Krishi Bondhu (advice)
  {
    kicker: "ফিচার ৫",
    title: "কৃষি বন্ধু — পরামর্শ ও রোগবালাই",
    bullets: [
      { icon: Leaf, title: "রোগবালাই গাইড", desc: "ফসল অনুযায়ী লক্ষণ ও প্রতিকার।" },
      { icon: MessageCircle, title: "প্রশ্ন করুন", desc: "নিজের সমস্যা লিখে বিশেষজ্ঞ পরামর্শ।" },
      { icon: BookOpen, title: "চাষাবাদ টিপস", desc: "মৌসুম অনুযায়ী গাইডলাইন।" },
    ],
    gradient: "from-green-500/25 via-emerald-500/20 to-teal-500/10",
    icon: Leaf,
  },
  // 9. Schemes
  {
    kicker: "ফিচার ৬",
    title: "সরকারি স্কিম ও ভর্তুকি",
    bullets: [
      { icon: FileText, title: "স্কিম লিস্ট", desc: "চলমান সরকারি প্রকল্প এক জায়গায়।" },
      { icon: CheckCircle2, title: "যোগ্যতা চেক", desc: "কে কোন স্কিমে আবেদন করতে পারবেন।" },
      { icon: Globe, title: "আপডেটেড তথ্য", desc: "নতুন প্রকল্পের তাৎক্ষণিক নোটিফিকেশন।" },
    ],
    gradient: "from-teal-500/25 via-cyan-500/20 to-emerald-500/10",
    icon: FileText,
  },
  // 10. Helpline
  {
    kicker: "ফিচার ৭",
    title: "হেল্পলাইন চ্যাটবট",
    bullets: [
      { icon: MessageCircle, title: "চ্যাটবট সাপোর্ট", desc: "নাম, ফোন, লোকেশন ও সমস্যা জমা দিন।" },
      { icon: Phone, title: "২৪/৭ অ্যাকসেস", desc: "যেকোনো সময় সমস্যা পাঠান।" },
      { icon: Bell, title: "রিপ্লাই নোটিফিকেশন", desc: "Admin উত্তর দিলে সঙ্গে সঙ্গে notification।" },
    ],
    gradient: "from-pink-500/25 via-rose-500/20 to-red-500/10",
    icon: MessageCircle,
  },
  // 11. Notifications
  {
    kicker: "ফিচার ৮",
    title: "নোটিফিকেশন সিস্টেম",
    bullets: [
      { icon: Bell, title: "রিয়েল-টাইম", desc: "অর্ডার, মেসেজ ও রিপ্লাই সঙ্গে সঙ্গে।" },
      { icon: ShoppingBag, title: "মার্কেট আপডেট", desc: "ক্রেতার আগ্রহ ও মেসেজ।" },
      { icon: Tractor, title: "যন্ত্র বুকিং", desc: "ভাড়ার অনুরোধ ও কনফার্মেশন।" },
    ],
    gradient: "from-indigo-500/25 via-blue-500/20 to-sky-500/10",
    icon: Bell,
  },
  // 12. Who benefits
  {
    kicker: "কাদের উপকার?",
    title: "কে কীভাবে লাভবান হবেন?",
    bullets: [
      { icon: Sprout, title: "কৃষক", desc: "ন্যায্য দাম, সহজ যন্ত্র, দ্রুত পরামর্শ।" },
      { icon: ShoppingBag, title: "ক্রেতা / ব্যবসায়ী", desc: "সরাসরি কৃষকের কাছ থেকে তাজা পণ্য।" },
      { icon: Users, title: "যন্ত্র মালিক", desc: "অলস যন্ত্র ভাড়া দিয়ে অতিরিক্ত আয়।" },
      { icon: TrendingUp, title: "অর্থনীতি", desc: "গ্রামীণ অর্থনীতিতে ডিজিটাল রূপান্তর।" },
    ],
    gradient: "from-emerald-500/25 via-teal-500/20 to-cyan-500/10",
    icon: HeartHandshake,
  },
  // 13. Tech stack - Frontend
  {
    kicker: "টেকনোলজি ১",
    title: "Frontend Technologies",
    bullets: [
      { icon: Code2, title: "React 19 + TypeScript", desc: "Type-safe, modern UI framework।" },
      { icon: Zap, title: "TanStack Start + Vite 7", desc: "SSR/SSG, file-based routing।" },
      { icon: Sparkles, title: "Tailwind CSS v4", desc: "Utility-first styling ও design tokens।" },
      { icon: Package, title: "shadcn/ui + Lucide", desc: "Accessible UI components ও icons।" },
    ],
    gradient: "from-sky-500/25 via-blue-500/20 to-indigo-500/10",
    icon: Code2,
  },
  // 14. Tech stack - Backend
  {
    kicker: "টেকনোলজি ২",
    title: "Backend & Database",
    bullets: [
      { icon: Database, title: "Lovable Cloud (Supabase)", desc: "PostgreSQL database ও auth।" },
      { icon: Lock, title: "Row Level Security", desc: "প্রতিটি row-এ permission নিয়ন্ত্রণ।" },
      { icon: Server, title: "Server Functions", desc: "TanStack createServerFn দিয়ে API।" },
      { icon: Cloud, title: "Edge Functions", desc: "Webhook ও public API endpoint।" },
    ],
    gradient: "from-purple-500/25 via-violet-500/20 to-indigo-500/10",
    icon: Database,
  },
  // 15. Tech stack - Integrations
  {
    kicker: "টেকনোলজি ৩",
    title: "Integrations & Tools",
    bullets: [
      { icon: LogIn, title: "Google OAuth", desc: "Social login integration।" },
      { icon: Bell, title: "Realtime Subscriptions", desc: "Supabase Realtime দিয়ে live update।" },
      { icon: Camera, title: "Storage Buckets", desc: "ছবি ও ফাইল আপলোড।" },
      { icon: GitBranch, title: "Git Version Control", desc: "Lovable platform-এ auto-sync।" },
    ],
    gradient: "from-teal-500/25 via-emerald-500/20 to-green-500/10",
    icon: Cpu,
  },
  // 16. Architecture
  {
    kicker: "আর্কিটেকচার",
    title: "অ্যাপ কীভাবে কাজ করে",
    bullets: [
      { icon: Smartphone, title: "Client (Browser)", desc: "React UI, routing, state management।" },
      { icon: Server, title: "Server Functions", desc: "Business logic, validation, auth check।" },
      { icon: Database, title: "PostgreSQL DB", desc: "User, listings, machines, messages store।" },
      { icon: Bell, title: "Realtime Channel", desc: "Live notifications push করে।" },
    ],
    gradient: "from-fuchsia-500/25 via-purple-500/20 to-violet-500/10",
    icon: Wrench,
  },
  // 17. Security
  {
    kicker: "নিরাপত্তা",
    title: "Security ও Data Protection",
    bullets: [
      { icon: Lock, title: "RLS Policies", desc: "প্রতিটি table-এ access control।" },
      { icon: ShieldCheck, title: "Auth Middleware", desc: "Protected route ও server function।" },
      { icon: Users, title: "User Roles Table", desc: "Admin, farmer, buyer আলাদা role।" },
      { icon: Lock, title: "HTTPS Encryption", desc: "সব ডেটা এনক্রিপটেড transfer।" },
    ],
    gradient: "from-red-500/25 via-rose-500/20 to-pink-500/10",
    icon: ShieldCheck,
  },
  // 18. Going live - steps
  {
    kicker: "লাইভ করার ধাপ",
    title: "অ্যাপ লাইভ করতে যা যা দরকার",
    bullets: [
      { icon: CheckCircle2, title: "১. Testing", desc: "সব ফিচার লোকাল ও preview-এ পরীক্ষা।" },
      { icon: ShieldCheck, title: "২. Security Audit", desc: "RLS policy ও secret key check।" },
      { icon: FileText, title: "৩. Content & SEO", desc: "Title, meta description, favicon।" },
      { icon: Rocket, title: "৪. Publish", desc: "Lovable Publish button → live URL।" },
    ],
    gradient: "from-orange-500/25 via-amber-500/20 to-yellow-500/10",
    icon: Rocket,
  },
  // 19. Going live - infra
  {
    kicker: "ইনফ্রাস্ট্রাকচার",
    title: "Production-এ যা যা দরকার",
    bullets: [
      { icon: Globe, title: "Custom Domain", desc: "নিজস্ব ডোমেইন কিনে DNS configure।" },
      { icon: Database, title: "Database Backup", desc: "Daily auto-backup চালু রাখুন।" },
      { icon: CreditCard, title: "Payment Gateway", desc: "bKash / Nagad / Stripe integration।" },
      { icon: Phone, title: "SMS / Email Service", desc: "OTP ও নোটিফিকেশনের জন্য।" },
    ],
    gradient: "from-blue-500/25 via-sky-500/20 to-cyan-500/10",
    icon: Cloud,
  },
  // 20. Future roadmap
  {
    kicker: "ভবিষ্যৎ পরিকল্পনা",
    title: "Roadmap — পরবর্তী ফিচার",
    bullets: [
      { icon: Smartphone, title: "Mobile App", desc: "Android ও iOS native app।" },
      { icon: Sparkles, title: "AI পরামর্শ", desc: "ছবি দেখে রোগ নির্ণয়।" },
      { icon: CreditCard, title: "ডিজিটাল পেমেন্ট", desc: "ইন-অ্যাপ লেনদেন।" },
      { icon: TrendingUp, title: "মার্কেট অ্যানালিটিক্স", desc: "দামের পূর্বাভাস ও trend।" },
    ],
    gradient: "from-violet-500/25 via-fuchsia-500/20 to-pink-500/10",
    icon: TrendingUp,
  },
  // 21. CTA
  {
    kicker: "শুরু করুন",
    title: "আজই কৃষি বন্ধু-এর সাথে যুক্ত হন",
    body: "একটি অ্যাকাউন্ট তৈরি করুন এবং স্মার্ট কৃষির যাত্রা শুরু করুন।",
    gradient: "from-primary/30 via-emerald-500/20 to-teal-500/10",
    icon: Sparkles,
  },
];

function slideToSpeech(s: Slide): string {
  const parts: string[] = [s.kicker, s.title];
  if (s.body) parts.push(s.body);
  if (s.bullets) s.bullets.forEach((b) => parts.push(`${b.title}। ${b.desc}`));
  return parts.join("। ");
}

function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const bn = voices.filter((v) => v.lang?.toLowerCase().startsWith("bn"));
  const hi = voices.filter((v) => v.lang?.toLowerCase().startsWith("hi"));
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = bn.length ? bn : hi.length ? hi : en;
  const female = pool.find((v) => /female|woman|zira|samantha|google|priya|veena|rishi/i.test(v.name));
  return female || pool[0] || voices[0];
}

function PresentationPage() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const total = slides.length;
  const s = slides[i];
  const Icon = s.icon;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(total - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Speak current slide with female voice; auto-advance when speech ends
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    if (!playing) return;

    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      const voices = synth.getVoices();
      const u = new SpeechSynthesisUtterance(slideToSpeech(s));
      const v = pickFemaleVoice(voices);
      if (v) u.voice = v;
      u.lang = v?.lang || "bn-BD";
      u.rate = 0.95;
      u.pitch = 1.15;
      u.onend = () => {
        if (cancelled) return;
        setI((idx) => (idx + 1) % total);
      };
      synth.speak(u);
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => { synth.onvoiceschanged = null; speak(); };
      setTimeout(speak, 400);
    } else {
      speak();
    }

    return () => {
      cancelled = true;
      synth.cancel();
    };
  }, [i, playing, total, s]);

  // Stop speech when leaving the page
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progress = ((i + 1) / total) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-bangla">
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.gradient} transition-all duration-700`}
      />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, var(--primary-glow) 0%, transparent 70%)" }}
      />

      <div className="fixed left-0 right-0 top-0 z-30 h-1 bg-border/40">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold">কৃষি বন্ধু</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "থামান" : "চালান"}
          </button>
          <Link
            to="/auth"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" /> বন্ধ
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-4xl items-center px-4 py-6 sm:px-8">
        <div
          key={i}
          className="w-full animate-fade-in rounded-3xl border border-border bg-card/85 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-12"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              {s.kicker} · {i + 1}/{total}
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold leading-tight text-foreground sm:text-4xl">
            {s.title}
          </h1>
          {s.body && (
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">{s.body}</p>
          )}

          {s.bullets && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {s.bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  style={{ animation: `fade-in 0.4s ease-out ${idx * 90}ms backwards` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground sm:text-base">{b.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {i === total - 1 && (
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition"
            >
              <Home className="h-4 w-4" /> অ্যাকাউন্ট তৈরি / লগইন
            </Link>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => { setPlaying(false); setI((v) => Math.max(0, v - 1)); }}
            disabled={i === 0}
            className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> পূর্ববর্তী
          </button>

          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setPlaying(false); setI(idx); }}
                className={`h-1.5 shrink-0 rounded-full transition-all ${idx === i ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => { setPlaying(false); setI((v) => Math.min(total - 1, v + 1)); }}
            disabled={i === total - 1}
            className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
          >
            পরবর্তী <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
