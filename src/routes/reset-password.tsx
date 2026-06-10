import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset password — Krishok Bondhu" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts recovery tokens in URL hash; the client picks them up automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // also accept existing session
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error(lang === "bn" ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(lang === "bn" ? "পাসওয়ার্ড পরিবর্তন হয়েছে" : "Password updated");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Krishok Bondhu</span>
        </Link>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)]">
          <h1 className="text-2xl font-bold">{lang === "bn" ? "নতুন পাসওয়ার্ড" : "Set new password"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ready
              ? (lang === "bn" ? "নতুন পাসওয়ার্ড দিন" : "Enter your new password below")
              : (lang === "bn" ? "লিঙ্ক যাচাই করা হচ্ছে…" : "Verifying link…")}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{lang === "bn" ? "নতুন পাসওয়ার্ড" : "New password"}</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[0.625rem] border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{lang === "bn" ? "নিশ্চিত করুন" : "Confirm password"}</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-[0.625rem] border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring" />
              </div>
            </label>
            <button type="submit" disabled={loading || !ready}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {lang === "bn" ? "পাসওয়ার্ড সংরক্ষণ" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
