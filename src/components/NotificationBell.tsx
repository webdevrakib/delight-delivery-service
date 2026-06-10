import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function NotificationBell() {
  const qc = useQueryClient();
  const { data: count = 0 } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return 0;
      const { count, error } = await supabase
        .from("notifications" as any)
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", u.user.id)
        .eq("read", false);
      if (error) return 0;
      return count ?? 0;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      channel = supabase
        .channel(`notif-${u.user.id}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_id=eq.${u.user.id}` }, () => {
          qc.invalidateQueries({ queryKey: ["notifications-unread"] });
          qc.invalidateQueries({ queryKey: ["notifications"] });
        })
        .subscribe();
    })();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [qc]);

  return (
    <Link to="/notifications" aria-label="Notifications" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-muted">
      <Bell className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
