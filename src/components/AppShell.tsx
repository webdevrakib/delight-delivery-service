import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sprout, Newspaper, TrendingUp, User } from "lucide-react";
import { useLang, type dict as Dict } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";
import type { ReactNode } from "react";

type NavKey = keyof typeof Dict;
const items: { to: string; icon: typeof Home; label: NavKey }[] = [
  { to: "/app", icon: Home, label: "home" },
  { to: "/app/schemes", icon: Sprout, label: "schemes" },
  { to: "/app/tips", icon: Newspaper, label: "tips" },
  { to: "/app/market", icon: TrendingUp, label: "market" },
  { to: "/app/profile", icon: User, label: "profile" },
];

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { t } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-foreground">{t("appName")}</div>
              {title && <div className="text-xs text-muted-foreground">{title}</div>}
            </div>
          </div>
          <LangToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2 py-1.5">
          {items.map(({ to, icon: Icon, label }) => {
            const active = to === "/app" ? pathname === "/app" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active ? "bg-primary/12 text-primary" : ""
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className="leading-none">{t(label)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
