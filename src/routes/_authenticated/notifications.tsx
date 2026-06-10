import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { Bell, Phone, MessageCircle, Sprout, ChevronDown, ChevronUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const notifQuery = queryOptions({
  queryKey: ["notifications"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return [];
    const { data, error } = await supabase
      .from("notifications" as any)
      .select("*")
      .eq("recipient_id", u.user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data ?? []) as any[];
  },
});

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "নোটিফিকেশন — কৃষি বন্ধু" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(notifQuery),
  component: () => (
    <AppShell title="নোটিফিকেশন" showBack>
      <Suspense fallback={null}><Page /></Suspense>
    </AppShell>
  ),
});

function Page() {
  const { lang } = useLang();
  const { data } = useSuspenseQuery(notifQuery);
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      await supabase.from("notifications" as any).update({ read: true }).eq("recipient_id", u.user.id).eq("read", false);
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    })();
  }, [qc]);

  if (!data.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
        <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
        {lang === "bn" ? "এখনো কোনো নোটিফিকেশন নেই" : "No notifications yet"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((n) => {
        const isOpen = openId === n.id;
        const wa = (n.sender_phone || "").replace(/\D/g, "");
        return (
          <div key={n.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <button onClick={() => setOpenId(isOpen ? null : n.id)} className="flex w-full items-start gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sprout className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                  {n.sender_name || (lang === "bn" ? "একজন ক্রেতা" : "A buyer")}
                </div>
                <p className={`mt-0.5 text-xs text-foreground/80 ${lang === "bn" ? "font-bangla" : ""}`}>{n.message}</p>
                {n.listing_crop && (
                  <div className={`mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{n.listing_crop}</div>
                )}
                <div className="mt-1 text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {n.sender_phone ? (
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${n.sender_phone}`} className={`flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                      <Phone className="h-4 w-4" /> {lang === "bn" ? "কল করুন" : "Call"}
                    </a>
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-xl border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3 py-2.5 text-xs font-bold text-[color:var(--saffron-foreground)] ${lang === "bn" ? "font-bangla" : ""}`}>
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </div>
                ) : (
                  <p className={`text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{lang === "bn" ? "ফোন নম্বর পাওয়া যায়নি" : "No phone number provided"}</p>
                )}
                {n.listing_id && (
                  <Link to="/sell/listing/$listingId" params={{ listingId: n.listing_id }} className={`block rounded-xl border border-border bg-background px-3 py-2 text-center text-xs font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                    {lang === "bn" ? "ফসল listing দেখুন" : "View listing"}
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
