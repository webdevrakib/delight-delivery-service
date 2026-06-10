import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (s: string) => s.replace(/\d/g, (d) => BN_DIGITS[+d]);

const fmtTime = (lang: "bn" | "en") =>
  new Intl.DateTimeFormat(lang === "bn" ? "en-GB" : "en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
const fmtDate = (lang: "bn" | "en") =>
  new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

export function LiveClock({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  const time = fmtTime(lang).format(now);
  const date = fmtDate(lang).format(now);
  return (
    <div className={`flex items-center justify-between rounded-xl bg-foreground/5 px-3 py-2 ${className}`}>
      <div className={`text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
        {lang === "bn" ? `বাংলাদেশ সময় · ${date}` : `Bangladesh time · ${date}`}
      </div>
      <div className="font-mono text-base font-extrabold tabular-nums text-foreground">
        {lang === "bn" ? toBn(time) : time}
      </div>
    </div>
  );
}
