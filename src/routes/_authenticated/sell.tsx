import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ShoppingBag, MapPin, BadgeCheck, Plus, X, Trash2, CheckCircle2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const sellQuery = queryOptions({
  queryKey: ["sell-data"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const [buyers, myListings, activeListings] = await Promise.all([
      supabase.from("buyers").select("*").order("verified", { ascending: false }),
      u.user
        ? supabase.from("farmer_crop_listings").select("*").eq("farmer_id", u.user.id).neq("status", "removed").order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as any[], error: null }),
      supabase.from("farmer_crop_listings").select("*").eq("status", "active").order("created_at", { ascending: false }),
    ]);
    if (buyers.error) throw buyers.error;
    const sellerIds = Array.from(new Set((activeListings.data ?? []).map((l: any) => l.farmer_id)));
    const sellers = sellerIds.length
      ? (await supabase.from("profiles").select("id, full_name, phone, district, village, avatar_url").in("id", sellerIds)).data ?? []
      : [];
    const sellerMap = Object.fromEntries(sellers.map((s: any) => [s.id, s]));
    const listingsWithSeller = (activeListings.data ?? []).map((l: any) => ({ ...l, seller: sellerMap[l.farmer_id] ?? null }));
    return { buyers: buyers.data ?? [], listings: myListings.data ?? [], farmerListings: listingsWithSeller };
  },
});

export const Route = createFileRoute("/_authenticated/sell")({
  head: () => ({ meta: [{ title: "ফসল বিক্রি — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(sellQuery),
  component: () => <AppShell><Suspense fallback={null}><Page /></Suspense></AppShell>,
});

type Mode = "sell" | "buy";

function Page() {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<Mode>("sell");
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("cropSelling")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          {mode === "sell" ? "আপনার ফসল বিক্রির জন্য listing দিন" : "ক্রেতার সাথে সরাসরি যোগাযোগ"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
        {(["sell", "buy"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === m ? "bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}
          >
            {m === "sell" ? t("sellMyCrop") : t("buyCrop")}
          </button>
        ))}
      </div>

      {mode === "sell" ? <SellMode onAdd={() => setShowAdd(true)} /> : <BuyMode />}
      {showAdd && <AddListingModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function SellMode({ onAdd }: { onAdd: () => void }) {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(sellQuery);
  const qc = useQueryClient();

  const active = data.listings.filter((l) => l.status === "active");
  const sold = data.listings.filter((l) => l.status === "sold");

  async function setStatus(id: string, status: "sold" | "removed") {
    const { error } = await supabase.from("farmer_crop_listings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "sold" ? t("markedSold") : t("removed"));
    await qc.invalidateQueries({ queryKey: ["sell-data"] });
    await qc.invalidateQueries({ queryKey: ["profile-full"] });
  }

  return (
    <>
      <button onClick={onAdd} className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3.5 text-sm font-bold text-primary transition hover:bg-primary/10 ${lang === "bn" ? "font-bangla" : ""}`}>
        <Plus className="h-4 w-4" /> {t("addCropListing")}
      </button>

      <div>
        <h3 className={`mb-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("myActiveListings")}</h3>
        {active.length === 0 ? (
          <div className={`rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("noListingsYet")}</div>
        ) : (
          <div className="space-y-2">
            {active.map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sprout className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-base font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{l.crop}</div>
                    <div className={`text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                      {l.quantity} {l.unit} · ৳{l.price_per_unit}/{l.unit}{l.area ? ` · ${l.area}` : ""}
                    </div>
                    {l.description && <p className={`mt-1 line-clamp-2 text-xs text-foreground/75 ${lang === "bn" ? "font-bangla" : ""}`}>{l.description}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-primary">৳{Number(l.quantity) * Number(l.price_per_unit)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setStatus(l.id, "sold")} className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-2 py-1.5 text-[11px] font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("markSold")}
                  </button>
                  <button onClick={() => setStatus(l.id, "removed")} className={`inline-flex items-center justify-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-[11px] font-bold text-destructive ${lang === "bn" ? "font-bangla" : ""}`}>
                    <Trash2 className="h-3.5 w-3.5" /> {t("remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {sold.length > 0 && (
        <div>
          <h3 className={`mb-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("salesHistory")}</h3>
          <div className="space-y-2">
            {sold.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 opacity-80">
                <div>
                  <div className={`text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{l.crop} · {l.quantity} {l.unit}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(l.updated_at).toLocaleDateString()}</div>
                </div>
                <span className={`rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>{t("markedSold").split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BuyMode() {
  const { lang } = useLang();
  const { data } = useSuspenseQuery(sellQuery);
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <h2 className={`text-sm font-bold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          {lang === "bn" ? "কৃষকদের ফসল" : "Farmer listings"}
        </h2>
        {data.farmerListings.length === 0 ? (
          <div className={`rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
            {lang === "bn" ? "এখনো কোনো কৃষক ফসল list করেননি" : "No farmer listings yet"}
          </div>
        ) : (
          data.farmerListings.map((l: any) => (
            <Link key={l.id} to="/sell/listing/$listingId" params={{ listingId: l.id }} className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
              <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                  {l.image_url ? <img src={l.image_url} alt="" className="h-full w-full object-cover" /> : <Sprout className="h-6 w-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`flex items-center justify-between gap-2 ${lang === "bn" ? "font-bangla" : ""}`}>
                    <h3 className="truncate text-base font-bold text-foreground">{l.crop}</h3>
                    <span className="shrink-0 text-sm font-bold text-primary">৳{l.price_per_unit}/{l.unit}</span>
                  </div>
                  <div className={`mt-0.5 text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                    {l.quantity} {l.unit} · {l.seller?.full_name ?? (lang === "bn" ? "কৃষক" : "Farmer")}
                  </div>
                  {l.seller?.district && (
                    <div className={`mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                      <MapPin className="h-3 w-3" />{l.seller.village ? `${l.seller.village}, ` : ""}{l.seller.district}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className={`text-sm font-bold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          {lang === "bn" ? "ক্রেতা প্রতিষ্ঠান" : "Buyer companies"}
        </h2>
        {data.buyers.map((b) => (
          <Link key={b.id} to="/sell/$buyerId" params={{ buyerId: b.id }} className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--saffron)]/20 text-[color:var(--saffron-foreground)]">
                {b.logo_url ? <img src={b.logo_url} alt="" className="h-full w-full object-cover" /> : <ShoppingBag className="h-6 w-6" />}
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
                  {(b.crops_buying ?? []).slice(0, 4).map((c: string) => (
                    <span key={c} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{c}</span>
                  ))}
                </div>
                {b.offered_price_note && <p className={`mt-1.5 line-clamp-1 text-xs text-foreground/70 ${lang === "bn" ? "font-bangla" : ""}`}>{b.offered_price_note}</p>}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function AddListingModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState({ crop: "ধান", quantity: "", unit: "kg", price_per_unit: "", area: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("farmer_crop_listings").insert({
        farmer_id: u.user.id,
        crop: form.crop.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        price_per_unit: Number(form.price_per_unit),
        area: form.area.trim() || null,
        description: form.description.trim() || null,
      });
      if (error) throw error;
      toast.success(t("listingAdded"));
      await qc.invalidateQueries({ queryKey: ["sell-data"] });
      await qc.invalidateQueries({ queryKey: ["profile-full"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setSaving(false);
    }
  }

  const CROPS = [t("cropPaddy"), t("cropJute"), t("cropPotato"), t("cropWheat"), t("cropCorn"), t("cropVeg")];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-[var(--shadow-elevated)] sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("addCropListing")}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <Field label={t("crop")}>
            <select className="ip" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("quantity")}>
              <input required type="number" min={0} step="0.01" className="ip" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </Field>
            <Field label={t("unit")}>
              <select className="ip" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="kg">{t("unitKg")}</option>
                <option value="mon">{t("unitMon")}</option>
              </select>
            </Field>
          </div>
          <Field label={t("pricePerUnit")}>
            <input required type="number" min={0} className="ip" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })} />
          </Field>
          <Field label={t("area")}>
            <input className="ip" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} maxLength={80} placeholder={lang === "bn" ? "যেমন: বগুড়া, শেরপুর" : "e.g. Bogura"} />
          </Field>
          <Field label={t("description")}>
            <textarea className="ip" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={300} rows={2} />
          </Field>
        </div>
        <button type="submit" disabled={saving} className={`mt-4 w-full rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 ${lang === "bn" ? "font-bangla" : ""}`}>
          {saving ? t("loading") : t("save")}
        </button>
        <style>{`.ip{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none}.ip:focus{border-color:var(--ring)}`}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { lang } = useLang();
  return <label className="block"><span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{label}</span>{children}</label>;
}
