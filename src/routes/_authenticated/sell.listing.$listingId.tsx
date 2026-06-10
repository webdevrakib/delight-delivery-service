import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { Sprout, MapPin, Phone, MessageCircle, User as UserIcon, Package } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const listingQuery = (id: string) =>
  queryOptions({
    queryKey: ["farmer-listing", id],
    queryFn: async () => {
      const { data: l, error } = await supabase.from("farmer_crop_listings").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!l) return null;
      const { data: seller } = await supabase
        .from("profiles")
        .select("id, full_name, phone, district, village, avatar_url")
        .eq("id", l.farmer_id)
        .maybeSingle();
      return { ...l, seller };
    },
  });

export const Route = createFileRoute("/_authenticated/sell/listing/$listingId")({
  head: () => ({ meta: [{ title: "ফসলের বিস্তারিত — কৃষি বন্ধু" }] }),
  loader: ({ params, context }) => context.queryClient.ensureQueryData(listingQuery(params.listingId)),
  component: () => (
    <AppShell title="ফসলের বিস্তারিত" showBack>
      <Suspense fallback={null}><Detail /></Suspense>
    </AppShell>
  ),
});

function Detail() {
  const { lang } = useLang();
  const { listingId } = Route.useParams();
  const { data: l } = useSuspenseQuery(listingQuery(listingId));

  if (!l) {
    return (
      <div className={`rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
        {lang === "bn" ? "ফসল পাওয়া যায়নি" : "Listing not found"}
      </div>
    );
  }

  const seller = l.seller as any;
  const isCompany = (l as any).seller_type === "company";
  const phone = ((l as any).contact_phone as string | undefined) || (seller?.phone as string | undefined);
  const waNumber = phone?.replace(/\D/g, "");
  const sellerName = isCompany ? ((l as any).company_name || (lang === "bn" ? "প্রতিষ্ঠান" : "Company")) : (seller?.full_name || (lang === "bn" ? "কৃষক" : "Farmer"));

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elevated)]">
        {l.image_url ? (
          <img src={l.image_url} alt={l.crop} className="h-48 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center bg-[image:var(--gradient-hero)] text-primary-foreground">
            <Sprout className="h-14 w-14" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className={`text-2xl font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>{l.crop}</h1>
            <span className="rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">৳{l.price_per_unit}/{l.unit}</span>
          </div>
          <div className={`mt-3 grid grid-cols-2 gap-3 text-sm ${lang === "bn" ? "font-bangla" : ""}`}>
            <Info icon={Package} label={lang === "bn" ? "পরিমাণ" : "Quantity"} value={`${l.quantity} ${l.unit}`} />
            {l.area && <Info icon={MapPin} label={lang === "bn" ? "জমির এলাকা" : "Area"} value={l.area} />}
          </div>
          {l.description && (
            <p className={`mt-4 whitespace-pre-wrap text-sm text-foreground/85 ${lang === "bn" ? "font-bangla" : ""}`}>{l.description}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className={`text-sm font-bold uppercase tracking-wider text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
          {lang === "bn" ? "বিক্রেতার তথ্য" : "Seller"}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground">
            {seller?.avatar_url ? <img src={seller.avatar_url} alt="" className="h-full w-full object-cover" /> : <UserIcon className="h-6 w-6" />}
          </div>
          <div className="min-w-0">
            <div className={`flex items-center gap-2 truncate text-base font-bold text-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
              {sellerName}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isCompany ? "bg-[color:var(--saffron)]/15 text-[color:var(--saffron-foreground)]" : "bg-primary/10 text-primary"} ${lang === "bn" ? "font-bangla" : ""}`}>
                {isCompany ? (lang === "bn" ? "প্রতিষ্ঠান" : "Company") : (lang === "bn" ? "কৃষক" : "Farmer")}
              </span>
            </div>
            {(seller?.district || seller?.village) && (
              <div className={`mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
                <MapPin className="h-3 w-3" />{seller?.village ? `${seller.village}, ` : ""}{seller?.district}
              </div>
            )}
          </div>
        </div>

        {phone ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a href={`tel:${phone}`} className={`flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
              <Phone className="h-4 w-4" /> {lang === "bn" ? "কল করুন" : "Call"}
            </a>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-xl border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3 py-3 text-sm font-bold text-[color:var(--saffron-foreground)] ${lang === "bn" ? "font-bangla" : ""}`}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        ) : (
          <p className={`mt-4 text-xs text-muted-foreground ${lang === "bn" ? "font-bangla" : ""}`}>
            {lang === "bn" ? "যোগাযোগের নম্বর নেই" : "No contact number available"}
          </p>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground"><Icon className="h-3 w-3" />{label}</div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
