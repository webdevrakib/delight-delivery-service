## App কাঠামো (Bangladesh-focused)

ছবি দুটো analyze করে নিচের plan তৈরি করেছি। পুরো app বাংলাদেশকে target করে বানাবো (ধান, পাট, ইত্যাদি; জেলা — ঢাকা, রংপুর, বগুড়া etc; দাম BDT ৳-এ)।

### Bottom Navigation — ৫টা Tab

```text
[হোম] [যন্ত্র Booking] [ফসল বিক্রি] [কৃষি বন্ধু] [প্রোফাইল]
```

### ১) হোম পেজ
- আজকের বাজার দর (top 4-5 ফসল preview)
- আবহাওয়ার তথ্য (আজকের weather card)
- জরুরি নোটিশ (banner)
- **দ্রুত অ্যাক্সেস** grid: সরকারি যোজনা · কৃষি পরামর্শ · বাজার দর · যন্ত্র Booking · ফসল বিক্রি

### ২) যন্ত্র Booking (নতুন)
- ক্যাটাগরি: ধান কাটার মেশিন, মাড়াই যন্ত্র, ট্রাক্টর, পাওয়ার টিলার
- প্রতিটার জন্য listing → owner, এলাকা, ভাড়া/দিন, available date
- "Booking দিন" → তারিখ select → confirmation
- কৃষক নিজেও যন্ত্র ভাড়া দিতে list করতে পারবে

### ৩) ফসল বিক্রি (নতুন)
- ক্রেতার তালিকা (paikar/aroth/company)
- প্রতি ক্রেতার: নাম, এলাকা, কোন ফসল কিনে, offered দাম
- "সরাসরি যোগাযোগ" — phone/WhatsApp button
- দরদাম — simple message/offer thread

### ৪) কৃষি বন্ধু (পরামর্শ tab নাম পরিবর্তন)
- কৃষি তথ্য / টিপস list
- আবহাওয়া বিস্তারিত (৭ দিন)
- রোগবালাই পরামর্শ — ফসল ভিত্তিক common diseases
- চাষাবাদ পরামর্শ — seasonal guide
- "প্রশ্ন করুন" — কৃষক রোগবালাই সম্পর্কে জিজ্ঞাসা করতে পারবে

### ৫) প্রোফাইল (update)
বর্তমান field রাখবো + যোগ করবো:
- **প্রোফাইল ছবি** upload (Lovable Cloud storage)
- কৃষকের তথ্য: নাম, ফোন, ভাষা ✓
- জমির তথ্য: জেলা, গ্রাম, জমির পরিমাণ (একর/শতাংশ unit toggle)
- প্রধান ফসল ✓
- **Booking ইতিহাস** section
- **ফসল বিক্রির ইতিহাস** (কত কাটা, কত পরিমাণ বিক্রি)

### সব পেজে Back Button
প্রতিটি sub-page (যন্ত্র detail, ক্রেতা detail, scheme detail, tips detail) এর top-এ back button add করবো। AppShell-এ optional `showBack` prop যোগ করে route-aware back নেভিগেশন।

### সরকারি যোজনা
আলাদা tab থেকে সরিয়ে homepage দ্রুত অ্যাক্সেস-এর under-এ নিয়ে আসবো। route থাকবে `/schemes` কিন্তু bottom nav থেকে বাদ।

---

## Database পরিবর্তন (Lovable Cloud)

নতুন table:
- **machines** — যন্ত্র listing (type, owner_id, location, rate_per_day, available, photo)
- **machine_bookings** — booking history (machine_id, farmer_id, dates, status)
- **buyers** — ক্রেতার তালিকা (name, area, crops_buying, phone, offered_price)
- **crop_sales** — বিক্রির ইতিহাস (farmer_id, crop, quantity, price, buyer_id, date)
- **disease_questions** — কৃষকের রোগবালাই প্রশ্ন (farmer_id, crop, question, answer)

profiles table-এ যোগ:
- `avatar_url` (profile picture)
- `land_unit` ('acre' | 'shotok')

Storage bucket: `avatars` (public read, auth write)

বাজার দর data বাংলাদেশের জেলা ও ফসল (ধান-আমন/বোরো, পাট, আলু, পেঁয়াজ, ইলিশ-mandi) দিয়ে seed করবো।

---

## Build order
1. DB migration (tables + storage + seed Bangladesh data)
2. AppShell-এ back button support
3. Bottom nav update (৫ tab)
4. নতুন route: machines, machines/$id, sell, sell/$buyerId, schemes homepage থেকে link
5. Profile update (avatar upload, unit toggle, history sections)
6. কৃষি বন্ধু tab restructure
7. i18n strings (বাংলা first, English secondary)

প্রায় 1500+ line code আসবে, kintu চাইলে আমি এক ধাপে সব করে দিতে পারি — approve করলেই শুরু করছি।