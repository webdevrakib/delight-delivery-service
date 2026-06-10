# Plan: হোম clock, বাজারদর expand, ফসল বিক্রি/ক্রয়, যন্ত্র যোগ/ভাড়া

## 1. হোম পেজ (Home)

**লাইভ ঘড়ি** — আবহাওয়ার ৩১° কার্ডের উপরে বাংলাদেশ time (Asia/Dhaka) লাইভ চলবে — তারিখ + ঘন্টা:মিনিট:সেকেন্ড, প্রতি সেকেন্ডে update.

**আজকের বাজারদর** — উপরে শুধু top ৩-৪টি (ধান summary সহ). পাশে arrow button — click করলে `/market` route এ যাবে, যেখানে সব ধানের (আমন, বোরো, ইরি, ব্রি-২৮ ইত্যাদি) পূর্ণ list দেখাবে, district filter সহ।

## 2. ফসল বিক্রি Tab (`/sell`)

উপরে দুটি বড় button:

```text
[ ফসল বিক্রি করুন ]   [ ফসল ক্রয় করুন ]
```

### ফসল বিক্রি করুন (নতুন — কৃষক নিজে listing দিবে)
- "+ ফসল যোগ করুন" button → form: ফসল (ধান/পাট/আলু/গম/ভুট্টা/সবজি), পরিমাণ (কেজি/মণ), দাম, এলাকা, বিবরণ, ছবি
- কৃষকের নিজের active listings এই পেজে কার্ড আকারে দেখাবে — edit/delete/বিক্রিত mark করার option
- বিক্রিত হলে sales history তে চলে যাবে

### ফসল ক্রয় করুন (existing buyers grid, refined)
- করিম Enterprise, রহিমের আরত, ACI Business, সিলেট Fresh Market — ছবি/logo সহ card
- কোন পণ্য কত দামে কিনছে summary
- Card click → buyer detail page (`/sell/$buyerId`) — তাদের পণ্যের list, দাম, location, "যোগাযোগ করুন" (Call + WhatsApp button)

### Profile তে integration
- "আমার listings" section — active বিক্রির listings
- "বিক্রির ইতিহাস" — already আছে, sold items এখানে দেখাবে

## 3. যন্ত্র Tab (`/machines`)

উপরে দুটি button:

```text
[ যন্ত্র ভাড়া করুন ]   [ যন্ত্র যোগ করুন ]
```

- **যন্ত্র ভাড়া করুন** (default view): অন্যদের list করা সব যন্ত্র category-wise (ধান কাটা, মাড়াই, ট্রাক্টর, পাওয়ার টিলার). card click → `/machines/$id` detail
- **যন্ত্র যোগ করুন**: form — যন্ত্রের নাম, type, ঘন্টা প্রতি দাম, দিন প্রতি দাম, এলাকা, available date, ছবি, ফোন
- Detail page: ছবি, owner, এলাকা, ঘন্টা rate, দিন rate, "যোগাযোগ করুন" (call + booking request)

## Technical

### Database (migration)
- নতুন table `farmer_crop_listings` — farmer_id, crop, quantity, unit, price_per_unit, area, description, image_url, status (active/sold), created_at, updated_at. RLS: owner CRUD; সবাই active গুলো read.
- `machines` table-এ already আছে — শুধু `image_url`, `price_per_hour`, `price_per_day`, `available_from` কলাম confirm/add করব। 
- `buyers` table-এ `logo_url` থাকলে use, না থাকলে add.
- `crop_sales`-এ `listing_id` (nullable FK to farmer_crop_listings) যোগ — bridge।
- Storage bucket `crops` (public) — farmer listing ছবির জন্য, owner-only write.

### Frontend (TanStack Start, existing pattern)
- `src/components/LiveClock.tsx` — Asia/Dhaka time, 1s interval, Bangla numerals.
- `src/routes/_authenticated/dashboard.tsx` — clock উপরে weather কার্ডে inject; market section refactor (top ৪টি + arrow→/market).
- `src/routes/_authenticated/market.tsx` — সব ধানের list + filter (already mostly আছে).
- `src/routes/_authenticated/sell.tsx` — উপরে dual button + "My Listings" + "Buyers Grid" দুটো mode toggle.
- `src/routes/_authenticated/sell.add.tsx` (নতুন) — ফসল listing form.
- `src/routes/_authenticated/machines.tsx` — dual button; default rent view + add mode.
- `src/routes/_authenticated/machines.add.tsx` (নতুন) — যন্ত্র add form.
- `src/routes/_authenticated/profile.tsx` — "আমার ফসল listings" section যোগ।
- `src/lib/i18n.tsx` — সব নতুন string (bn/en)।

### Implementation order
1. DB migration (farmer_crop_listings + crops bucket + columns)
2. LiveClock + dashboard refactor
3. sell.tsx dual-mode + sell.add.tsx form
4. machines.tsx dual-mode + machines.add.tsx form
5. profile.tsx — listings section
6. i18n strings

আনুমানিক ~1000 line code change।
