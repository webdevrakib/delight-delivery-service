import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { LogOut, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No user");
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle();
    if (error) throw error;
    return { user: userData.user, profile: data };
  },
});

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Krishi Bondhu" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: () => <AppShell><Suspense fallback={null}><ProfilePage /></Suspense></AppShell>,
});

function ProfilePage() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(profileQuery);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    district: "",
    village: "",
    land_size_acres: "",
    primary_crops: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data.profile) {
      setForm({
        full_name: data.profile.full_name ?? "",
        phone: data.profile.phone ?? "",
        district: data.profile.district ?? "",
        village: data.profile.village ?? "",
        land_size_acres: data.profile.land_size_acres?.toString() ?? "",
        primary_crops: (data.profile.primary_crops ?? []).join(", "),
      });
      if (data.profile.preferred_language === "en" || data.profile.preferred_language === "bn") {
        setLang(data.profile.preferred_language);
      }
    }
  }, [data.profile, setLang]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        district: form.district.trim() || null,
        village: form.village.trim() || null,
        land_size_acres: form.land_size_acres ? Number(form.land_size_acres) : null,
        primary_crops: form.primary_crops.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_language: lang,
      });
      if (error) throw error;
      toast.success(t("profileSaved"));
      await qc.invalidateQueries({ queryKey: ["profile"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="space-y-5">
      <section className="flex items-center gap-4 rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-primary-foreground backdrop-blur">
          <User className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`truncate text-lg font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{form.full_name || data.user.email}</div>
          <div className="truncate text-xs opacity-85">{data.user.email}</div>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <Field label={t("fullName")}>
          <input className="pf-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("phone")}><input className="pf-input" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15} /></Field>
          <Field label={t("landSize")}><input className="pf-input" inputMode="decimal" value={form.land_size_acres} onChange={(e) => setForm({ ...form, land_size_acres: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("district")}><input className="pf-input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} maxLength={60} /></Field>
          <Field label={t("village")}><input className="pf-input" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} maxLength={60} /></Field>
        </div>
        <Field label={t("primaryCrops")}>
          <input className="pf-input" value={form.primary_crops} onChange={(e) => setForm({ ...form, primary_crops: e.target.value })} placeholder="ধান, গম, আলু" maxLength={200} />
        </Field>

        <Field label={t("language")}>
          <div className="flex gap-2">
            {(["bn", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${lang === l ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}>
                {l === "bn" ? "বাংলা" : "English"}
              </button>
            ))}
          </div>
        </Field>

        <button type="submit" disabled={saving} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("saveProfile")}
        </button>
      </form>

      <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10">
        <LogOut className="h-4 w-4" /> {t("logout")}
      </button>

      <style>{`.pf-input{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none;transition:border-color .15s}.pf-input:focus{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 25%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
