import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Sprout, Newspaper, TrendingUp, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const dashboardData = queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const [tipsRes, pricesRes, profileRes] = await Promise.all([
      supabase.from("tips").select("*").order("created_at", { ascending: false }).limit(3),
      supabase.from("market_prices").select("*").order("price_date", { ascending: false }).limit(4),
      supabase.auth.getUser().then(({ data }) =>
        data.user ? supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle() : null
      ),
    ]);
    return {
      tips: tipsRes.data ?? [],
      prices: pricesRes.data ?? [],
      name: profileRes?.data?.full_name ?? "",
    };
  },
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Krishi Bondhu" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardData),
  component: () => (
    <AppShell>
      <Suspense fallback={null}><DashboardInner /></Suspense>
    </AppShell>
  ),
});

function DashboardInner() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(dashboardData);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--saffron)] opacity-30 blur-2xl" />
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{t("welcome")}</p>
        <h1 className={`mt-1 text-2xl font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{data.name || "কৃষক বন্ধু"} 🌾</h1>
        <p className={`mt-1 text-sm opacity-90 ${lang === "bn" ? "font-bangla" : ""}`}>{t("tagline")}</p>
      </section>

      <section>
        <h2 className={`mb-3 text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("quickActions")}</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickCard to="/schemes" icon={Sprout} title={t("govSchemes")} tint="primary" />
          <QuickCard to="/tips" icon={Newspaper} title={t("farmingTips")} tint="saffron" />
          <QuickCard to="/market" icon={TrendingUp} title={t("marketPrices")} tint="earth" />
        </div>
      </section>

      <section>
        <Header title={t("latestTips")} to="/tips" />
        <div className="space-y-2.5">
          {data.tips.map((tip) => (
            <Link key={tip.id} to="/tips" className="block rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">{tip.category}</span>
              <h3 className={`mt-1.5 text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.title_bn : tip.title_en}</h3>
              <p className={`mt-1 line-clamp-2 text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.content_bn : tip.content_en}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Header title={t("todayPrices")} to="/market" />
        <div className="grid grid-cols-2 gap-2.5">
          {data.prices.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-3">
              <div className={`text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? p.crop_bn : p.crop_en}</div>
              <div className="text-[11px] text-muted-foreground">{lang === "bn" ? p.market_bn : p.market_en}</div>
              <div className="mt-1.5 text-base font-extrabold text-primary">₹{p.price_min}–{p.price_max}</div>
              <div className="text-[10px] text-muted-foreground">/ {p.unit}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({ title, to }: { title: string; to: string }) {
  const { t, lang } = useLang();
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className={`text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
        {t("viewAll")} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, tint }: { to: string; icon: React.ElementType; title: string; tint: "primary" | "saffron" | "earth" }) {
  const { lang } = useLang();
  const tintBg = tint === "primary" ? "bg-primary/10 text-primary" : tint === "saffron" ? "bg-[color:var(--saffron)]/20 text-[color:var(--saffron-foreground)]" : "bg-[color:var(--earth)]/15 text-[color:var(--earth)]";
  return (
    <Link to={to} className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tintBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className={`text-xs font-semibold leading-tight text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{title}</div>
    </Link>
  );
}
