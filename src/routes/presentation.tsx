import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sprout, ChevronLeft, ChevronRight, Tractor, ShoppingBag, Leaf,
  Bell, MessageCircle, User, ShieldCheck, Users, Sparkles, Home, X,
} from "lucide-react";

export const Route = createFileRoute("/presentation")({
  head: () => ({ meta: [{ title: "App Presentation — Krishi Bondhu" }] }),
  component: PresentationPage,
});

type Slide = {
  kicker: string;
  title: string;
  body?: string;
  bullets?: { icon: React.ElementType; title: string; desc: string }[];
  gradient?: string;
};

const slides: Slide[] = [
  {
    kicker: "কৃষি বন্ধু",
    title: "বাংলাদেশের কৃষকদের জন্য একটি সম্পূর্ণ ডিজিটাল প্ল্যাটফর্ম",
    body: "ফসল বিক্রি, যন্ত্র ভাড়া, রোগবালাই সমাধান এবং সরকারি সহায়তা—সব এক অ্যাপে।",
  },
  {
    kicker: "সমস্যা",
    title: "কৃষকরা কেন এই অ্যাপের প্রয়োজন বোধ করেন?",
    bullets: [
      { icon: ShoppingBag, title: "মধ্যস্বত্বভোগীর চাপ", desc: "ন্যায্য দামে ফসল বিক্রির সুযোগ কম।" },
      { icon: Tractor, title: "যন্ত্রের অভাব", desc: "সময়মতো যন্ত্র ভাড়া পাওয়া কঠিন।" },
      { icon: Leaf, title: "রোগবালাইয়ে ক্ষতি", desc: "দ্রুত সঠিক পরামর্শ পাওয়া যায় না।" },
    ],
  },
  {
    kicker: "মূল ফিচার ১",
    title: "ফসল বিক্রি (Marketplace)",
    bullets: [
      { icon: ShoppingBag, title: "সরাসরি ক্রেতা", desc: "ফসল লিস্ট করে সরাসরি ক্রেতার সাথে যোগাযোগ।" },
      { icon: MessageCircle, title: "ইন-অ্যাপ চ্যাট", desc: "ফোন/SMS ছাড়াই দরদাম ও যোগাযোগ।" },
      { icon: Bell, title: "তাৎক্ষণিক নোটিফিকেশন", desc: "ক্রেতা আগ্রহ দেখালে সাথে সাথে জানতে পারবেন।" },
    ],
  },
  {
    kicker: "মূল ফিচার ২",
    title: "যন্ত্র ভাড়া",
    bullets: [
      { icon: Tractor, title: "যন্ত্রের তালিকা", desc: "ট্রাক্টর, ধান কাটার মেশিনসহ সব যন্ত্র ফিল্টার করে দেখুন।" },
      { icon: User, title: "মালিকের প্রোফাইল", desc: "যন্ত্রের বিস্তারিত ও মালিকের তথ্য দেখে সিদ্ধান্ত নিন।" },
      { icon: Bell, title: "ভাড়ার অনুরোধ", desc: "এক ক্লিকেই মালিককে নোটিফিকেশন পাঠান।" },
    ],
  },
  {
    kicker: "মূল ফিচার ৩",
    title: "কৃষি বন্ধু — পরামর্শ ও রোগবালাই",
    bullets: [
      { icon: Leaf, title: "রোগবালাই গাইড", desc: "সাধারণ রোগের লক্ষণ ও প্রতিকার লিস্টেড।" },
      { icon: MessageCircle, title: "প্রশ্ন করুন", desc: "নিজের সমস্যা লিখে বিশেষজ্ঞ পরামর্শ নিন।" },
      { icon: Sparkles, title: "সরকারি স্কিম", desc: "সর্বশেষ কৃষি সহায়তা ও প্রকল্পের তথ্য।" },
    ],
  },
  {
    kicker: "মূল ফিচার ৪",
    title: "হেল্পলাইন চ্যাটবট ও নোটিফিকেশন",
    bullets: [
      { icon: MessageCircle, title: "২৪/৭ সাপোর্ট", desc: "অ্যাপের ভিতরেই সমস্যা জমা দিন।" },
      { icon: Bell, title: "রিপ্লাই নোটিফিকেশন", desc: "সাপোর্ট টিমের উত্তর সরাসরি নোটিফিকেশনে।" },
      { icon: ShieldCheck, title: "নিরাপদ প্রোফাইল", desc: "NID ও জমির তথ্য সুরক্ষিতভাবে সংরক্ষণ।" },
    ],
  },
  {
    kicker: "কাদের উপকার?",
    title: "এই অ্যাপ থেকে কে কীভাবে লাভবান হবেন?",
    bullets: [
      { icon: Sprout, title: "কৃষক", desc: "ন্যায্য দাম, কম খরচে যন্ত্র, দ্রুত পরামর্শ।" },
      { icon: ShoppingBag, title: "ক্রেতা/ব্যবসায়ী", desc: "সরাসরি কৃষকের কাছ থেকে তাজা ফসল।" },
      { icon: Users, title: "যন্ত্র মালিক", desc: "নিজের যন্ত্র ভাড়া দিয়ে অতিরিক্ত আয়।" },
    ],
  },
  {
    kicker: "শুরু করুন",
    title: "আজই কৃষি বন্ধু-এর সাথে যুক্ত হন",
    body: "একটি অ্যাকাউন্ট তৈরি করুন এবং স্মার্ট কৃষির যাত্রা শুরু করুন।",
  },
];

function PresentationPage() {
  const [i, setI] = useState(0);
  const total = slides.length;
  const s = slides[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(total - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-bangla">
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, var(--primary-glow) 0%, transparent 65%)" }}
      />

      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold">কৃষি বন্ধু</span>
        </Link>
        <Link
          to="/auth"
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" /> বন্ধ করুন
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-3xl items-center px-4 py-6 sm:px-8">
        <div className="w-full rounded-3xl border border-border bg-card/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur sm:p-10">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">{s.kicker}</div>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-4xl">{s.title}</h1>
          {s.body && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{s.body}</p>}

          {s.bullets && (
            <div className="mt-6 grid gap-3 sm:grid-cols-1">
              {s.bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
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
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> পূর্ববর্তী
          </button>

          <div className="flex flex-1 items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setI((v) => Math.min(total - 1, v + 1))}
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
