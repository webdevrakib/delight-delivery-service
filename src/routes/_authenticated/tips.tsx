import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { Newspaper } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const tipsQuery = queryOptions({
  queryKey: ["tips"],
  queryFn: async () => {
    const { data, error } = await supabase.from("tips").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/_authenticated/tips")({
  head: () => ({ meta: [{ title: "Farming Tips — Krishi Bondhu" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(tipsQuery),
  component: () => <AppShell><Suspense fallback={null}><TipsPage /></Suspense></AppShell>,
});

function TipsPage() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(tipsQuery);
  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("farmingTips")}</h1>
        <p className="text-sm text-muted-foreground">{t("farmingTipsDesc")}</p>
      </div>
      <div className="space-y-3">
        {data.map((tip) => (
          <article key={tip.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="flex items-stretch">
              <div className="flex w-1.5 shrink-0 bg-[image:var(--gradient-hero)]" />
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Newspaper className="h-3.5 w-3.5" />
                  </div>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">{tip.category}</span>
                </div>
                <h3 className={`mt-2 text-base font-bold leading-snug text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.title_bn : tip.title_en}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed text-foreground/80 ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.content_bn : tip.content_en}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
