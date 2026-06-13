import { useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, MapPin, Phone, Plus, UserRound, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type LaborProfile = {
  id: string; user_id: string; full_name: string; phone: string; categories: string[];
  daily_rate: number; division: string; district: string; upazila: string; village: string;
  description: string | null; available: boolean;
};

const WORKS = ["ধান কাটা", "মাটি কাটা", "ধান রোপণ", "আগাছা পরিষ্কার", "ফসল তোলা", "অন্যান্য"];

export function LaborMarketplace({ profiles, uid }: { profiles: LaborProfile[]; uid: string | null }) {
  const { lang } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<LaborProfile | null>(null);
  const [filters, setFilters] = useState({ division: "", district: "", upazila: "", village: "", category: "" });
  const mine = profiles.find((profile) => profile.user_id === uid);
  const options = (key: "division" | "district" | "upazila" | "village") =>
    [...new Set(profiles.map((profile) => profile[key]).filter(Boolean))].sort();
  const filtered = useMemo(() => profiles.filter((profile) =>
    (!filters.division || profile.division === filters.division) &&
    (!filters.district || profile.district === filters.district) &&
    (!filters.upazila || profile.upazila === filters.upazila) &&
    (!filters.village || profile.village === filters.village) &&
    (!filters.category || profile.categories.includes(filters.category))), [profiles, filters]);

  return <div className="space-y-4">
    <Button type="button" variant="outline" className="h-auto w-full rounded-2xl border-dashed border-primary/40 py-3.5 text-primary" onClick={() => setShowForm(true)}>
      <Plus /> {mine ? (lang === "bn" ? "আমার শ্রমিক প্রোফাইল সম্পাদনা" : "Edit my labor profile") : (lang === "bn" ? "শ্রমিক প্রোফাইল তৈরি করুন" : "Create labor profile")}
    </Button>

    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-3">
      {(["division", "district", "upazila", "village"] as const).map((key) => <select key={key} value={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })} className="labor-input">
        <option value="">{lang === "bn" ? ({ division: "সব বিভাগ", district: "সব জেলা", upazila: "সব উপজেলা", village: "সব গ্রাম" }[key]) : `All ${key}`}</option>
        {options(key).map((value) => <option key={value}>{value}</option>)}
      </select>)}
      <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="labor-input col-span-2">
        <option value="">{lang === "bn" ? "সব কাজ" : "All work categories"}</option>
        {WORKS.map((work) => <option key={work}>{work}</option>)}
      </select>
    </div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{lang === "bn" ? "এই এলাকায় কোনো শ্রমিক পাওয়া যায়নি" : "No workers found in this area"}</div> :
      <div className="space-y-3">{filtered.map((profile) => <button type="button" key={profile.id} onClick={() => setSelected(profile)} className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-soft)]">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="h-7 w-7" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2"><strong className="truncate text-foreground">{profile.full_name}</strong><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{lang === "bn" ? "উপলব্ধ" : "Available"}</span></div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{profile.village}, {profile.upazila}, {profile.district}</p>
            <p className="mt-2 text-lg font-extrabold text-primary">৳{profile.daily_rate}<span className="text-xs font-normal text-muted-foreground">/{lang === "bn" ? "দিন" : "day"}</span></p>
            <div className="mt-2 flex flex-wrap gap-1">{profile.categories.map((category) => <span key={category} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{category}</span>)}</div>
          </div>
        </div>
      </button>)}</div>}

    {showForm && <LaborForm existing={mine} onClose={() => setShowForm(false)} />}
    {selected && <LaborDetails profile={selected} uid={uid} onClose={() => setSelected(null)} />}
    <style>{`.labor-input{width:100%;border-radius:.75rem;background:var(--background);border:1px solid var(--border);padding:.6rem .7rem;font-size:.75rem;color:var(--foreground);outline:none}.labor-input:focus{border-color:var(--ring)}`}</style>
  </div>;
}

function LaborDetails({ profile, uid, onClose }: { profile: LaborProfile; uid: string | null; onClose: () => void }) {
  const { lang } = useLang();
  const [sending, setSending] = useState(false);
  async function notify() {
    if (!uid || uid === profile.user_id) return;
    setSending(true);
    try {
      const { data: sender } = await supabase.from("profiles").select("full_name, phone").eq("id", uid).maybeSingle();
      const senderName = sender?.full_name || (lang === "bn" ? "একজন কৃষক" : "A farmer");
      const { error } = await supabase.from("notifications").insert({ sender_id: uid, recipient_id: profile.user_id, listing_crop: profile.categories.join(", "), sender_name: senderName, sender_phone: sender?.phone, message: lang === "bn" ? `${senderName} আপনাকে কৃষি কাজের জন্য নিয়োগ করতে চান।` : `${senderName} wants to hire you for agricultural work.` });
      if (error) throw error;
      toast.success(lang === "bn" ? "শ্রমিককে নোটিফিকেশন পাঠানো হয়েছে" : "Worker notified");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Failed"); } finally { setSending(false); }
  }
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center sm:p-4" onClick={onClose}><div className="w-full max-w-md rounded-t-3xl bg-card p-5 sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
    <div className="flex items-start justify-between"><div><h3 className="text-xl font-bold">{profile.full_name}</h3><p className="mt-1 text-xs text-muted-foreground">{profile.village}, {profile.upazila}, {profile.district}, {profile.division}</p></div><Button variant="ghost" size="icon" onClick={onClose}><X /></Button></div>
    <div className="mt-4 rounded-2xl bg-primary/5 p-4"><p className="font-extrabold text-primary">৳{profile.daily_rate}/{lang === "bn" ? "দিন" : "day"}</p><p className="mt-2 text-sm">{profile.description || (lang === "bn" ? "কোনো বিবরণ দেওয়া হয়নি" : "No description provided")}</p></div>
    <div className="mt-4 grid grid-cols-2 gap-2"><Button asChild className="rounded-xl"><a href={`tel:${profile.phone}`}><Phone />{lang === "bn" ? "কল করুন" : "Call"}</a></Button><Button variant="outline" className="rounded-xl" disabled={sending || uid === profile.user_id} onClick={notify}><Bell />{lang === "bn" ? "নোটিফিকেশন" : "Notify"}</Button></div>
  </div></div>;
}

function LaborForm({ existing, onClose }: { existing?: LaborProfile; onClose: () => void }) {
  const { lang } = useLang(); const qc = useQueryClient(); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: existing?.full_name ?? "", phone: existing?.phone ?? "", categories: existing?.categories ?? [] as string[], daily_rate: existing?.daily_rate?.toString() ?? "", division: existing?.division ?? "", district: existing?.district ?? "", upazila: existing?.upazila ?? "", village: existing?.village ?? "", description: existing?.description ?? "", available: existing?.available ?? true });
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!form.categories.length) { toast.error(lang === "bn" ? "অন্তত একটি কাজ নির্বাচন করুন" : "Select at least one category"); return; } setSaving(true); try { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error("Not signed in"); const payload = { user_id: data.user.id, ...form, full_name: form.full_name.trim(), phone: form.phone.trim(), daily_rate: Number(form.daily_rate), description: form.description.trim() || null }; const result = existing ? await supabase.from("labor_profiles").update(payload).eq("id", existing.id) : await supabase.from("labor_profiles").insert(payload); if (result.error) throw result.error; await qc.invalidateQueries({ queryKey: ["machines"] }); toast.success(lang === "bn" ? "শ্রমিক প্রোফাইল সংরক্ষণ হয়েছে" : "Labor profile saved"); onClose(); } catch (error) { toast.error(error instanceof Error ? error.message : "Failed"); } finally { setSaving(false); } }
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center sm:p-4" onClick={onClose}><form className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 sm:rounded-3xl" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
    <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">{lang === "bn" ? "শ্রমিক প্রোফাইল" : "Labor profile"}</h3><Button type="button" variant="ghost" size="icon" onClick={onClose}><X /></Button></div>
    <div className="space-y-3"><LaborField label={lang === "bn" ? "নাম" : "Name"}><input required minLength={2} maxLength={100} className="labor-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></LaborField><div className="grid grid-cols-2 gap-3"><LaborField label={lang === "bn" ? "ফোন" : "Phone"}><input required inputMode="tel" pattern="[0-9+ -]{7,15}" className="labor-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></LaborField><LaborField label={lang === "bn" ? "দৈনিক মজুরি" : "Daily rate"}><input required type="number" min="0" className="labor-input" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} /></LaborField></div>
      <LaborField label={lang === "bn" ? "কাজের ধরন" : "Work categories"}><div className="flex flex-wrap gap-2">{WORKS.map((work) => <Button key={work} type="button" size="sm" variant={form.categories.includes(work) ? "default" : "outline"} onClick={() => setForm({ ...form, categories: form.categories.includes(work) ? form.categories.filter((item) => item !== work) : [...form.categories, work] })}><BriefcaseBusiness />{work}</Button>)}</div></LaborField>
      <div className="grid grid-cols-2 gap-3">{(["division", "district", "upazila", "village"] as const).map((key) => <LaborField key={key} label={lang === "bn" ? ({ division: "বিভাগ", district: "জেলা", upazila: "উপজেলা", village: "গ্রাম" }[key]) : key}><input required maxLength={100} className="labor-input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></LaborField>)}</div>
      <LaborField label={lang === "bn" ? "কাজের অভিজ্ঞতা/বিবরণ" : "Experience / description"}><textarea maxLength={500} rows={3} className="labor-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></LaborField>
    </div><Button disabled={saving} className="mt-4 h-11 w-full rounded-xl">{saving ? (lang === "bn" ? "সংরক্ষণ হচ্ছে…" : "Saving…") : (lang === "bn" ? "সংরক্ষণ করুন" : "Save profile")}</Button>
  </form></div>;
}

function LaborField({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1 block text-xs font-semibold">{label}</span>{children}</label>; }