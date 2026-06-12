import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useRef, useState } from "react";
import { LogOut, User, Loader2, Camera, History, ShoppingBag, Sprout, ChevronDown, UserCircle, IdCard, MapPin, Wheat, CreditCard, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const profileQuery = queryOptions({
  queryKey: ["profile-full"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No user");
    const uid = userData.user.id;
    const [profileRes, bookingsRes, salesRes, listingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("machine_bookings").select("*, machines(title)").eq("farmer_id", uid).order("created_at", { ascending: false }).limit(10),
      supabase.from("crop_sales").select("*").eq("farmer_id", uid).order("sale_date", { ascending: false }).limit(20),
      supabase.from("farmer_crop_listings").select("*").eq("farmer_id", uid).eq("status", "active").order("created_at", { ascending: false }),
    ]);
    return { user: userData.user, profile: profileRes.data, bookings: bookingsRes.data ?? [], sales: salesRes.data ?? [], listings: listingsRes.data ?? [] };

  },
});

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "প্রোফাইল — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: () => <AppShell><Suspense fallback={null}><ProfilePage /></Suspense></AppShell>,
});

function ProfilePage() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(profileQuery);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: "", phone: "", district: "", village: "",
    land_size: "", land_unit: "acre" as "acre" | "shotok",
    primary_crops: "",
    date_of_birth: "", gender: "", occupation: "", father_name: "", mother_name: "",
    nid_number: "", nid_name: "", nid_address: "",
    upazila: "", post_office: "", postal_code: "",
    land_type: "", land_ownership: "", holding_number: "", irrigation_source: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signedAvatar, setSignedAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data.profile) {
      const p = data.profile as any;
      setForm({
        full_name: p.full_name ?? "",
        phone: p.phone ?? "",
        district: p.district ?? "",
        village: p.village ?? "",
        land_size: p.land_size_acres?.toString() ?? "",
        land_unit: (p.land_unit as "acre" | "shotok") || "acre",
        primary_crops: (p.primary_crops ?? []).join(", "),
        date_of_birth: p.date_of_birth ?? "",
        gender: p.gender ?? "",
        occupation: p.occupation ?? "",
        father_name: p.father_name ?? "",
        mother_name: p.mother_name ?? "",
        nid_number: p.nid_number ?? "",
        nid_name: p.nid_name ?? "",
        nid_address: p.nid_address ?? "",
        upazila: p.upazila ?? "",
        post_office: p.post_office ?? "",
        postal_code: p.postal_code ?? "",
        land_type: p.land_type ?? "",
        land_ownership: p.land_ownership ?? "",
        holding_number: p.holding_number ?? "",
        irrigation_source: p.irrigation_source ?? "",
      });
      setAvatarUrl((data.profile as any).avatar_url ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.profile]);

  useEffect(() => {
    if (!avatarUrl) { setSignedAvatar(null); return; }
    supabase.storage.from("avatars").createSignedUrl(avatarUrl, 3600).then(({ data }) => {
      if (data?.signedUrl) setSignedAvatar(data.signedUrl);
    });
  }, [avatarUrl]);

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("ছবি 5MB-এর কম হতে হবে"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${data.user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", data.user.id);
      if (dbErr) throw dbErr;
      setAvatarUrl(path);
      toast.success("ছবি আপডেট হয়েছে");
      await qc.invalidateQueries({ queryKey: ["profile-full"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setUploading(false);
    }
  }

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
        land_size_acres: form.land_size ? Number(form.land_size) : null,
        land_unit: form.land_unit,
        primary_crops: form.primary_crops.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_language: lang,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender.trim() || null,
        occupation: form.occupation.trim() || null,
        father_name: form.father_name.trim() || null,
        mother_name: form.mother_name.trim() || null,
        nid_number: form.nid_number.trim() || null,
        nid_name: form.nid_name.trim() || null,
        nid_address: form.nid_address.trim() || null,
        upazila: form.upazila.trim() || null,
        post_office: form.post_office.trim() || null,
        postal_code: form.postal_code.trim() || null,
        land_type: form.land_type.trim() || null,
        land_ownership: form.land_ownership.trim() || null,
        holding_number: form.holding_number.trim() || null,
        irrigation_source: form.irrigation_source.trim() || null,
      } as any);
      if (error) throw error;
      toast.success(t("profileSaved"));
      await qc.invalidateQueries({ queryKey: ["profile-full"] });
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

  const totalKg = data.sales.reduce((s, x) => s + Number(x.quantity_kg || 0), 0);
  const totalEarned = data.sales.reduce((s, x) => s + Number(x.quantity_kg || 0) * Number(x.price_per_kg || 0), 0);

  return (
    <div className="space-y-5">
      <section className="flex items-center gap-4 rounded-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur">
            {signedAvatar ? <img src={signedAvatar} alt="" className="h-full w-full object-cover" /> : <User className="h-8 w-8" />}
          </div>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--saffron)] text-[color:var(--saffron-foreground)] shadow-md disabled:opacity-60">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`truncate text-lg font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{form.full_name || data.user.email}</div>
          <div className="truncate text-xs opacity-85">{data.user.email}</div>
          <div className={`mt-0.5 text-[11px] opacity-80 ${lang === "bn" ? "font-bangla" : ""}`}>{t("changePhoto")}</div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label={t("totalSold")} value={`${totalKg.toFixed(0)} kg`} />
        <Stat label={t("totalEarned")} value={`৳${totalEarned.toFixed(0)}`} />
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <Section icon={UserCircle} title={lang === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information"} defaultOpen>
          <Field label={t("fullName")}><input className="pf-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("phone")}><input className="pf-input" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15} /></Field>
            <Field label={lang === "bn" ? "জন্ম তারিখ" : "Date of Birth"}><input type="date" className="pf-input" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "bn" ? "লিঙ্গ" : "Gender"}>
              <select className="pf-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">—</option>
                <option value="male">{lang === "bn" ? "পুরুষ" : "Male"}</option>
                <option value="female">{lang === "bn" ? "মহিলা" : "Female"}</option>
                <option value="other">{lang === "bn" ? "অন্যান্য" : "Other"}</option>
              </select>
            </Field>
            <Field label={lang === "bn" ? "পেশা" : "Occupation"}><input className="pf-input" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} maxLength={60} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "bn" ? "পিতার নাম" : "Father's Name"}><input className="pf-input" value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} maxLength={100} /></Field>
            <Field label={lang === "bn" ? "মাতার নাম" : "Mother's Name"}><input className="pf-input" value={form.mother_name} onChange={(e) => setForm({ ...form, mother_name: e.target.value })} maxLength={100} /></Field>
          </div>
        </Section>

        <Section icon={IdCard} title={lang === "bn" ? "এনআইডি (NID) তথ্য" : "NID Information"}>
          <Field label={lang === "bn" ? "এনআইডি নম্বর" : "NID Number"}><input className="pf-input" inputMode="numeric" value={form.nid_number} onChange={(e) => setForm({ ...form, nid_number: e.target.value })} maxLength={20} placeholder="1234567890123" /></Field>
          <Field label={lang === "bn" ? "এনআইডি অনুযায়ী নাম" : "Name as on NID"}><input className="pf-input" value={form.nid_name} onChange={(e) => setForm({ ...form, nid_name: e.target.value })} maxLength={100} /></Field>
          <Field label={lang === "bn" ? "এনআইডি অনুযায়ী ঠিকানা" : "Address on NID"}><textarea className="pf-input" rows={2} value={form.nid_address} onChange={(e) => setForm({ ...form, nid_address: e.target.value })} maxLength={250} /></Field>
        </Section>

        <Section icon={MapPin} title={lang === "bn" ? "ঠিকানা" : "Address"}>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("district")}><input className="pf-input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} maxLength={60} /></Field>
            <Field label={lang === "bn" ? "উপজেলা" : "Upazila"}><input className="pf-input" value={form.upazila} onChange={(e) => setForm({ ...form, upazila: e.target.value })} maxLength={60} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "bn" ? "ডাকঘর" : "Post Office"}><input className="pf-input" value={form.post_office} onChange={(e) => setForm({ ...form, post_office: e.target.value })} maxLength={60} /></Field>
            <Field label={lang === "bn" ? "পোস্ট কোড" : "Postal Code"}><input className="pf-input" inputMode="numeric" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} maxLength={10} /></Field>
          </div>
          <Field label={t("village")}><input className="pf-input" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} maxLength={60} /></Field>
        </Section>

        <Section icon={Wheat} title={lang === "bn" ? "জমি ও কৃষি তথ্য" : "Land & Farming"}>
          <Field label={t("landSize")}>
            <div className="flex gap-2">
              <input className="pf-input flex-1" inputMode="decimal" value={form.land_size} onChange={(e) => setForm({ ...form, land_size: e.target.value })} />
              <div className="flex gap-1 rounded-xl border border-border bg-background p-1">
                {(["acre", "shotok"] as const).map((u) => (
                  <button key={u} type="button" onClick={() => setForm({ ...form, land_unit: u })}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${form.land_unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
                    {u === "acre" ? t("landUnitAcre") : t("landUnitShotok")}
                  </button>
                ))}
              </div>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "bn" ? "জমির ধরন" : "Land Type"}>
              <select className="pf-input" value={form.land_type} onChange={(e) => setForm({ ...form, land_type: e.target.value })}>
                <option value="">—</option>
                <option value="high">{lang === "bn" ? "উঁচু" : "Highland"}</option>
                <option value="medium">{lang === "bn" ? "মাঝারি" : "Medium"}</option>
                <option value="low">{lang === "bn" ? "নিচু" : "Lowland"}</option>
              </select>
            </Field>
            <Field label={lang === "bn" ? "মালিকানা" : "Ownership"}>
              <select className="pf-input" value={form.land_ownership} onChange={(e) => setForm({ ...form, land_ownership: e.target.value })}>
                <option value="">—</option>
                <option value="own">{lang === "bn" ? "নিজস্ব" : "Own"}</option>
                <option value="leased">{lang === "bn" ? "লিজ" : "Leased"}</option>
                <option value="shared">{lang === "bn" ? "বর্গা" : "Sharecrop"}</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "bn" ? "হোল্ডিং নম্বর" : "Holding Number"}><input className="pf-input" value={form.holding_number} onChange={(e) => setForm({ ...form, holding_number: e.target.value })} maxLength={30} /></Field>
            <Field label={lang === "bn" ? "সেচের উৎস" : "Irrigation Source"}><input className="pf-input" value={form.irrigation_source} onChange={(e) => setForm({ ...form, irrigation_source: e.target.value })} maxLength={60} /></Field>
          </div>
          <Field label={t("primaryCrops")}>
            <input className="pf-input" value={form.primary_crops} onChange={(e) => setForm({ ...form, primary_crops: e.target.value })} placeholder="ধান, পাট, আলু" maxLength={200} />
          </Field>
        </Section>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <Field label={t("language")}>
            <div className="flex gap-2">
              {(["bn", "en"] as const).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${lang === l ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}>
                  {l === "bn" ? "বাংলা" : "English"}
                </button>
              ))}
            </div>
          </Field>
          <button type="submit" disabled={saving} className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 ${lang === "bn" ? "font-bangla" : ""}`}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {t("saveProfile")}
          </button>
        </div>
      </form>

      {/* My active crop listings */}
      <section>
        <h3 className={`mb-2 flex items-center gap-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}><Sprout className="h-4 w-4 text-primary" />{t("myActiveListings")}</h3>
        {data.listings.length === 0 ? <Empty msg={t("noListingsYet")} /> : (
          <div className="space-y-2">
            {data.listings.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{l.crop} · {l.quantity} {l.unit}</div>
                  <div className={`text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>৳{l.price_per_unit}/{l.unit}{l.area ? ` · ${l.area}` : ""}</div>
                </div>
                <div className="text-sm font-extrabold text-primary">৳{(Number(l.quantity) * Number(l.price_per_unit)).toFixed(0)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking history */}
      <section>
        <h3 className={`mb-2 flex items-center gap-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}><History className="h-4 w-4 text-primary" />{t("bookingHistory")}</h3>
        {data.bookings.length === 0 ? <Empty msg={t("noHistory")} /> : (
          <div className="space-y-2">
            {data.bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{b.machines?.title ?? "—"}</div>
                  <div className="text-[11px] text-muted-foreground">{b.start_date} → {b.end_date}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${b.status === "confirmed" ? "bg-primary/10 text-primary" : "bg-[color:var(--saffron)]/20 text-[color:var(--saffron-foreground)]"} ${lang === "bn" ? "font-bangla" : ""}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Sales history */}
      <section>
        <h3 className={`mb-2 flex items-center gap-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}><ShoppingBag className="h-4 w-4 text-primary" />{t("salesHistory")}</h3>
        {data.sales.length === 0 ? <Empty msg={t("noHistory")} /> : (
          <div className="space-y-2">
            {data.sales.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{s.crop} · {s.quantity_kg} kg</div>
                  <div className="text-[11px] text-muted-foreground">{s.sale_date}</div>
                </div>
                <div className="text-sm font-extrabold text-primary">৳{(Number(s.quantity_kg) * Number(s.price_per_kg)).toFixed(0)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button onClick={handleLogout} className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10 ${lang === "bn" ? "font-bangla" : ""}`}>
        <LogOut className="h-4 w-4" /> {t("logout")}
      </button>

      <style>{`.pf-input{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none;transition:border-color .15s}.pf-input:focus{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 25%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { lang } = useLang();
  return <label className="block"><span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{label}</span>{children}</label>;
}

function Section({ icon: Icon, title, children, defaultOpen = false }: { icon: React.ElementType; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <div className={`flex-1 text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{title}</div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-3 border-t border-border p-4">{children}</div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { lang } = useLang();
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className={`text-[11px] font-semibold uppercase text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{label}</div>
      <div className="mt-0.5 text-lg font-extrabold text-primary">{value}</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  const { lang } = useLang();
  return <div className={`rounded-xl border border-dashed border-border bg-card p-5 text-center text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{msg}</div>;
}
