import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Sprout, User, Calendar, IdCard, MapPin, Users, Wallet,
  Download, Send, History, Clock, CheckCircle2, XCircle, Plus, Printer,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type Card = {
  id: string; user_id: string; card_number: string;
  issued_at: string; expires_at: string; balance: number; status: string;
};
type Tx = {
  id: string; type: "government_payment" | "withdrawal"; amount: number;
  status: "pending" | "completed" | "rejected" | "received";
  payment_method: string | null; payment_number: string | null;
  is_own_number: boolean | null; request_name: string | null;
  request_nid: string | null; request_birthdate: string | null;
  note: string | null; created_at: string;
};

const cardQuery = queryOptions({
  queryKey: ["smart-card-page"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No user");
    const uid = userData.user.id;
    const [cardRes, profRes, txRes] = await Promise.all([
      supabase.from("smart_cards").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("profiles").select("id,full_name,date_of_birth,nid_number,nid_name,nid_address,father_name,mother_name,district,upazila,village,avatar_url").eq("id", uid).maybeSingle(),
      supabase.from("smart_card_transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);
    return { user: userData.user, card: cardRes.data as Card | null, profile: profRes.data as any, txs: (txRes.data ?? []) as Tx[] };
  },
});

export const Route = createFileRoute("/_authenticated/smart-card")({
  head: () => ({ meta: [{ title: "স্মার্ট কার্ড — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cardQuery),
  component: () => <AppShell><Suspense fallback={null}><SmartCardPage /></Suspense></AppShell>,
});

function fmtBn(d?: string | null, lang: "bn" | "en" = "bn") {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function SmartCardPage() {
  const { lang } = useLang();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(cardQuery);
  const bn = lang === "bn" ? "font-bangla" : "";
  const [tab, setTab] = useState<"overview" | "withdraw" | "history" | "pending">("overview");
  const printRef = useRef<HTMLDivElement>(null);

  if (!data.card) {
    return <div className={`rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground ${bn}`}>{lang === "bn" ? "কার্ড লোড হচ্ছে…" : "Loading card…"}</div>;
  }

  const card = data.card;
  const p = data.profile ?? {};
  const name = p.nid_name || p.full_name || (lang === "bn" ? "কৃষক" : "Farmer");
  const formatted = card.card_number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  const address = p.nid_address || [p.village, p.upazila, p.district].filter(Boolean).join(", ") || "—";

  const pending = data.txs.filter((t) => t.status === "pending");
  const completedReceived = data.txs.filter((t) => t.type === "government_payment" && (t.status === "completed" || t.status === "received"));
  const totalReceived = completedReceived.reduce((s, t) => s + Number(t.amount), 0);

  async function addDemoPayment() {
    const amount = Number(prompt(lang === "bn" ? "কত টাকা যোগ করবেন? (ডেমো)" : "Enter amount to add (demo)", "5000"));
    if (!amount || amount <= 0) return;
    const { error } = await supabase.from("smart_card_transactions").insert({
      card_id: card.id, user_id: data.user.id,
      type: "government_payment", amount, status: "received",
      note: lang === "bn" ? "সরকারি কৃষি ভর্তুকি" : "Government farming subsidy",
    });
    if (error) return toast.error(error.message);
    await supabase.from("smart_cards").update({ balance: Number(card.balance) + amount }).eq("id", card.id);
    toast.success(lang === "bn" ? `৳${amount} যোগ হয়েছে` : `৳${amount} added`);
    qc.invalidateQueries({ queryKey: ["smart-card-page"] });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> <span className={bn}>{lang === "bn" ? "প্রোফাইল" : "Profile"}</span>
        </Link>
        <button onClick={handlePrint} className={`flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground ${bn}`}>
          <Download className="h-3.5 w-3.5" /> {lang === "bn" ? "PDF" : "PDF"}
        </button>
      </div>

      {/* Card */}
      <div ref={printRef} className="print-area space-y-3">
        <CardFront card={card} profile={p} name={name} formatted={formatted} lang={lang} />
        <CardBack card={card} address={address} formatted={formatted} lang={lang} />

        {/* Balance */}
        <div className="rounded-2xl border border-border bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className={`text-[11px] font-bold uppercase tracking-wider opacity-90 ${bn}`}>{lang === "bn" ? "কার্ডের ব্যালেন্স" : "Card Balance"}</span>
          </div>
          <div className="mt-1 text-3xl font-extrabold">৳{Number(card.balance).toFixed(2)}</div>
          <div className={`mt-1 text-[11px] opacity-80 ${bn}`}>
            {lang === "bn" ? "মোট প্রাপ্ত" : "Total received"}: ৳{totalReceived.toFixed(0)} · {completedReceived.length} {lang === "bn" ? "টি লেনদেন" : "transactions"}
          </div>
        </div>
      </div>

      {/* Demo gov payment */}
      <button onClick={addDemoPayment} className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--saffron)]/50 bg-[color:var(--saffron)]/10 px-4 py-3 text-sm font-bold text-[color:var(--saffron-foreground)] ${bn}`}>
        <Plus className="h-4 w-4" /> {lang === "bn" ? "সরকারি ভর্তুকি যোগ করুন (ডেমো)" : "Add Government Payment (Demo)"}
      </button>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 print:hidden">
        {([
          ["overview", lang === "bn" ? "ওভারভিউ" : "Overview"],
          ["withdraw", lang === "bn" ? "উত্তোলন" : "Withdraw"],
          ["pending", `${lang === "bn" ? "পেন্ডিং" : "Pending"} (${pending.length})`],
          ["history", lang === "bn" ? "ইতিহাস" : "History"],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-bold transition ${tab === k ? "bg-card text-primary shadow-sm" : "text-muted-foreground"} ${bn}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="print:hidden">
        {tab === "overview" && <OverviewTab card={card} txs={data.txs} totalReceived={totalReceived} lang={lang} />}
        {tab === "withdraw" && <WithdrawTab card={card} profile={p} userId={data.user.id} onDone={() => qc.invalidateQueries({ queryKey: ["smart-card-page"] })} lang={lang} />}
        {tab === "pending" && <TxList txs={pending} lang={lang} emptyMsg={lang === "bn" ? "কোন পেন্ডিং রিকোয়েস্ট নেই" : "No pending requests"} />}
        {tab === "history" && <TxList txs={data.txs} lang={lang} emptyMsg={lang === "bn" ? "কোন লেনদেন নেই" : "No transactions"} />}
      </div>

      <style>{`@media print { body { background: white; } .print\\:hidden { display: none !important; } }`}</style>
    </div>
  );
}

function CardFront({ card, profile, name, formatted, lang }: any) {
  const bn = lang === "bn" ? "font-bangla" : "";
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--saffron)]/30 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sprout className="h-4 w-4" />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${bn}`}>{lang === "bn" ? "কৃষি বন্ধু" : "Krishi Bondhu"}</span>
        </div>
        <span className="text-[9px] opacity-80">{lang === "bn" ? "কৃষক কার্ড" : "FARMER CARD"}</span>
      </div>
      <div className="relative mt-3 flex gap-3">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 overflow-hidden rounded-lg border-2 border-white/40 bg-white/20">
            {profile.avatar_url ? <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><User className="h-8 w-8 opacity-70" /></div>}
          </div>
          <div className={`mt-1 max-w-[70px] truncate text-center text-[8px] italic opacity-90 ${bn}`}>{name}</div>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Row icon={User} label={lang === "bn" ? "নাম" : "Name"} value={name} bn={bn} />
          <Row icon={Calendar} label={lang === "bn" ? "জন্ম" : "DOB"} value={fmtBn(profile.date_of_birth, lang)} bn={bn} />
          <Row icon={IdCard} label={lang === "bn" ? "এনআইডি" : "NID"} value={profile.nid_number || "—"} bn={bn} />
          <Row icon={Users} label={lang === "bn" ? "পিতা" : "Father"} value={profile.father_name || "—"} bn={bn} />
          <Row icon={Users} label={lang === "bn" ? "মাতা" : "Mother"} value={profile.mother_name || "—"} bn={bn} />
        </div>
      </div>
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
        <div>
          <div className="text-[8px] uppercase opacity-70">{lang === "bn" ? "কার্ড নম্বর" : "Card No"}</div>
          <div className="font-mono text-sm font-bold tracking-widest">{formatted}</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] uppercase opacity-70">{lang === "bn" ? "মেয়াদ" : "Valid"}</div>
          <div className="font-mono text-[10px]">{fmtBn(card.issued_at, "en")} → {fmtBn(card.expires_at, "en")}</div>
        </div>
      </div>
    </div>
  );
}

function CardBack({ card, address, formatted, lang }: any) {
  const bn = lang === "bn" ? "font-bangla" : "";
  const bars = useMemo(() => Array.from(card.card_number as string).map((c, i) => ((c.charCodeAt(0) + i) % 5) + 1), [card.card_number]);
  return (
    <div className="relative h-40 overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
      <div className="h-6 -mx-4 bg-black/70" />
      <div className="mt-2">
        <div className={`flex items-center gap-1 text-[10px] uppercase opacity-80 ${bn}`}><MapPin className="h-3 w-3" /> {lang === "bn" ? "ঠিকানা" : "Address"}</div>
        <div className={`mt-0.5 text-xs leading-snug ${bn}`}>{address}</div>
      </div>
      <div className="absolute bottom-3 left-4 right-4">
        <div className="flex h-10 items-end gap-[2px] rounded bg-white p-1.5">
          {bars.map((w, i) => <div key={i} style={{ width: `${w}px` }} className="h-full bg-black" />)}
        </div>
        <div className="mt-1 text-center font-mono text-[10px] tracking-widest">{formatted}</div>
      </div>
    </div>
  );
}

function OverviewTab({ card, txs, totalReceived, lang }: { card: Card; txs: Tx[]; totalReceived: number; lang: "bn" | "en" }) {
  const bn = lang === "bn" ? "font-bangla" : "";
  const yearsActive = Math.max(1, Math.floor((Date.now() - new Date(card.issued_at).getTime()) / (365 * 86400000)) || 0);
  const wd = txs.filter((t) => t.type === "withdrawal" && t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <StatBox label={lang === "bn" ? "মোট প্রাপ্ত" : "Total Received"} value={`৳${totalReceived.toFixed(0)}`} />
        <StatBox label={lang === "bn" ? "মোট উত্তোলন" : "Total Withdrawn"} value={`৳${wd.toFixed(0)}`} />
        <StatBox label={lang === "bn" ? "শুরু" : "Started"} value={fmtBn(card.issued_at, lang)} />
        <StatBox label={lang === "bn" ? "মেয়াদ শেষ" : "Expires"} value={fmtBn(card.expires_at, lang)} />
      </div>
      <div className={`rounded-xl bg-primary/5 p-3 text-xs text-foreground ${bn}`}>
        {lang === "bn" ? `আপনার কার্ড ${yearsActive} বছর+ ধরে সক্রিয়। মোট ${txs.length} টি লেনদেন।` : `Your card has been active for ${yearsActive}+ year(s). ${txs.length} total transactions.`}
      </div>
    </div>
  );
}

function WithdrawTab({ card, profile, userId, onDone, lang }: { card: Card; profile: any; userId: string; onDone: () => void; lang: "bn" | "en" }) {
  const bn = lang === "bn" ? "font-bangla" : "";
  const [form, setForm] = useState({
    amount: "",
    name: profile?.full_name ?? "",
    nid: profile?.nid_number ?? "",
    birthdate: profile?.date_of_birth ?? "",
    method: "bKash",
    number: "",
    isOwn: true,
  });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return toast.error(lang === "bn" ? "সঠিক পরিমাণ দিন" : "Enter valid amount");
    if (amt > Number(card.balance)) return toast.error(lang === "bn" ? "ব্যালেন্স অপর্যাপ্ত" : "Insufficient balance");
    if (!form.number.trim()) return toast.error(lang === "bn" ? "পেমেন্ট নম্বর দিন" : "Enter payment number");
    setSubmitting(true);
    const { error } = await supabase.from("smart_card_transactions").insert({
      card_id: card.id, user_id: userId,
      type: "withdrawal", amount: amt, status: "pending",
      payment_method: form.method, payment_number: form.number.trim(),
      is_own_number: form.isOwn, request_name: form.name, request_nid: form.nid,
      request_birthdate: form.birthdate || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(lang === "bn" ? "রিকোয়েস্ট জমা হয়েছে (পেন্ডিং)" : "Request submitted (pending)");
    setForm({ ...form, amount: "", number: "" });
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <F label={lang === "bn" ? "পরিমাণ (৳)" : "Amount (৳)"}>
        <input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="sc-in" placeholder={`Max ৳${Number(card.balance).toFixed(0)}`} required />
      </F>
      <F label={lang === "bn" ? "নাম" : "Name"}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="sc-in" required maxLength={100} />
      </F>
      <div className="grid grid-cols-2 gap-2">
        <F label={lang === "bn" ? "এনআইডি" : "NID"}><input value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} className="sc-in" maxLength={20} /></F>
        <F label={lang === "bn" ? "জন্ম তারিখ" : "DOB"}><input type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} className="sc-in" /></F>
      </div>
      <div className={`rounded-lg bg-muted/40 px-2 py-1.5 text-[11px] font-mono ${bn}`}>
        <span className="opacity-70">{lang === "bn" ? "কার্ড নম্বর:" : "Card No:"}</span> {card.card_number}
      </div>
      <F label={lang === "bn" ? "পেমেন্ট মাধ্যম" : "Payment Method"}>
        <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="sc-in">
          <option>bKash</option><option>Nagad</option><option>Rocket</option><option>Upay</option><option>Bank</option>
        </select>
      </F>
      <F label={lang === "bn" ? "পেমেন্ট নম্বর" : "Payment Number"}>
        <input inputMode="tel" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="sc-in" placeholder="01XXXXXXXXX" maxLength={20} required />
      </F>
      <label className={`flex items-center gap-2 text-xs ${bn}`}>
        <input type="checkbox" checked={form.isOwn} onChange={(e) => setForm({ ...form, isOwn: e.target.checked })} className="h-4 w-4 accent-[color:var(--primary)]" />
        {lang === "bn" ? "এই নম্বরটি আমার নিজের" : "This number belongs to me"}
      </label>
      <button type="submit" disabled={submitting} className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 ${bn}`}>
        <Send className="h-4 w-4" /> {lang === "bn" ? "রিকোয়েস্ট পাঠান" : "Submit Request"}
      </button>
      <style>{`.sc-in{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none}.sc-in:focus{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 25%,transparent)}`}</style>
    </form>
  );
}

function TxList({ txs, lang, emptyMsg }: { txs: Tx[]; lang: "bn" | "en"; emptyMsg: string }) {
  const bn = lang === "bn" ? "font-bangla" : "";
  if (txs.length === 0) return <div className={`rounded-xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground ${bn}`}>{emptyMsg}</div>;
  return (
    <div className="space-y-2">
      {txs.map((t) => {
        const inflow = t.type === "government_payment";
        const StatusIcon = t.status === "pending" ? Clock : t.status === "rejected" ? XCircle : CheckCircle2;
        const statusColor = t.status === "pending" ? "text-[color:var(--saffron-foreground)]" : t.status === "rejected" ? "text-destructive" : "text-primary";
        return (
          <div key={t.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className={`flex items-center gap-1.5 text-sm font-bold ${bn}`}>
                  {inflow ? <Wallet className="h-3.5 w-3.5 text-primary" /> : <Send className="h-3.5 w-3.5 text-[color:var(--saffron-foreground)]" />}
                  {inflow ? (lang === "bn" ? "সরকারি পেমেন্ট" : "Government Payment") : (lang === "bn" ? "উত্তোলন" : "Withdrawal")}
                </div>
                {!inflow && (
                  <div className={`mt-0.5 text-[11px] text-muted-foreground ${bn}`}>
                    {t.payment_method} · {t.payment_number}
                  </div>
                )}
                <div className="mt-0.5 text-[10px] text-muted-foreground">{fmtBn(t.created_at, lang)}</div>
              </div>
              <div className="text-right">
                <div className={`text-base font-extrabold ${inflow ? "text-primary" : "text-foreground"}`}>{inflow ? "+" : "−"}৳{Number(t.amount).toFixed(0)}</div>
                <div className={`mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase ${statusColor} ${bn}`}>
                  <StatusIcon className="h-3 w-3" /> {t.status}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Row({ icon: Icon, label, value, bn }: { icon: any; label: string; value: string; bn: string }) {
  return (
    <div className="flex items-start gap-1.5 text-[10px] leading-tight">
      <Icon className="mt-0.5 h-2.5 w-2.5 shrink-0 opacity-70" />
      <div className="min-w-0 flex-1"><span className={`opacity-70 ${bn}`}>{label}: </span><span className={`font-semibold ${bn}`}>{value}</span></div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  const { lang } = useLang();
  return <label className="block"><span className={`mb-1 block text-xs font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{label}</span>{children}</label>;
}

function StatBox({ label, value }: { label: string; value: string }) {
  const { lang } = useLang();
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className={`text-[10px] font-semibold uppercase text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{label}</div>
      <div className="mt-0.5 text-sm font-extrabold text-primary">{value}</div>
    </div>
  );
}
