import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { ShoppingBag, MapPin, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const buyersQuery = queryOptions({
  queryKey: ["buyers"],
  queryFn: async () => {
    const { data, error } = await supabase.from("buyers").select("*").order("verified", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/_authenticated/sell")({
  head: () => ({ meta: [{ title: "ফসল বিক্রি — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(buyersQuery),
  component: () => <AppShell><Suspense fallback={null}><Page /></Suspense></AppShell>,
});

function Page() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(buyersQuery);

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("cropSelling")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>সরাসরি ক্রেতার সাথে যোগাযোগ ও দরদাম</p>
      </div>
      <div className="space-y-3">
        {data.map((b) => (
          <Link key={b.id} to="/sell/$buyerId" params={{ buyerId: b.id }} className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--saffron)]/20 text-[color:var(--saffron-foreground)]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className={`truncate text-base font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? b.name_bn : b.name_en}</h3>
                  {b.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                </div>
                <div className={`flex items-center gap-2 text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                  <span>{b.buyer_type}</span>·<span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{b.district}</span>
                </div>
                <div className={`mt-1.5 flex flex-wrap gap-1 ${lang === "bn" ? "font-bangla" : ""}`}>
                  {b.crops_buying.slice(0, 4).map((c) => (
                    <span key={c} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{c}</span>
                  ))}
                </div>
                {b.offered_price_note && <p className={`mt-1.5 line-clamp-1 text-xs text-foreground/70 ${lang === "bn" ? "font-bangla" : ""}`}>{b.offered_price_note}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
