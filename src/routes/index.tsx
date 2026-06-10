import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout, ArrowRight, ShieldCheck, TrendingUp, Newspaper,
  AlertTriangle, Users, MapPin, Wheat, Lightbulb,
  CheckCircle2, UserPlus, Settings2, HandHeart, Languages, PlayCircle,
} from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { useLang, dict } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishi Bondhu — কৃষকের পাশে সরকারি সাহায্য" },
      { name: "description", content: "All-in-one app for farmers: government schemes (PM-Kisan, KCC), daily market prices and expert crop tips in Bangla and English." },
      { property: "og:title", content: "Krishi Bondhu" },
      { property: "og:description", content: "Government schemes, market prices and farming tips — beside every farmer." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang } = useLang();
  const bn = lang === "bn" ? "font-bangla" : "";

  const problems: Array<{ icon: typeof AlertTriangle; key: keyof typeof dict; desc: keyof typeof dict }> = [
    { icon: ShieldCheck, key: "problem1", desc: "problem1Desc" },
    { icon: TrendingUp, key: "problem2", desc: "problem2Desc" },
    { icon: Lightbulb, key: "problem3", desc: "problem3Desc" },
    { icon: Languages, key: "problem4", desc: "problem4Desc" },
  ];
  const features: Array<{ icon: typeof ShieldCheck; key: keyof typeof dict; desc: keyof typeof dict }> = [
    { icon: ShieldCheck, key: "feature1Title", desc: "feature1Desc" },
    { icon: TrendingUp, key: "feature2Title", desc: "feature2Desc" },
    { icon: Newspaper, key: "feature3Title", desc: "feature3Desc" },
    { icon: Languages, key: "feature4Title", desc: "feature4Desc" },
  ];
  const steps: Array<{ icon: typeof UserPlus; key: keyof typeof dict; desc: keyof typeof dict }> = [
    { icon: UserPlus, key: "step1Title", desc: "step1Desc" },
    { icon: Settings2, key: "step2Title", desc: "step2Desc" },
    { icon: HandHeart, key: "step3Title", desc: "step3Desc" },
  ];
  const stats: Array<{ icon: typeof ShieldCheck; value: string; key: keyof typeof dict }> = [
    { icon: ShieldCheck, value: "50+", key: "statSchemes" },
    { icon: MapPin, value: "23", key: "statDistricts" },
    { icon: Wheat, value: "100+", key: "statCrops" },
    { icon: Newspaper, value: "200+", key: "statTips" },
  ];
  const faqs: Array<{ q: keyof typeof dict; a: keyof typeof dict }> = [
    { q: "faq1Q", a: "faq1A" },
    { q: "faq2Q", a: "faq2A" },
    { q: "faq3Q", a: "faq3A" },
    { q: "faq4Q", a: "faq4A" },
    { q: "faq5Q", a: "faq5A" },
    { q: "faq6Q", a: "faq6A" },
    { q: "faq7Q", a: "faq7A" },
    { q: "faq8Q", a: "faq8A" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className={`text-base font-bold tracking-tight ${bn}`}>{t("appName")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link to="/presentation" className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 ${bn}`}>
              <PlayCircle className="h-3.5 w-3.5" />
              {lang === "bn" ? "প্রেজেন্টেশন" : "Presentation"}
            </Link>
            <Link to="/auth" className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90">
              {t("login")}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <span className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary ${bn}`}>
            <Sprout className="h-3.5 w-3.5" /> {t("tagline")}
          </span>
          <h1 className={`text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl ${bn}`}>
            {t("heroTitle")}
          </h1>
          <p className={`text-base text-muted-foreground md:text-lg ${bn}`}>{t("heroSub")}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth" className={`inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-hero)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:-translate-y-0.5 ${bn}`}>
              {t("getStarted")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/auth" className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent ${bn}`}>
              {t("login")}
            </Link>
            <Link to="/presentation" className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 ${bn}`}>
              <PlayCircle className="h-4 w-4" />
              {lang === "bn" ? "অ্যাপ পরিচিতি দেখুন" : "View Presentation"}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[{ icon: ShieldCheck, label: t("govSchemes") }, { icon: TrendingUp, label: t("marketPrices") }, { icon: Newspaper, label: t("farmingTips") }].map((it, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3 text-center">
                <it.icon className="mx-auto h-5 w-5 text-primary" />
                <div className={`mt-1.5 text-[11px] font-semibold leading-tight text-foreground ${bn}`}>{it.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-[image:var(--gradient-saffron)] opacity-30 blur-2xl" />
          <img src={heroImg} alt="Bengali farmer with smartphone in paddy field" className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[var(--shadow-elevated)]" />
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-8 md:grid-cols-4 md:py-10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <s.icon className="mb-2 h-6 w-6 text-primary" />
              <div className="text-2xl font-extrabold text-foreground md:text-3xl">{s.value}</div>
              <div className={`mt-0.5 text-xs text-muted-foreground ${bn}`}>{t(s.key)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 text-xs font-semibold text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> {t("problemsTitle")}
          </span>
          <h2 className={`mt-4 text-3xl font-bold text-foreground md:text-4xl ${bn}`}>{t("problemsTitle")}</h2>
          <p className={`mt-2 text-sm text-muted-foreground md:text-base ${bn}`}>{t("problemsSub")}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {problems.map((p, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className={`text-base font-semibold text-foreground ${bn}`}>{t(p.key)}</h3>
                <p className={`mt-1 text-sm text-muted-foreground ${bn}`}>{t(p.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card/40 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> {t("solutionsTitle")}
            </span>
            <h2 className={`mt-4 text-3xl font-bold text-foreground md:text-4xl ${bn}`}>{t("solutionsTitle")}</h2>
            <p className={`mt-2 text-sm text-muted-foreground md:text-base ${bn}`}>{t("solutionsSub")}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className={`mt-4 text-lg font-bold text-foreground ${bn}`}>{t(f.key)}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed text-muted-foreground ${bn}`}>{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-3xl font-bold text-foreground md:text-4xl ${bn}`}>{t("howTitle")}</h2>
          <p className={`mt-2 text-sm text-muted-foreground md:text-base ${bn}`}>{t("howSub")}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-2xl border border-border bg-card p-6 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-0.5 text-xs font-bold text-background">{i + 1}</div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className={`mt-4 text-lg font-bold text-foreground ${bn}`}>{t(s.key)}</h3>
              <p className={`mt-1.5 text-sm text-muted-foreground ${bn}`}>{t(s.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card/40 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <h2 className={`text-3xl font-bold text-foreground md:text-4xl ${bn}`}>{t("faqTitle")}</h2>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={t(f.q)} a={t(f.a)} bn={bn} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] p-8 text-center shadow-[var(--shadow-elevated)] md:p-14">
          <Users className="absolute -right-6 -top-6 h-32 w-32 text-primary-foreground/10" />
          <Sprout className="absolute -bottom-6 -left-6 h-32 w-32 text-primary-foreground/10" />
          <h2 className={`relative text-2xl font-extrabold text-primary-foreground md:text-4xl ${bn}`}>{t("ctaTitle")}</h2>
          <p className={`relative mt-3 text-sm text-primary-foreground/90 md:text-base ${bn}`}>{t("ctaSub")}</p>
          <Link to="/auth" className={`relative mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-foreground shadow-lg transition hover:-translate-y-0.5 ${bn}`}>
            {t("ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className={`mx-auto max-w-6xl px-5 py-6 text-center text-xs text-muted-foreground ${bn}`}>
          © {new Date().getFullYear()} {t("appName")} — {t("tagline")}
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a, bn }: { q: string; a: string; bn: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <button onClick={() => setOpen((v) => !v)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left ${bn}`}>
        <span className="text-sm font-semibold text-foreground md:text-base">{q}</span>
        <span className={`text-primary transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className={`border-t border-border/60 px-5 py-4 text-sm text-muted-foreground ${bn}`}>{a}</div>}
    </div>
  );
}
