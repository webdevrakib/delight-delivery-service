import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ExternalLink, Sprout } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const schemesQuery = queryOptions({
  queryKey: ["schemes"],
  queryFn: async () => {
    const { data, error } = await supabase.from("schemes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/_authenticated/schemes")({
  head: () => ({ meta: [{ title: "সরকারি যোজনা — কৃষক বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(schemesQuery),
  component: () => <AppShell title="সরকারি যোজনা" showBack><Suspense fallback={null}><SchemesPage /></Suspense></AppShell>,
});

function SchemesPage() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(schemesQuery);
  const categories = ["all", ...Array.from(new Set(data.map((s) => s.category)))];
  const [cat, setCat] = useState<string>("all");
  const list = cat === "all" ? data : data.filter((s) => s.category === cat);

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("govSchemes")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>বাংলাদেশ সরকারের কৃষি সহায়তা</p>
      </div>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
            {c === "all" ? t("all") : c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((s) => (
          <article key={s.id} className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sprout className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <span className={`inline-block rounded-full bg-[color:var(--saffron)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--saffron-foreground)] ${lang === "bn" ? "font-bangla" : ""}`}>{s.category}</span>
                <h3 className={`mt-1 text-base font-bold leading-snug text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? s.title_bn : s.title_en}</h3>
                {s.ministry && <p className={`mt-0.5 text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{s.ministry}</p>}
              </div>
            </div>
            <p className={`mt-2.5 text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? s.description_bn : s.description_en}</p>
            {(lang === "bn" ? s.eligibility_bn : s.eligibility_en) && (
              <div className="mt-3 rounded-xl bg-muted px-3 py-2">
                <div className={`text-[10px] font-bold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("eligibility")}</div>
                <div className={`text-xs text-foreground/80 ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? s.eligibility_bn : s.eligibility_en}</div>
              </div>
            )}
            {s.link && (
              <a href={s.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                {t("learnMore")} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
