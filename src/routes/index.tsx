import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ArrowRight, ShieldCheck, TrendingUp, Newspaper } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishi Bondhu — কৃষকের পাশে সরকারি সাহায্য" },
      { name: "description", content: "All-in-one mobile app for Indian farmers: government schemes, market prices, and farming tips in Bangla and English." },
      { property: "og:title", content: "Krishi Bondhu" },
      { property: "og:description", content: "Government schemes, market prices and farming tips — beside every farmer." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/auth" className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90">
            {t("login")}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-8 md:grid-cols-2 md:py-16">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sprout className="h-3.5 w-3.5" /> {t("tagline")}
          </span>
          <h1 className={`text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl ${lang === "bn" ? "font-bangla" : ""}`}>
            {t("heroTitle")}
          </h1>
          <p className={`text-base text-muted-foreground md:text-lg ${lang === "bn" ? "font-bangla" : ""}`}>
            {t("heroSub")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-hero)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:-translate-y-0.5"
            >
              {t("getStarted")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
            >
              {t("login")}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: ShieldCheck, label: t("govSchemes") },
              { icon: TrendingUp, label: t("marketPrices") },
              { icon: Newspaper, label: t("farmingTips") },
            ].map((it, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3 text-center">
                <it.icon className="mx-auto h-5 w-5 text-primary" />
                <div className={`mt-1.5 text-[11px] font-semibold leading-tight text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{it.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-[image:var(--gradient-saffron)] opacity-30 blur-2xl" />
          <img
            src={heroImg}
            alt="Bengali farmer with smartphone in paddy field"
            className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[var(--shadow-elevated)]"
          />
        </div>
      </section>

      <footer className="mx-auto max-w-5xl border-t border-border/60 px-5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("appName")}
      </footer>
    </div>
  );
}
