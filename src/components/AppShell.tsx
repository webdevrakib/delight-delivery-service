import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Home, Tractor, ShoppingBag, Leaf, User, ArrowLeft, Sprout } from "lucide-react";
import { useLang, type dict as Dict } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";
import type { ReactNode } from "react";

type NavKey = keyof typeof Dict;
const items: { to: string; icon: typeof Home; label: NavKey }[] = [
  { to: "/dashboard", icon: Home, label: "home" },
  { to: "/machines", icon: Tractor, label: "machines" },
  { to: "/sell", icon: ShoppingBag, label: "sell" },
  { to: "/krishi-bondhu", icon: Leaf, label: "krishiBondhu" },
  { to: "/profile", icon: User, label: "profile" },
];

export function AppShell({
  title,
  showBack = false,
  children,
}: {
  title?: string;
  showBack?: boolean;
  children: ReactNode;
}) {
  const { t, lang } = useLang();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-3 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {showBack ? (
              <button
                onClick={handleBack}
                aria-label={t("back")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-muted active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div className="min-w-0 leading-tight">
              <div className={`truncate text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                {title || t("appName")}
              </div>
              {title && (
                <div className={`truncate text-[11px] text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                  {t("appName")}
                </div>
              )}
            </div>
          </div>
          <LangToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between px-1 py-1.5">
          {items.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    active ? "bg-primary/12 text-primary" : ""
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className={`leading-none ${lang === "bn" ? "font-bangla" : ""}`}>{t(label)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
