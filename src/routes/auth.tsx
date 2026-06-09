import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login — Krishi Bondhu" }, { name: "description", content: "Sign in or create your farmer account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success(t("signupCheckEmail"));
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("authError");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
      if (result.error) { toast.error(t("authError")); return; }
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(60% 50% at 50% 0%, var(--primary-glow) 0%, transparent 60%)" }} />
      <div className="absolute right-4 top-4"><LangToggle /></div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">{t("appName")}</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)]">
          <h1 className={`text-2xl font-bold tracking-tight text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
            {mode === "login" ? t("login") : t("signup")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent disabled:opacity-60"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            {t("continueWithGoogle")}
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> {t("or")} <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={UserIcon} label={t("fullName")}>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" />
              </Field>
            )}
            <Field icon={Mail} label={t("email")}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </Field>
            <Field icon={Lock} label={t("password")}>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t("signingIn") : mode === "login" ? t("login") : t("signup")}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "login" ? t("noAccount") : t("haveAccount")}{" "}
            <span className="font-semibold text-primary">{mode === "login" ? t("signup") : t("login")}</span>
          </button>
        </div>
      </div>
      <style>{`.input-field { width:100%; border-radius:0.625rem; background:var(--background); border:1px solid var(--border); padding:0.625rem 0.75rem 0.625rem 2.25rem; font-size:0.875rem; color:var(--foreground); outline:none; transition:border-color .15s; }
      .input-field:focus { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 25%, transparent); }`}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.95l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
