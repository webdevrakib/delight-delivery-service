import { useLang } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "bn" ? "en" : "bn")}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent ${className}`}
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "bn" ? "বাংলা" : "EN"}
    </button>
  );
}
