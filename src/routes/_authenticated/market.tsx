import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { TrendingUp, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const pricesQuery = queryOptions({
  queryKey: ["prices"],
  queryFn: async () => {
    const { data, error } = await supabase.from("market_prices").select("*").order("price_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/_authenticated/market")({
  head: () => ({ meta: [{ title: "বাজার দর — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
  component: () => <AppShell title="বাজার দর" showBack><Suspense fallback={null}><MarketPage /></Suspense></AppShell>,
});

function MarketPage() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(pricesQuery);
  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("marketPrices")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>বাংলাদেশের জেলা ভিত্তিক আজকের দর</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.map((p) => (
          <div key={p.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="absolute right-3 top-3 text-[color:var(--saffron)]"><TrendingUp className="h-4 w-4" /></div>
            <div className={`text-base font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? p.crop_bn : p.crop_en}</div>
            <div className={`mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
              <MapPin className="h-3 w-3" /> {lang === "bn" ? p.market_bn : p.market_en}
            </div>
            <div className="mt-3 text-2xl font-extrabold text-primary">৳{p.price_min}<span className="text-sm text-muted-foreground">–{p.price_max}</span></div>
            <div className={`text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{p.unit === "kg" ? t("perKg") : t("perQuintal")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
