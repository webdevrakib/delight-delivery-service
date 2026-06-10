import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Newspaper, CloudSun, Bug, HelpCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const kbQuery = queryOptions({
  queryKey: ["krishi-bondhu"],
  queryFn: async () => {
    const [tips, questions] = await Promise.all([
      supabase.from("tips").select("*").order("created_at", { ascending: false }),
      supabase.auth.getUser().then(({ data }) =>
        data.user ? supabase.from("disease_questions").select("*").eq("farmer_id", data.user.id).order("created_at", { ascending: false }) : null
      ),
    ]);
    return { tips: tips.data ?? [], questions: questions?.data ?? [] };
  },
});

export const Route = createFileRoute("/_authenticated/krishi-bondhu")({
  head: () => ({ meta: [{ title: "কৃষক বন্ধু — পরামর্শ" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(kbQuery),
  component: () => <AppShell><Suspense fallback={null}><Page /></Suspense></AppShell>,
});

type Tab = "tips" | "weather" | "disease" | "advice";

function Page() {
  const { t, lang } = useLang();
  const { data } = useSuspenseQuery(kbQuery);
  const [tab, setTab] = useState<Tab>("tips");

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("krishiBondhu")}</h1>
        <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>কৃষি তথ্য, আবহাওয়া, রোগবালাই ও পরামর্শ</p>
      </div>

      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card p-1">
        {([
          ["tips", t("tipsTab"), Newspaper],
          ["weather", t("weatherTab"), CloudSun],
          ["disease", t("diseaseTab"), Bug],
          ["advice", lang === "bn" ? "পরামর্শ" : "Advice", Lightbulb],
        ] as [Tab, string, any][]).map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-bold transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"} ${lang === "bn" ? "font-bangla" : ""}`}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === "tips" && <TipsList tips={data.tips} />}
      {tab === "weather" && <WeatherPanel />}
      {tab === "disease" && <DiseasePanel questions={data.questions} />}
      {tab === "advice" && <AdvicePanel />}
    </div>
  );
}

function AdvicePanel() {
  const { lang } = useLang();
  const tips = [
    { t: "বীজ নির্বাচন ও শোধন", d: "উচ্চ ফলনশীল ও রোগমুক্ত বীজ বাছাই করুন। বপনের আগে ভিটাভ্যাক্স-২০০ (২.৫ গ্রাম/কেজি বীজ) দিয়ে শোধন করুন।" },
    { t: "বীজ বপনের সঠিক সময়", d: "মৌসুম অনুযায়ী বপন করুন—আমন: জুন-জুলাই, বোরো: নভেম্বর-ডিসেম্বর। সারি থেকে সারি ২০ সেমি, চারা থেকে চারা ১৫ সেমি দূরত্ব রাখুন।" },
    { t: "জমি প্রস্তুত ও সার প্রয়োগ", d: "৩-৪ বার চাষ ও মই দিয়ে জমি সমান করুন। শেষ চাষের সময় জৈব সার (৫ টন/হেক্টর) এবং TSP-MoP মিশিয়ে দিন। ইউরিয়া ৩ কিস্তিতে উপরিপ্রয়োগ করুন।" },
    { t: "চারা পরিচর্যা", d: "চারা রোপণের ৭-১০ দিন পর্যন্ত ২-৩ সেমি পানি ধরে রাখুন। মরা চারা পুনঃরোপণ করুন। নিয়মিত আগাছা পরিষ্কার রাখুন।" },
    { t: "সেচ ব্যবস্থাপনা", d: "কাইচ থোড় ও ফুল আসার সময় পানির ঘাটতি হতে দেবেন না। ধান পাকার ১০-১৫ দিন আগে সেচ বন্ধ করুন।" },
    { t: "সুষম সার ব্যবহার", d: "মাটি পরীক্ষার ভিত্তিতে সার দিন। অতিরিক্ত ইউরিয়া রোগবালাই ডেকে আনে। দস্তা ও সালফার ঘাটতি থাকলে আলাদা প্রয়োগ করুন।" },
    { t: "রোগের লক্ষণ চিনুন", d: "পাতায় দাগ দেখলে—গোলাকার বাদামি দাগ = ব্লাস্ট, হলুদ কিনারা = ব্যাকটেরিয়াল ব্লাইট, কমলা গুঁড়া = মরিচা রোগ। সাথে সাথে কৃষি কর্মকর্তার সাথে যোগাযোগ করুন।" },
    { t: "পোকামাকড় নিয়ন্ত্রণ", d: "মাজরা পোকার জন্য আলোর ফাঁদ ও ফেরোমন ফাঁদ ব্যবহার করুন। বাদামি গাছফড়িং দেখলে জমির পানি সরিয়ে দিন। সর্বশেষে ইমিডাক্লোপ্রিড স্প্রে করুন।" },
    { t: "জৈব পদ্ধতিতে রোগ প্রতিরোধ", d: "নিম পাতার নির্যাস (১ কেজি পাতা ১০ লিটার পানিতে) স্প্রে করলে অনেক পোকা দমন হয়। ফসল চক্র অনুসরণ করুন—একই জমিতে বারবার একই ফসল নয়।" },
    { t: "ফসল কাটা ও সংরক্ষণ", d: "৮০-৮৫% দানা পাকলে কাটুন। ভালোভাবে শুকিয়ে (১২-১৪% আর্দ্রতা) সংরক্ষণ করুন। গুদামে নিম পাতা রাখলে পোকা কম হয়।" },
  ];
  return (
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <details key={i} className="group rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <summary className={`flex cursor-pointer items-start gap-3 p-4 ${lang === "bn" ? "font-bangla" : ""}`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
            <div className="min-w-0 flex-1 text-sm font-bold text-foreground">{tip.t}</div>
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--saffron)]" />
          </summary>
          <p className={`border-t border-border px-4 py-3 text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{tip.d}</p>
        </details>
      ))}
    </div>
  );
}

function TipsList({ tips }: { tips: any[] }) {
  const { lang } = useLang();
  if (tips.length === 0) return <Empty msg="এখনো কোনো পরামর্শ নেই" />;
  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <article key={tip.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex items-stretch">
            <div className="w-1.5 shrink-0 bg-[image:var(--gradient-hero)]" />
            <div className="flex-1 p-4">
              <span className={`rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{tip.category}</span>
              <h3 className={`mt-2 text-base font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.title_bn : tip.title_en}</h3>
              <p className={`mt-1.5 text-sm leading-relaxed text-foreground/80 ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? tip.content_bn : tip.content_en}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function WeatherPanel() {
  const { lang } = useLang();
  const days = [
    { d: "আজ", temp: "৩১°/২৬°", w: "আংশিক মেঘলা", rain: "৪০%" },
    { d: "আগামীকাল", temp: "৩০°/২৫°", w: "বৃষ্টি", rain: "৭০%" },
    { d: "পরশু", temp: "২৯°/২৪°", w: "ভারী বৃষ্টি", rain: "৮৫%" },
    { d: "৪ দিন পর", temp: "৩১°/২৬°", w: "মেঘলা", rain: "৩০%" },
    { d: "৫ দিন পর", temp: "৩৩°/২৭°", w: "রোদ", rain: "১০%" },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase opacity-80 ${lang === "bn" ? "font-bangla" : ""}`}>আজ · বাংলাদেশ</div>
            <div className="text-4xl font-extrabold">৩১°</div>
            <div className={`text-sm ${lang === "bn" ? "font-bangla" : ""}`}>আংশিক মেঘলা · বৃষ্টির সম্ভাবনা ৪০%</div>
          </div>
          <CloudSun className="h-16 w-16 opacity-90" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card">
        {days.map((day, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
            <span className={`text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{day.d}</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{day.w}</span>
              <span className="text-sm font-bold">{day.temp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiseasePanel({ questions }: { questions: any[] }) {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState({ crop: "", question: "" });
  const [saving, setSaving] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("disease_questions").insert({
        farmer_id: u.user.id, crop: form.crop.trim(), question: form.question.trim(),
      });
      if (error) throw error;
      toast.success(t("questionSent"));
      setForm({ crop: "", question: "" });
      await qc.invalidateQueries({ queryKey: ["krishi-bondhu"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authError"));
    } finally {
      setSaving(false);
    }
  }

  const diseases = [
    {
      name: "ধানের ব্লাস্ট রোগ",
      crop: "ধান",
      symptom: "পাতায় ধূসর-সাদা দাগ, কিনারা বাদামি। শীষে আক্রমণে দানা চিটা হয়।",
      remedy: "ট্রাইসাইক্লাজল ৭৫% WP প্রতি লিটার পানিতে ০.৬ গ্রাম মিশিয়ে স্প্রে করুন। বীজ শোধন করুন এবং অতিরিক্ত ইউরিয়া পরিহার করুন।",
    },
    {
      name: "ধানের ব্যাকটেরিয়াল লিফ ব্লাইট",
      crop: "ধান",
      symptom: "পাতার কিনারা থেকে হলুদ-সাদা দাগ শুরু হয়ে শুকিয়ে যায়।",
      remedy: "আক্রান্ত পাতা কেটে পুড়িয়ে ফেলুন। কপার অক্সিক্লোরাইড ৫ গ্রাম/লিটার স্প্রে। পানি নিষ্কাশন নিশ্চিত করুন।",
    },
    {
      name: "টমেটোর লেট ব্লাইট",
      crop: "টমেটো",
      symptom: "পাতা ও ফলে কালো-বাদামি দাগ, নিচে সাদা ছত্রাকের আবরণ।",
      remedy: "ম্যানকোজেব ৮০% WP ২ গ্রাম/লিটার পানিতে ৭ দিন পর পর স্প্রে। গাছের গোড়া শুকনো রাখুন।",
    },
    {
      name: "বেগুনের ডগা ও ফল ছিদ্রকারী পোকা",
      crop: "বেগুন",
      symptom: "ডগা শুকিয়ে যায়, ফলের ভেতরে পোকা ঢুকে গর্ত করে।",
      remedy: "আক্রান্ত ডগা ও ফল কেটে ধ্বংস করুন। ফেরোমন ফাঁদ ব্যবহার করুন। প্রয়োজনে কারটাপ ৫০ SP ২ গ্রাম/লিটার স্প্রে।",
    },
    {
      name: "আলুর আগাম ধ্বসা",
      crop: "আলু",
      symptom: "পাতায় বৃত্তাকার বাদামি দাগ, দাগের মধ্যে চক্রাকার দাগ থাকে।",
      remedy: "ম্যানকোজেব ০.২% হারে স্প্রে। আক্রান্ত পাতা সংগ্রহ করে নষ্ট করুন। সুষম সার ব্যবহার করুন।",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className={`mb-2 text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>সাধারণ রোগবালাই ও প্রতিকার</h3>
        <div className="space-y-2">
          {diseases.map((d) => (
            <details key={d.name} className="group rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
              <summary className={`flex cursor-pointer items-start gap-2 p-4 ${lang === "bn" ? "font-bangla" : ""}`}>
                <Bug className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">{d.name}</div>
                  <div className="mt-0.5 text-[11px] font-semibold uppercase text-muted-foreground">{d.crop}</div>
                </div>
              </summary>
              <div className={`space-y-2 border-t border-border px-4 py-3 ${lang === "bn" ? "font-bangla" : ""}`}>
                <div>
                  <div className="text-[11px] font-bold uppercase text-muted-foreground">লক্ষণ</div>
                  <p className="text-sm text-foreground/85">{d.symptom}</p>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-primary">প্রতিকার / করণীয়</div>
                  <p className="text-sm text-foreground/85">{d.remedy}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>


      <form onSubmit={ask} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className={`flex items-center gap-2 text-base font-bold ${lang === "bn" ? "font-bangla" : ""}`}>
          <HelpCircle className="h-4 w-4 text-primary" /> {t("askQuestion")}
        </div>
        <input required placeholder={t("crop")} className="ip" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} maxLength={60} />
        <textarea required placeholder={t("yourQuestion")} className={`ip ${lang === "bn" ? "font-bangla" : ""}`} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} rows={3} maxLength={500} />
        <button disabled={saving} className={`w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60 ${lang === "bn" ? "font-bangla" : ""}`}>{saving ? t("loading") : t("submit")}</button>
      </form>

      {questions.length > 0 && (
        <div>
          <h3 className={`mb-2 text-sm font-bold ${lang === "bn" ? "font-bangla" : ""}`}>{t("myQuestions")}</h3>
          <div className="space-y-2">
            {questions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-4">
                <div className={`text-[11px] font-bold uppercase text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{q.crop}</div>
                <p className={`mt-1 text-sm font-semibold ${lang === "bn" ? "font-bangla" : ""}`}>{q.question}</p>
                {q.answer ? (
                  <div className={`mt-2 rounded-xl bg-primary/5 p-3 text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{q.answer}</div>
                ) : (
                  <div className={`mt-2 text-xs italic text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{t("pendingAnswer")}…</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`.ip{width:100%;border-radius:.625rem;background:var(--background);border:1px solid var(--border);padding:.55rem .75rem;font-size:.875rem;color:var(--foreground);outline:none}.ip:focus{border-color:var(--ring)}`}</style>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  const { lang } = useLang();
  return <div className={`rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{msg}</div>;
}
