import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Tractor, MapPin, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const machinesQuery = queryOptions({
  queryKey: ["machines"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("machines").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { list: data ?? [], uid: u.user?.id ?? null };
  },
});

export const Route = createFileRoute("/_authenticated/machines/")({
  head: () => ({ meta: [{ title: "যন্ত্র বুকিং — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(machinesQuery),
  component: () => <AppShell><Suspense fallback={null}><MachinesPage /></Suspense></AppShell>,
});

const TYPES = ["all", "paddyHarvester", "thresher", "tractor", "powerTiller"] as const;
type Mode = "rent" | "mine";

function MachinesPage() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(machinesQuery);
  const [mode, setMode] = useState<Mode>("rent");
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);

  let list = data.list;
  if (mode === "rent") list = list.filter((m) => m.owner_id !== data.uid && m.available !== false);
  else list = list.filter((m) => m.owner_id === data.uid);
  if (filter !== "all") list = list.filter((m) => m.machine_type === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("machineBooking")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>কৃষি যন্ত্রপাতি ভাড়া নিন বা ভাড়া দিন</p>
      </div>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
        <button onClick={() => setMode("rent")} className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === "rent" ? "bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
          {t("rentMachine")}
        </button>
        <button onClick={() => setMode("mine")} className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${mode === "mine" ? "bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
          {t("myMachines")}
        </button>
      </div>

      {mode === "mine" && (
        <button onClick={() => setShowAdd(true)} className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3.5 text-sm font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>
          <Plus className="h-4 w-4" /> {t("addMachine")}
        </button>
      )}

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TYPES.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
            {c === "all" ? t("all") : t(c as any)}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className={`rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          {mode === "mine" ? "আপনি এখনো কোনো যন্ত্র list করেননি" : "এই ধরনের কোনো যন্ত্র available নেই"}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((m) => (
            <Link key={m.id} to="/machines/$id" params={{ id: m.id }} className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
              <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Tractor className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-base font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{m.title}</h3>
                    {m.available ? (
                      <span className={`shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ${lang === "bn" ? "font-bangla" : ""}`}>{t("available")}</span>
                    ) : (
                      <span className={`shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("unavailable")}</span>
                    )}
                  </div>
                  <div className={`mt-0.5 flex items-center gap-1 text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                    <MapPin className="h-3 w-3" /> {m.district}{m.upazila ? `, ${m.upazila}` : ""}
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <div className="text-lg font-extrabold text-primary">৳{m.rate_per_day}<span className={`text-xs font-normal text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}> {t("perDay")}</span></div>
                    {m.price_per_hour && (
                      <div className="text-sm font-bold text-foreground/80">৳{m.price_per_hour}<span className={`text-[10px] font-normal text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}> {t("perHour")}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showAdd && <AddMachineModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddMachineModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    machine_type: "tractor", title: "", description: "", district: "", upazila: "",
    rate_per_day: "", price_per_hour: "", available_from: "", contact_phone: "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("machines").insert({
        owner_id: u.user.id,
        machine_type: form.machine_type,
        title: form.title.trim(),
        description: form.description.trim() || null,
        district: form.district.trim(),
        upazila: form.upazila.trim() || null,
        rate_per_day: Number(form.rate_per_day),
        price_per_hour: form.price_per_hour ? Number(form.price_per_hour) : null,
        available_from: form.available_from || null,
        contact_phone: form.contact_phone.trim(),
      });
      if (error) throw error;
      toast.success(t("machineAdded"));
      await qc.invalidateQueries({ queryKey: ["machines"] });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-[var(--shadow-elevated)] sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("addMachine")}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <Field label={t("machineType")}>
            <select className="ip" value={form.machine_type} onChange={(e) => setForm({ ...form, machine_type: e.target.value })}>
              <option value="tractor">{t("tractor")}</option>
              <option value="paddyHarvester">{t("paddyHarvester")}</option>
              <option value="thresher">{t("thresher")}</option>
              <option value="powerTiller">{t("powerTiller")}</option>
            </select>
          </Field>
          <Field label={t("title")}><input required className="ip" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={80} /></Field>
          <Field label={t("description")}><textarea className="ip" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={300} rows={2} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("district")}><input required className="ip" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} maxLength={60} /></Field>
            <Field label={t("upazila")}><input className="ip" value={form.upazila} onChange={(e) => setForm({ ...form, upazila: e.target.value })} maxLength={60} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("ratePerDay")}><input required type="number" min={0} className="ip" value={form.rate_per_day} onChange={(e) => setForm({ ...form, rate_per_day: e.target.value })} /></Field>
            <Field label={t("ratePerHour")}><input type="number" min={0} className="ip" value={form.price_per_hour} onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("availableFrom")}><input type="date" className="ip" value={form.available_from} onChange={(e) => setForm({ ...form, available_from: e.target.value })} /></Field>
            <Field label={t("contactPhone")}><input required className="ip" inputMode="tel" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} maxLength={15} /></Field>
          </div>
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
  return (
    <label className="block">
      <span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{label}</span>
      {children}
    </label>
  );
}
