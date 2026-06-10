import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Tractor, MapPin, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const machineQuery = (id: string) =>
  queryOptions({
    queryKey: ["machine", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("machines").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/_authenticated/machines/$id")({
  head: () => ({ meta: [{ title: "যন্ত্র বিস্তারিত — কৃষি বন্ধু" }] }),
  loader: ({ params, context }) => context.queryClient.ensureQueryData(machineQuery(params.id)),
  component: () => (
    <AppShell title="যন্ত্র বিস্তারিত" showBack>
      <Suspense fallback={null}><Detail /></Suspense>
    </AppShell>
  ),
});

function Detail() {
  const { t, lang } = useLang();
  const { id } = Route.useParams();
  const { data: m } = useSuspenseQuery(machineQuery(id));
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!m) return <div className={`text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>যন্ত্র পাওয়া যায়নি</div>;

  async function book(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("machine_bookings").insert({
        machine_id: m!.id, farmer_id: u.user.id, start_date: start, end_date: end, notes: notes.trim() || null,
      });
      if (error) throw error;
      toast.success(t("bookingConfirmed"));
      await qc.invalidateQueries({ queryKey: ["my-bookings"] });
      setNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"><Tractor className="h-7 w-7" /></div>
          <div className="min-w-0">
            <h1 className={`text-xl font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{m.title}</h1>
            <div className={`mt-1 flex items-center gap-1 text-xs opacity-90 ${lang === "bn" ? "font-bangla" : ""}`}>
              <MapPin className="h-3 w-3" /> {m.district}{m.upazila ? `, ${m.upazila}` : ""}
            </div>
            <div className="mt-2 flex items-baseline gap-4">
              <div className="text-2xl font-extrabold">৳{m.rate_per_day}<span className={`text-xs font-normal opacity-80 ${lang === "bn" ? "font-bangla" : ""}`}> {t("perDay")}</span></div>
              {m.price_per_hour && (
                <div className="text-lg font-bold opacity-95">৳{m.price_per_hour}<span className={`text-[10px] font-normal opacity-80 ${lang === "bn" ? "font-bangla" : ""}`}> {t("perHour")}</span></div>
              )}
            </div>
            {m.available_from && (
              <div className={`mt-1 text-[11px] opacity-85 ${lang === "bn" ? "font-bangla" : ""}`}>{t("availableFrom")}: {m.available_from}</div>
            )}
          </div>
        </div>
      </div>

      {m.description && <p className={`rounded-2xl border border-border bg-card p-4 text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{m.description}</p>}

      <a href={`tel:${m.contact_phone}`} className={`flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-4 py-3 text-sm font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>
        <Phone className="h-4 w-4" /> {t("contactOwner")} — {m.contact_phone}
      </a>


      <form onSubmit={book} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className={`text-base font-bold ${lang === "bn" ? "font-bangla" : ""}`}><Calendar className="mr-2 inline h-4 w-4" />{t("bookNow")}</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{t("startDate")}</span>
            <input type="date" required value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{t("endDate")}</span>
            <input type="date" required value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
        </div>
        <textarea placeholder={lang === "bn" ? "বিশেষ নির্দেশনা…" : "Notes…"} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ${lang === "bn" ? "font-bangla" : ""}`} rows={2} />
        <button disabled={saving || !m.available} className={`w-full rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 ${lang === "bn" ? "font-bangla" : ""}`}>
          {saving ? t("loading") : t("bookNow")}
        </button>
      </form>
    </div>
  );
}
