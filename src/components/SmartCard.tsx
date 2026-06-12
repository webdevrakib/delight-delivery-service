import { useState, useMemo } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Sprout, User, Calendar, IdCard, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

const smartCardQuery = queryOptions({
  queryKey: ["smart-card-profile"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("id,full_name,date_of_birth,nid_number,nid_name,nid_address,father_name,mother_name,district,upazila,village,avatar_url")
      .eq("id", userData.user.id)
      .maybeSingle();
    return data;
  },
});

// Deterministic 10-digit number from uuid
function uuidTo10Digit(uuid: string): string {
  let hash = 0n;
  for (const ch of uuid.replace(/-/g, "")) {
    hash = (hash * 31n + BigInt(ch.charCodeAt(0))) % 9000000000n;
  }
  return String(1000000000n + hash).padStart(10, "0");
}

// Simple barcode bars from string
function BarcodeStrip({ value }: { value: string }) {
  const bars = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      arr.push(((code % 5) + 1));
      arr.push((((code >> 2) % 4) + 1));
    }
    return arr;
  }, [value]);
  return (
    <div className="flex h-12 items-end gap-[2px] rounded bg-white p-2">
      {bars.map((w, i) => (
        <div key={i} style={{ width: `${w}px` }} className="h-full bg-black" />
      ))}
    </div>
  );
}

export function SmartCard() {
  const { lang } = useLang();
  const { data: profile } = useSuspenseQuery(smartCardQuery);
  const [flipped, setFlipped] = useState(false);
  const bn = lang === "bn" ? "font-bangla" : "";

  if (!profile) return null;

  const cardNumber = uuidTo10Digit(profile.id);
  const formatted = cardNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  const name = profile.nid_name || profile.full_name || (lang === "bn" ? "কৃষক" : "Farmer");
  const dob = profile.date_of_birth
    ? new Date(profile.date_of_birth).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB")
    : "—";
  const address = profile.nid_address ||
    [profile.village, profile.upazila, profile.district].filter(Boolean).join(", ") ||
    "—";

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`text-sm font-bold text-foreground ${bn}`}>
          {lang === "bn" ? "স্মার্ট কৃষক কার্ড" : "Smart Farmer Card"}
        </h2>
        <Link to="/smart-card" className={`text-[11px] font-bold text-primary ${bn}`}>
          {lang === "bn" ? "বিস্তারিত →" : "Details →"}
        </Link>
      </div>
      <div
        className="smart-card-wrap"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((v) => !v)}
      >
        <div
          className="relative h-56 w-full cursor-pointer transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elevated)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--saffron)]/30 blur-2xl" />
            <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sprout className="h-4 w-4" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${bn}`}>
                  {lang === "bn" ? "কৃষি বন্ধু" : "Krishi Bondhu"}
                </span>
              </div>
              <span className="text-[9px] opacity-80">{lang === "bn" ? "কৃষক কার্ড" : "FARMER CARD"}</span>
            </div>

            <div className="relative mt-3 flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 overflow-hidden rounded-lg border-2 border-white/40 bg-white/20">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 opacity-70" />
                    </div>
                  )}
                </div>
                <div className={`mt-1 max-w-[70px] truncate text-center text-[8px] italic opacity-90 ${bn}`}>
                  {name}
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <Row icon={User} label={lang === "bn" ? "নাম" : "Name"} value={name} bn={bn} />
                <Row icon={Calendar} label={lang === "bn" ? "জন্ম" : "DOB"} value={dob} bn={bn} />
                <Row icon={IdCard} label={lang === "bn" ? "এনআইডি" : "NID"} value={profile.nid_number || "—"} bn={bn} />
                <Row icon={Users} label={lang === "bn" ? "পিতা" : "Father"} value={profile.father_name || "—"} bn={bn} />
                <Row icon={Users} label={lang === "bn" ? "মাতা" : "Mother"} value={profile.mother_name || "—"} bn={bn} />
              </div>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="text-[8px] uppercase opacity-70">{lang === "bn" ? "কার্ড নম্বর" : "Card No"}</div>
                <div className="font-mono text-sm font-bold tracking-widest">{formatted}</div>
              </div>
              <div className="text-[8px] opacity-70">{lang === "bn" ? "উল্টান →" : "TAP →"}</div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elevated)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="h-6 w-full -mx-4 bg-black/70" style={{ width: "calc(100% + 2rem)", marginLeft: "-1rem" }} />
            <div className="mt-3 space-y-2">
              <div>
                <div className={`flex items-center gap-1 text-[10px] uppercase opacity-80 ${bn}`}>
                  <MapPin className="h-3 w-3" /> {lang === "bn" ? "ঠিকানা" : "Address"}
                </div>
                <div className={`mt-0.5 text-xs leading-snug ${bn}`}>{address}</div>
              </div>
              {profile.nid_number && (
                <div>
                  <div className={`text-[10px] uppercase opacity-80 ${bn}`}>{lang === "bn" ? "এনআইডি" : "NID"}</div>
                  <div className="font-mono text-xs">{profile.nid_number}</div>
                </div>
              )}
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              <BarcodeStrip value={cardNumber} />
              <div className="mt-1 text-center font-mono text-[10px] tracking-widest">{formatted}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon: Icon, label, value, bn }: { icon: React.ElementType; label: string; value: string; bn: string }) {
  return (
    <div className="flex items-start gap-1.5 text-[10px] leading-tight">
      <Icon className="mt-0.5 h-2.5 w-2.5 shrink-0 opacity-70" />
      <div className="min-w-0 flex-1">
        <span className={`opacity-70 ${bn}`}>{label}: </span>
        <span className={`font-semibold ${bn}`}>{value}</span>
      </div>
    </div>
  );
}
