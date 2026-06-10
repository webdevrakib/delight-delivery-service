import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ShoppingBag, MapPin, Phone, MessageCircle, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const buyerQuery = (id: string) =>
  queryOptions({
    queryKey: ["buyer", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("buyers").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/_authenticated/sell/$buyerId")({
  head: () => ({ meta: [{ title: "ক্রেতা — কৃষক বন্ধু" }] }),
  loader: ({ params, context }) => context.queryClient.ensureQueryData(buyerQuery(params.buyerId)),
  component: () => (
    <AppShell title="ক্রেতার বিস্তারিত" showBack><Suspense fallback={null}><Detail /></Suspense></AppShell>
  ),
});

function Detail() {
  const { t, lang } = useLang();
  const { buyerId } = Route.useParams();
  const { data: b } = useSuspenseQuery(buyerQuery(buyerId));
  const qc = useQueryClient();
  const [form, setForm] = useState({ crop: "", quantity_kg: "", price_per_kg: "", sale_date: new Date().toISOString().slice(0, 10), notes: "" });
  const [saving, setSaving] = useState(false);

  if (!b) return <div className={`text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>ক্রেতা পাওয়া যায়নি</div>;

  async function record(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("crop_sales").insert({
        farmer_id: u.user.id, buyer_id: b!.id, crop: form.crop.trim(),
        quantity_kg: Number(form.quantity_kg), price_per_kg: Number(form.price_per_kg),
        sale_date: form.sale_date, notes: form.notes.trim() || null,
      });
      if (error) throw error;
      toast.success(t("saleRecorded"));
      await qc.invalidateQueries({ queryKey: ["my-sales"] });
      setForm({ ...form, crop: "", quantity_kg: "", price_per_kg: "", notes: "" });
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"><ShoppingBag className="h-7 w-7" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className={`text-xl font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? b.name_bn : b.name_en}</h1>
              {b.verified && <BadgeCheck className="h-5 w-5" />}
            </div>
            <div className={`mt-1 flex items-center gap-2 text-xs opacity-90 ${lang === "bn" ? "font-bangla" : ""}`}>
              <span>{b.buyer_type}</span>·<span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{b.district}</span>
            </div>
            {b.address && <p className={`mt-0.5 text-xs opacity-85 ${lang === "bn" ? "font-bangla" : ""}`}>{b.address}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${b.phone}`} className={`flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-3 py-3 text-xs font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>
          <Phone className="h-4 w-4" /> {t("contactDirect")}
        </a>
        {b.whatsapp && (
          <a href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3 py-3 text-xs font-bold text-[color:var(--saffron-foreground)] ${lang === "bn" ? "font-bangla" : ""}`}>
            <MessageCircle className="h-4 w-4" /> {t("bargain")}
          </a>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className={`text-xs font-bold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("cropsBuying")}</div>
        <div className={`mt-2 flex flex-wrap gap-1.5 ${lang === "bn" ? "font-bangla" : ""}`}>
          {b.crops_buying.map((c) => <span key={c} className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">{c}</span>)}
        </div>
        {b.offered_price_note && <p className={`mt-2.5 text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{b.offered_price_note}</p>}
      </div>

      <form onSubmit={record} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className={`text-base font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("recordSale")}</h3>
        <input required placeholder={t("crop")} className="ip" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} maxLength={60} />
        <div className="grid grid-cols-2 gap-3">
          <input required type="number" min={0} placeholder={t("quantityKg")} className="ip" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} />
          <input required type="number" min={0} step="0.01" placeholder={t("pricePerKg")} className="ip" value={form.price_per_kg} onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })} />
        </div>
        <input required type="date" className="ip" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} />
        <button disabled={saving} className={`w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60 ${lang === "bn" ? "font-bangla" : ""}`}>{saving ? t("loading") : t("save")}</button>
        <style>{`.ip{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none}.ip:focus{border-color:var(--ring)}`}</style>
      </form>
    </div>
  );
}
