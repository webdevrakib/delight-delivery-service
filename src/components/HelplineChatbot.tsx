import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type Step = "intro" | "name" | "phone" | "location" | "problem" | "submitting" | "done";

type Msg = { role: "bot" | "user"; text: string };

export function HelplineChatbot() {
  const { lang } = useLang();
  const bn = lang === "bn";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [input, setInput] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", location: "", problem: "" });
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: bn
        ? "আসসালামু আলাইকুম! আমি কৃষি বন্ধু হেল্পলাইন। আপনার সমস্যা সমাধানে সাহায্য করতে চাই। শুরু করতে আপনার নাম লিখুন।"
        : "Hi! I'm Krishi Bondhu Helpline. To start, please tell me your name.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === "intro") setStep("name");
  }, [step]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    // Prefill from profile when opened
    if (!open) return;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, district, village")
        .eq("id", u.user.id)
        .maybeSingle();
      if (data) {
        setForm((f) => ({
          name: f.name || data.full_name || "",
          phone: f.phone || data.phone || "",
          location: f.location || [data.village, data.district].filter(Boolean).join(", "),
          problem: f.problem,
        }));
      }
    })();
  }, [open]);

  const ask = (text: string) => setMsgs((m) => [...m, { role: "bot", text }]);
  const said = (text: string) => setMsgs((m) => [...m, { role: "user", text }]);

  const handleSend = async () => {
    const value = input.trim();
    if (!value || step === "submitting" || step === "done") return;
    said(value);
    setInput("");

    if (step === "name") {
      setForm((f) => ({ ...f, name: value }));
      setStep("phone");
      ask(bn ? "ধন্যবাদ! এবার আপনার ফোন নম্বর দিন।" : "Thanks! Now share your phone number.");
    } else if (step === "phone") {
      setForm((f) => ({ ...f, phone: value }));
      setStep("location");
      ask(bn ? "আপনার ঠিকানা/এলাকা লিখুন (গ্রাম, উপজেলা, জেলা)।" : "Share your location (village, upazila, district).");
    } else if (step === "location") {
      setForm((f) => ({ ...f, location: value }));
      setStep("problem");
      ask(bn ? "এখন আপনার সমস্যাটি বিস্তারিত লিখুন।" : "Now describe your problem in detail.");
    } else if (step === "problem") {
      const finalForm = { ...form, problem: value };
      setForm(finalForm);
      setStep("submitting");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        ask(bn ? "দুঃখিত, আগে লগইন করুন।" : "Please sign in first.");
        setStep("problem");
        return;
      }
      const { error } = await supabase.from("helpline_tickets" as any).insert({
        user_id: u.user.id,
        name: finalForm.name,
        phone: finalForm.phone,
        location: finalForm.location,
        problem: finalForm.problem,
      });
      if (error) {
        ask((bn ? "সমস্যা হয়েছে: " : "Error: ") + error.message);
        setStep("problem");
      } else {
        ask(
          bn
            ? "✓ আপনার সমস্যা সফলভাবে জমা হয়েছে। আমাদের টিম শীঘ্রই উত্তর দিবে এবং উত্তরটি আপনার নোটিফিকেশনে চলে আসবে।"
            : "✓ Submitted! Our team will reply soon and you'll receive a notification.",
        );
        setStep("done");
      }
    }
  };

  const reset = () => {
    setForm({ name: "", phone: "", location: "", problem: "" });
    setStep("name");
    setMsgs([
      {
        role: "bot",
        text: bn ? "নতুন সমস্যা জানাতে আপনার নাম লিখুন।" : "To submit a new issue, share your name.",
      },
    ]);
  };

  return (
    <>
      {!open && (
        <>
          <a
            href="https://rakibulalams.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-44 right-4 z-40 rounded-full border border-primary/30 bg-card px-3 py-1 text-[11px] font-bold text-primary shadow-[var(--shadow-soft)] hover:bg-primary hover:text-primary-foreground transition"
          >
            Developed by <span className="underline">Rakib</span>
          </a>
          <div className="fixed bottom-24 right-4 z-40 flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className={`animate-pulse rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-bold text-primary shadow-[var(--shadow-soft)] ${bn ? "font-bangla" : ""}`}
            >
              {bn ? "সাহায্য দরকার?" : "Need help?"}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Helpline"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-95"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          </div>
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="flex h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-card shadow-2xl sm:h-[600px] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border bg-[image:var(--gradient-hero)] px-4 py-3 text-primary-foreground rounded-t-3xl sm:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${bn ? "font-bangla" : ""}`}>
                    {bn ? "হেল্পলাইন সাপোর্ট" : "Helpline Support"}
                  </div>
                  <div className={`text-[11px] opacity-90 ${bn ? "font-bangla" : ""}`}>
                    {bn ? "সাধারণত কয়েক ঘণ্টায় উত্তর" : "Typically replies in hours"}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/20" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${bn ? "font-bangla" : ""} ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {step === "submitting" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> {bn ? "পাঠানো হচ্ছে..." : "Submitting..."}
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              {step === "done" ? (
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-1.5 text-xs text-primary ${bn ? "font-bangla" : ""}`}>
                    <CheckCircle2 className="h-4 w-4" /> {bn ? "জমা হয়েছে" : "Submitted"}
                  </div>
                  <button
                    onClick={reset}
                    className={`rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold ${bn ? "font-bangla" : ""}`}
                  >
                    {bn ? "নতুন প্রশ্ন" : "New ticket"}
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={step === "problem" ? 3 : 1}
                    placeholder={
                      step === "name"
                        ? bn ? "আপনার নাম" : "Your name"
                        : step === "phone"
                          ? bn ? "ফোন নম্বর" : "Phone number"
                          : step === "location"
                            ? bn ? "ঠিকানা" : "Location"
                            : bn ? "আপনার সমস্যা বিস্তারিত লিখুন..." : "Describe your problem..."
                    }
                    className={`flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${bn ? "font-bangla" : ""}`}
                    disabled={step === "submitting"}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || step === "submitting"}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
