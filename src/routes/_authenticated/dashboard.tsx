import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { Sprout, Newspaper, TrendingUp, Tractor, ShoppingBag, AlertTriangle, CloudSun, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LiveClock } from "@/components/LiveClock";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";


const dashboardData = queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const [pricesRes, profileRes] = await Promise.all([
      supabase.from("market_prices").select("*").order("price_date", { ascending: false }).limit(5),
      supabase.auth.getUser().then(({ data }) =>
        data.user ? supabase.from("profiles").select("full_name,district").eq("id", data.user.id).maybeSingle() : null
      ),
    ]);
    return {
      prices: pricesRes.data ?? [],
      name: profileRes?.data?.full_name ?? "",
      district: profileRes?.data?.district ?? "বাংলাদেশ",
    };
  },
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "হোম — কৃষি বন্ধু" }] }),
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
    <div className="space-y-5">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--saffron)] opacity-30 blur-2xl" />
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{t("welcome")}</p>
        <h1 className={`mt-1 text-2xl font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{data.name || (lang === "bn" ? "কৃষক বন্ধু" : "Farmer")} 🌾</h1>
        <p className={`mt-1 text-sm opacity-90 ${lang === "bn" ? "font-bangla" : ""}`}>{t("tagline")}</p>
      </section>

      {/* Urgent Notice */}
      <section className="rounded-2xl border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 p-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--saffron)] text-[color:var(--saffron-foreground)]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className={`text-xs font-bold uppercase tracking-wider text-[color:var(--saffron-foreground)] ${lang === "bn" ? "font-bangla" : ""}`}>{t("urgentNotice")}</div>
            <div className="mt-0.5 overflow-hidden">
              <span className={`marquee-track text-sm text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("noticeBody")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Weather with live clock */}
      <section className="space-y-2 rounded-2xl border border-border bg-[image:var(--gradient-card)] p-4 shadow-[var(--shadow-soft)]">
        <LiveClock />
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("weatherInfo")}</div>
            <div className={`mt-0.5 text-base font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{data.district}</div>
            <div className={`text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>আংশিক মেঘলা · বৃষ্টির সম্ভাবনা ৪০%</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-[color:var(--saffron-foreground)]">
              <CloudSun className="h-8 w-8 text-[color:var(--saffron)]" />
              <span className="text-3xl font-extrabold text-foreground">৩১°</span>
            </div>
            <div className="text-[10px] text-muted-foreground">আজ · সর্বনিম্ন ২৬°</div>
          </div>
        </div>
      </section>

      {/* Today market — preview, click arrow to see all */}
      <section>
        <SectionHeader title={t("todayMarket")} to="/market" />
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {data.prices.map((p) => (
            <Link key={p.id} to="/market" className="w-36 shrink-0 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
              <div className={`text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? p.crop_bn : p.crop_en}</div>
              <div className="text-[11px] text-muted-foreground">{lang === "bn" ? p.market_bn : p.market_en}</div>
              <div className="mt-1.5 text-base font-extrabold text-primary">৳{p.price_min}–{p.price_max}</div>
              <div className="text-[10px] text-muted-foreground">{p.unit === "kg" ? t("perKg") : t("perQuintal")}</div>
            </Link>
          ))}
        </div>
      </section>


      {/* Quick Access */}
      <section>
        <h2 className={`mb-3 text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("quickAccess")}</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickCard to="/schemes" icon={Sprout} title={t("govSchemes")} tint="primary" />
          <QuickCard to="/krishi-bondhu" icon={Newspaper} title={t("farmingTips")} tint="saffron" />
          <QuickCard to="/market" icon={TrendingUp} title={t("marketPrices")} tint="earth" />
          <QuickCard to="/machines" icon={Tractor} title={t("machineBooking")} tint="primary" />
          <QuickCard to="/sell" icon={ShoppingBag} title={t("cropSelling")} tint="saffron" />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  const { t, lang } = useLang();
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className={`text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{title}</h2>
      <Link to={to} className={`inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20 ${lang === "bn" ? "font-bangla" : ""}`}>
        {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
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
