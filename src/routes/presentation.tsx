import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sprout, ChevronLeft, ChevronRight, Tractor, ShoppingBag, Leaf,
  Bell, MessageCircle, User, ShieldCheck, Users, Sparkles, Home, X,
  Play, Pause, Code2, Database, Cloud, Rocket, Globe, Smartphone,
  Languages, LogIn, Search, FileText, CreditCard, Server, Cpu, Wrench,
  CheckCircle2, BookOpen, Target, TrendingUp, HeartHandshake, Phone,
  MapPin, Camera, Lock, Zap, GitBranch, Package,
} from "lucide-react";

export const Route = createFileRoute("/presentation")({
  head: () => ({ meta: [{ title: "App Presentation — Krishi Bondhu" }] }),
  component: PresentationPage,
});

type BL = { bn: string; en: string };
type Bullet = { icon: React.ElementType; title: BL; desc: BL };
type Slide = {
  kicker: BL;
  title: BL;
  body?: BL;
  bullets?: Bullet[];
  gradient: string;
  icon: React.ElementType;
};

const slides: Slide[] = [
  {
    kicker: { bn: "কৃষি বন্ধু", en: "Krishi Bondhu" },
    title: { bn: "বাংলাদেশের কৃষকদের জন্য সম্পূর্ণ ডিজিটাল প্ল্যাটফর্ম", en: "A complete digital platform for Bangladeshi farmers" },
    body: { bn: "ফসল বিক্রি, যন্ত্র ভাড়া, রোগবালাই সমাধান, সরকারি স্কিম ও ২৪/৭ হেল্পলাইন — সব এক অ্যাপে।", en: "Sell crops, rent machines, get disease advice, government schemes & 24/7 helpline — all in one app." },
    gradient: "from-emerald-500/30 via-green-500/20 to-teal-500/10",
    icon: Sprout,
  },
  {
    kicker: { bn: "সমস্যা", en: "The Problem" },
    title: { bn: "কৃষকরা যে সমস্যাগুলোর মুখোমুখি হন", en: "Challenges farmers face every day" },
    bullets: [
      { icon: ShoppingBag, title: { bn: "মধ্যস্বত্বভোগীর চাপ", en: "Middlemen pressure" }, desc: { bn: "ন্যায্য দামে ফসল বিক্রির সুযোগ কম।", en: "Limited chance to sell crops at a fair price." } },
      { icon: Tractor, title: { bn: "যন্ত্রের অভাব", en: "Lack of machinery" }, desc: { bn: "মৌসুমে সময়মতো যন্ত্র ভাড়া পাওয়া কঠিন।", en: "Hard to rent machines on time during peak season." } },
      { icon: Leaf, title: { bn: "রোগবালাইয়ে ক্ষতি", en: "Crop disease loss" }, desc: { bn: "দ্রুত ও সঠিক পরামর্শ পাওয়া যায় না।", en: "No quick or accurate expert advice available." } },
      { icon: BookOpen, title: { bn: "তথ্যের ঘাটতি", en: "Information gap" }, desc: { bn: "সরকারি স্কিম ও প্রকল্প সম্পর্কে অজ্ঞতা।", en: "Unaware of government schemes and projects." } },
    ],
    gradient: "from-rose-500/25 via-orange-500/20 to-amber-500/10",
    icon: Target,
  },
  {
    kicker: { bn: "সমাধান", en: "Our Solution" },
    title: { bn: "এক অ্যাপেই সব সমাধান", en: "Every solution in a single app" },
    bullets: [
      { icon: ShoppingBag, title: { bn: "মার্কেটপ্লেস", en: "Marketplace" }, desc: { bn: "সরাসরি ক্রেতা-বিক্রেতা সংযোগ।", en: "Direct buyer-seller connection." } },
      { icon: Tractor, title: { bn: "যন্ত্র ভাড়া", en: "Machine rental" }, desc: { bn: "কাছাকাছি যন্ত্র খুঁজুন ও বুক করুন।", en: "Find nearby machines and book instantly." } },
      { icon: Leaf, title: { bn: "কৃষি বন্ধু", en: "Krishi Bondhu" }, desc: { bn: "রোগবালাই ও পরামর্শ।", en: "Disease guides and expert advice." } },
      { icon: MessageCircle, title: { bn: "হেল্পলাইন", en: "Helpline" }, desc: { bn: "চ্যাটবট দিয়ে সাপোর্ট।", en: "Chatbot-powered live support." } },
    ],
    gradient: "from-emerald-500/25 via-green-500/20 to-lime-500/10",
    icon: Sparkles,
  },
  {
    kicker: { bn: "ফিচার ১", en: "Feature 1" },
    title: { bn: "রেজিস্ট্রেশন ও লগইন", en: "Registration & Login" },
    body: { bn: "Email/Password বা Google দিয়ে এক ক্লিকে অ্যাকাউন্ট খুলুন।", en: "Create an account with Email/Password or Google in one click." },
    bullets: [
      { icon: LogIn, title: { bn: "একাধিক লগইন অপশন", en: "Multiple login options" }, desc: { bn: "Email + Google OAuth সাপোর্ট।", en: "Supports Email and Google OAuth." } },
      { icon: ShieldCheck, title: { bn: "নিরাপদ পাসওয়ার্ড", en: "Secure password" }, desc: { bn: "Reset password ও email verification।", en: "Password reset and email verification." } },
      { icon: User, title: { bn: "ভূমিকা নির্বাচন", en: "Choose your role" }, desc: { bn: "কৃষক, ক্রেতা বা যন্ত্র মালিক হিসেবে যুক্ত হন।", en: "Join as a farmer, buyer or machine owner." } },
    ],
    gradient: "from-sky-500/25 via-blue-500/20 to-indigo-500/10",
    icon: LogIn,
  },
  {
    kicker: { bn: "ফিচার ২", en: "Feature 2" },
    title: { bn: "প্রোফাইল ও ভাষা", en: "Profile & Language" },
    bullets: [
      { icon: User, title: { bn: "ব্যক্তিগত তথ্য", en: "Personal info" }, desc: { bn: "নাম, ফোন, ঠিকানা, NID সংরক্ষণ।", en: "Store name, phone, address and NID." } },
      { icon: MapPin, title: { bn: "জমির তথ্য", en: "Land details" }, desc: { bn: "জমির পরিমাণ ও অবস্থান যোগ করুন।", en: "Add land size and location." } },
      { icon: Languages, title: { bn: "দ্বিভাষিক UI", en: "Bilingual UI" }, desc: { bn: "বাংলা ও English এক ক্লিকে পরিবর্তন।", en: "Switch between Bangla and English in one click." } },
      { icon: Lock, title: { bn: "ডেটা সুরক্ষা", en: "Data security" }, desc: { bn: "Row Level Security দিয়ে protected।", en: "Protected by Row Level Security." } },
    ],
    gradient: "from-purple-500/25 via-violet-500/20 to-fuchsia-500/10",
    icon: User,
  },
  {
    kicker: { bn: "ফিচার ৩", en: "Feature 3" },
    title: { bn: "মার্কেটপ্লেস — কীভাবে কাজ করে", en: "Marketplace — how it works" },
    bullets: [
      { icon: Camera, title: { bn: "ফসল লিস্ট করুন", en: "List your crop" }, desc: { bn: "ছবি, পরিমাণ ও দাম দিয়ে পোস্ট করুন।", en: "Post with photo, quantity and price." } },
      { icon: Search, title: { bn: "ক্রেতা খুঁজুন", en: "Find buyers" }, desc: { bn: "ক্যাটাগরি ও এলাকা ভিত্তিক সার্চ।", en: "Search by category and location." } },
      { icon: MessageCircle, title: { bn: "চ্যাটে দরদাম", en: "Negotiate in chat" }, desc: { bn: "ইন-অ্যাপ চ্যাটে সরাসরি কথা বলুন।", en: "Talk directly using in-app chat." } },
      { icon: Bell, title: { bn: "তাৎক্ষণিক নোটিফিকেশন", en: "Instant notifications" }, desc: { bn: "নতুন অফার সাথে সাথে জানুন।", en: "Know new offers right away." } },
    ],
    gradient: "from-amber-500/25 via-yellow-500/20 to-orange-500/10",
    icon: ShoppingBag,
  },
  {
    kicker: { bn: "ফিচার ৪", en: "Feature 4" },
    title: { bn: "যন্ত্র ভাড়া — কীভাবে কাজ করে", en: "Machine rental — how it works" },
    bullets: [
      { icon: Tractor, title: { bn: "যন্ত্র ব্রাউজ", en: "Browse machines" }, desc: { bn: "ট্রাক্টর, পাওয়ার টিলার, হারভেস্টার লিস্ট।", en: "List of tractors, power tillers, harvesters." } },
      { icon: FileText, title: { bn: "বিস্তারিত দেখুন", en: "See details" }, desc: { bn: "ছবি, রেট, মালিকের তথ্য।", en: "Photos, rates and owner info." } },
      { icon: HeartHandshake, title: { bn: "ভাড়ার অনুরোধ", en: "Rental request" }, desc: { bn: "এক ক্লিকে মালিকের কাছে রিকোয়েস্ট।", en: "Send a request to the owner in one click." } },
      { icon: Bell, title: { bn: "কনফার্মেশন", en: "Confirmation" }, desc: { bn: "অনুমোদন হলে নোটিফিকেশন পাবেন।", en: "Get a notification once approved." } },
    ],
    gradient: "from-orange-500/25 via-amber-500/20 to-yellow-500/10",
    icon: Tractor,
  },
  {
    kicker: { bn: "ফিচার ৫", en: "Feature 5" },
    title: { bn: "কৃষি বন্ধু — পরামর্শ ও রোগবালাই", en: "Krishi Bondhu — advice & disease help" },
    bullets: [
      { icon: Leaf, title: { bn: "রোগবালাই গাইড", en: "Disease guide" }, desc: { bn: "ফসল অনুযায়ী লক্ষণ ও প্রতিকার।", en: "Symptoms and remedies for each crop." } },
      { icon: MessageCircle, title: { bn: "প্রশ্ন করুন", en: "Ask a question" }, desc: { bn: "নিজের সমস্যা লিখে বিশেষজ্ঞ পরামর্শ।", en: "Write your problem and get expert advice." } },
      { icon: BookOpen, title: { bn: "চাষাবাদ টিপস", en: "Farming tips" }, desc: { bn: "মৌসুম অনুযায়ী গাইডলাইন।", en: "Season-wise guidelines." } },
    ],
    gradient: "from-green-500/25 via-emerald-500/20 to-teal-500/10",
    icon: Leaf,
  },
  {
    kicker: { bn: "ফিচার ৬", en: "Feature 6" },
    title: { bn: "সরকারি স্কিম ও ভর্তুকি", en: "Government schemes & subsidies" },
    bullets: [
      { icon: FileText, title: { bn: "স্কিম লিস্ট", en: "Scheme list" }, desc: { bn: "চলমান সরকারি প্রকল্প এক জায়গায়।", en: "All running government projects in one place." } },
      { icon: CheckCircle2, title: { bn: "যোগ্যতা চেক", en: "Eligibility check" }, desc: { bn: "কে কোন স্কিমে আবেদন করতে পারবেন।", en: "See who qualifies for which scheme." } },
      { icon: Globe, title: { bn: "আপডেটেড তথ্য", en: "Latest updates" }, desc: { bn: "নতুন প্রকল্পের তাৎক্ষণিক নোটিফিকেশন।", en: "Instant alerts about new projects." } },
    ],
    gradient: "from-teal-500/25 via-cyan-500/20 to-emerald-500/10",
    icon: FileText,
  },
  {
    kicker: { bn: "ফিচার ৭", en: "Feature 7" },
    title: { bn: "হেল্পলাইন চ্যাটবট", en: "Helpline chatbot" },
    bullets: [
      { icon: MessageCircle, title: { bn: "চ্যাটবট সাপোর্ট", en: "Chatbot support" }, desc: { bn: "নাম, ফোন, লোকেশন ও সমস্যা জমা দিন।", en: "Submit name, phone, location and your issue." } },
      { icon: Phone, title: { bn: "২৪/৭ অ্যাকসেস", en: "24/7 access" }, desc: { bn: "যেকোনো সময় সমস্যা পাঠান।", en: "Send your problem any time of day." } },
      { icon: Bell, title: { bn: "রিপ্লাই নোটিফিকেশন", en: "Reply notification" }, desc: { bn: "Admin উত্তর দিলে সঙ্গে সঙ্গে notification।", en: "Get notified as soon as the admin replies." } },
    ],
    gradient: "from-pink-500/25 via-rose-500/20 to-red-500/10",
    icon: MessageCircle,
  },
  {
    kicker: { bn: "ফিচার ৮", en: "Feature 8" },
    title: { bn: "নোটিফিকেশন সিস্টেম", en: "Notification system" },
    bullets: [
      { icon: Bell, title: { bn: "রিয়েল-টাইম", en: "Real-time" }, desc: { bn: "অর্ডার, মেসেজ ও রিপ্লাই সঙ্গে সঙ্গে।", en: "Orders, messages and replies arrive instantly." } },
      { icon: ShoppingBag, title: { bn: "মার্কেট আপডেট", en: "Market updates" }, desc: { bn: "ক্রেতার আগ্রহ ও মেসেজ।", en: "Buyer interest and messages." } },
      { icon: Tractor, title: { bn: "যন্ত্র বুকিং", en: "Machine booking" }, desc: { bn: "ভাড়ার অনুরোধ ও কনফার্মেশন।", en: "Rental requests and confirmations." } },
    ],
    gradient: "from-indigo-500/25 via-blue-500/20 to-sky-500/10",
    icon: Bell,
  },
  {
    kicker: { bn: "কাদের উপকার?", en: "Who benefits?" },
    title: { bn: "কে কীভাবে লাভবান হবেন?", en: "Who benefits and how?" },
    bullets: [
      { icon: Sprout, title: { bn: "কৃষক", en: "Farmers" }, desc: { bn: "ন্যায্য দাম, সহজ যন্ত্র, দ্রুত পরামর্শ।", en: "Fair prices, easy machines, quick advice." } },
      { icon: ShoppingBag, title: { bn: "ক্রেতা / ব্যবসায়ী", en: "Buyers / traders" }, desc: { bn: "সরাসরি কৃষকের কাছ থেকে তাজা পণ্য।", en: "Fresh produce direct from the farmer." } },
      { icon: Users, title: { bn: "যন্ত্র মালিক", en: "Machine owners" }, desc: { bn: "অলস যন্ত্র ভাড়া দিয়ে অতিরিক্ত আয়।", en: "Earn extra income by renting idle machines." } },
      { icon: TrendingUp, title: { bn: "অর্থনীতি", en: "Economy" }, desc: { bn: "গ্রামীণ অর্থনীতিতে ডিজিটাল রূপান্তর।", en: "Digital transformation of the rural economy." } },
    ],
    gradient: "from-emerald-500/25 via-teal-500/20 to-cyan-500/10",
    icon: HeartHandshake,
  },
  {
    kicker: { bn: "টেকনোলজি ১", en: "Technology 1" },
    title: { bn: "Frontend Technologies", en: "Frontend Technologies" },
    bullets: [
      { icon: Code2, title: { bn: "React 19 + TypeScript", en: "React 19 + TypeScript" }, desc: { bn: "Type-safe আধুনিক UI ফ্রেমওয়ার্ক।", en: "Type-safe, modern UI framework." } },
      { icon: Zap, title: { bn: "TanStack Start + Vite 7", en: "TanStack Start + Vite 7" }, desc: { bn: "SSR/SSG ও file-based routing।", en: "SSR/SSG and file-based routing." } },
      { icon: Sparkles, title: { bn: "Tailwind CSS v4", en: "Tailwind CSS v4" }, desc: { bn: "Utility-first styling ও design tokens।", en: "Utility-first styling and design tokens." } },
      { icon: Package, title: { bn: "shadcn/ui + Lucide", en: "shadcn/ui + Lucide" }, desc: { bn: "Accessible UI components ও icons।", en: "Accessible UI components and icons." } },
    ],
    gradient: "from-sky-500/25 via-blue-500/20 to-indigo-500/10",
    icon: Code2,
  },
  {
    kicker: { bn: "টেকনোলজি ২", en: "Technology 2" },
    title: { bn: "Backend & Database", en: "Backend & Database" },
    bullets: [
      { icon: Database, title: { bn: "Lovable Cloud (Supabase)", en: "Lovable Cloud (Supabase)" }, desc: { bn: "PostgreSQL database ও auth।", en: "PostgreSQL database and auth." } },
      { icon: Lock, title: { bn: "Row Level Security", en: "Row Level Security" }, desc: { bn: "প্রতিটি row-এ permission নিয়ন্ত্রণ।", en: "Per-row access control." } },
      { icon: Server, title: { bn: "Server Functions", en: "Server Functions" }, desc: { bn: "TanStack createServerFn দিয়ে API।", en: "APIs built with TanStack createServerFn." } },
      { icon: Cloud, title: { bn: "Edge Functions", en: "Edge Functions" }, desc: { bn: "Webhook ও public API endpoint।", en: "Webhooks and public API endpoints." } },
    ],
    gradient: "from-purple-500/25 via-violet-500/20 to-indigo-500/10",
    icon: Database,
  },
  {
    kicker: { bn: "টেকনোলজি ৩", en: "Technology 3" },
    title: { bn: "Integrations & Tools", en: "Integrations & Tools" },
    bullets: [
      { icon: LogIn, title: { bn: "Google OAuth", en: "Google OAuth" }, desc: { bn: "Social login integration।", en: "Social login integration." } },
      { icon: Bell, title: { bn: "Realtime Subscriptions", en: "Realtime subscriptions" }, desc: { bn: "Supabase Realtime দিয়ে live update।", en: "Live updates via Supabase Realtime." } },
      { icon: Camera, title: { bn: "Storage Buckets", en: "Storage buckets" }, desc: { bn: "ছবি ও ফাইল আপলোড।", en: "Image and file uploads." } },
      
    ],
    gradient: "from-teal-500/25 via-emerald-500/20 to-green-500/10",
    icon: Cpu,
  },
  {
    kicker: { bn: "আর্কিটেকচার", en: "Architecture" },
    title: { bn: "অ্যাপ কীভাবে কাজ করে", en: "How the app works" },
    bullets: [
      { icon: Smartphone, title: { bn: "Client (Browser)", en: "Client (Browser)" }, desc: { bn: "React UI, routing, state management।", en: "React UI, routing, state management." } },
      { icon: Server, title: { bn: "Server Functions", en: "Server Functions" }, desc: { bn: "Business logic, validation, auth check।", en: "Business logic, validation, auth checks." } },
      { icon: Database, title: { bn: "PostgreSQL DB", en: "PostgreSQL DB" }, desc: { bn: "User, listings, machines, messages store।", en: "Stores users, listings, machines, messages." } },
      { icon: Bell, title: { bn: "Realtime Channel", en: "Realtime channel" }, desc: { bn: "Live notifications push করে।", en: "Pushes live notifications." } },
    ],
    gradient: "from-fuchsia-500/25 via-purple-500/20 to-violet-500/10",
    icon: Wrench,
  },
  {
    kicker: { bn: "নিরাপত্তা", en: "Security" },
    title: { bn: "Security ও Data Protection", en: "Security & Data Protection" },
    bullets: [
      { icon: Lock, title: { bn: "RLS Policies", en: "RLS policies" }, desc: { bn: "প্রতিটি table-এ access control।", en: "Access control on every table." } },
      { icon: ShieldCheck, title: { bn: "Auth Middleware", en: "Auth middleware" }, desc: { bn: "Protected route ও server function।", en: "Protected routes and server functions." } },
      { icon: Users, title: { bn: "User Roles Table", en: "User roles table" }, desc: { bn: "Admin, farmer, buyer আলাদা role।", en: "Separate admin, farmer, buyer roles." } },
      { icon: Lock, title: { bn: "HTTPS Encryption", en: "HTTPS encryption" }, desc: { bn: "সব ডেটা এনক্রিপটেড transfer।", en: "All data is transferred encrypted." } },
    ],
    gradient: "from-red-500/25 via-rose-500/20 to-pink-500/10",
    icon: ShieldCheck,
  },
  {
    kicker: { bn: "লাইভ করার ধাপ", en: "Steps to go live" },
    title: { bn: "অ্যাপ লাইভ করতে যা যা দরকার", en: "What you need to launch the app" },
    bullets: [
      { icon: CheckCircle2, title: { bn: "১. Testing", en: "1. Testing" }, desc: { bn: "সব ফিচার লোকাল ও preview-এ পরীক্ষা।", en: "Test every feature locally and in preview." } },
      { icon: ShieldCheck, title: { bn: "২. Security Audit", en: "2. Security audit" }, desc: { bn: "RLS policy ও secret key check।", en: "Check RLS policies and secret keys." } },
      { icon: FileText, title: { bn: "৩. Content & SEO", en: "3. Content & SEO" }, desc: { bn: "Title, meta description, favicon।", en: "Title, meta description, favicon." } },
      { icon: Rocket, title: { bn: "৪. Publish", en: "4. Publish" }, desc: { bn: "Lovable Publish button → live URL।", en: "Hit Lovable Publish → live URL." } },
    ],
    gradient: "from-orange-500/25 via-amber-500/20 to-yellow-500/10",
    icon: Rocket,
  },
  {
    kicker: { bn: "ইনফ্রাস্ট্রাকচার", en: "Infrastructure" },
    title: { bn: "Production-এ যা যা দরকার", en: "What you need in production" },
    bullets: [
      { icon: Globe, title: { bn: "Custom Domain", en: "Custom domain" }, desc: { bn: "নিজস্ব ডোমেইন কিনে DNS configure।", en: "Buy your domain and configure DNS." } },
      { icon: Database, title: { bn: "Database Backup", en: "Database backup" }, desc: { bn: "Daily auto-backup চালু রাখুন।", en: "Enable daily automatic backups." } },
      { icon: CreditCard, title: { bn: "Payment Gateway", en: "Payment gateway" }, desc: { bn: "bKash / Nagad / Stripe integration।", en: "bKash / Nagad / Stripe integration." } },
      { icon: Phone, title: { bn: "SMS / Email Service", en: "SMS / Email service" }, desc: { bn: "OTP ও নোটিফিকেশনের জন্য।", en: "For OTP and notifications." } },
    ],
    gradient: "from-blue-500/25 via-sky-500/20 to-cyan-500/10",
    icon: Cloud,
  },
  {
    kicker: { bn: "ভবিষ্যৎ পরিকল্পনা", en: "Future roadmap" },
    title: { bn: "Roadmap — পরবর্তী ফিচার", en: "Roadmap — what's next" },
    bullets: [
      { icon: Smartphone, title: { bn: "Mobile App", en: "Mobile app" }, desc: { bn: "Android ও iOS native app।", en: "Native Android and iOS app." } },
      { icon: Sparkles, title: { bn: "AI পরামর্শ", en: "AI advice" }, desc: { bn: "ছবি দেখে রোগ নির্ণয়।", en: "Diagnose disease from a photo." } },
      { icon: CreditCard, title: { bn: "ডিজিটাল পেমেন্ট", en: "Digital payment" }, desc: { bn: "ইন-অ্যাপ লেনদেন।", en: "In-app transactions." } },
      { icon: TrendingUp, title: { bn: "মার্কেট অ্যানালিটিক্স", en: "Market analytics" }, desc: { bn: "দামের পূর্বাভাস ও trend।", en: "Price forecasts and trends." } },
    ],
    gradient: "from-violet-500/25 via-fuchsia-500/20 to-pink-500/10",
    icon: TrendingUp,
  },
  {
    kicker: { bn: "শুরু করুন", en: "Get started" },
    title: { bn: "আজই কৃষি বন্ধু-এর সাথে যুক্ত হন", en: "Join Krishi Bondhu today" },
    body: { bn: "একটি অ্যাকাউন্ট তৈরি করুন এবং স্মার্ট কৃষির যাত্রা শুরু করুন।", en: "Create an account and begin your smart farming journey." },
    gradient: "from-primary/30 via-emerald-500/20 to-teal-500/10",
    icon: Sparkles,
  },
];

type Lang = "bn" | "en";

function slideToSpeech(s: Slide, lang: Lang): string {
  const sep = lang === "bn" ? "। " : ". ";
  const parts: string[] = [s.kicker[lang], s.title[lang]];
  if (s.body) parts.push(s.body[lang]);
  if (s.bullets) s.bullets.forEach((b) => parts.push(`${b.title[lang]}${sep}${b.desc[lang]}`));
  return parts.join(sep);
}

function pickFemaleVoice(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | undefined {
  let pool: SpeechSynthesisVoice[] = [];
  if (lang === "bn") {
    const bn = voices.filter((v) => v.lang?.toLowerCase().startsWith("bn"));
    const hi = voices.filter((v) => v.lang?.toLowerCase().startsWith("hi"));
    pool = bn.length ? bn : hi;
  } else {
    pool = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  }
  if (!pool.length) pool = voices;
  const notMale = pool.filter((v) => !/male\b|man\b/i.test(v.name));
  const femalePool = notMale.length ? notMale : pool;
  const femaleRegex = lang === "en"
    ? /female|woman|samantha|zira|jenny|aria|eva|karen|susan|victoria|tessa|allison|ava|joanna|salli|kimberly|amy|emma|sonia/i
    : /female|woman|priya|veena|sonia|kalpana|swara/i;
  const female = femalePool.find((v) => femaleRegex.test(v.name));
  return female || femalePool[0] || pool[0] || voices[0];
}

function PresentationPage() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lang, setLang] = useState<Lang>("bn");
  const total = slides.length;
  const s = slides[i];
  const Icon = s.icon;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(total - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    if (!playing) return;

    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      const voices = synth.getVoices();
      const u = new SpeechSynthesisUtterance(slideToSpeech(s, lang));
      const v = pickFemaleVoice(voices, lang);
      if (v) u.voice = v;
      u.lang = v?.lang || (lang === "bn" ? "bn-BD" : "en-US");
      u.rate = 0.95;
      u.pitch = 1.15;
      u.onend = () => {
        if (cancelled) return;
        setI((idx) => (idx + 1) % total);
      };
      synth.speak(u);
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => { synth.onvoiceschanged = null; speak(); };
      setTimeout(speak, 400);
    } else {
      speak();
    }

    return () => {
      cancelled = true;
      synth.cancel();
    };
  }, [i, playing, total, s, lang]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progress = ((i + 1) / total) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-bangla">
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.gradient} transition-all duration-700`} />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, var(--primary-glow) 0%, transparent 70%)" }}
      />

      <div className="fixed left-0 right-0 top-0 z-30 h-1 bg-border/40">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold">কৃষি বন্ধু · Krishi Bondhu</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang((l) => (l === "bn" ? "en" : "bn"))}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "bn" ? "বাংলা" : "English"}
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? (lang === "bn" ? "থামান" : "Pause") : (lang === "bn" ? "চালান" : "Play")}
          </button>
          <Link
            to="/auth"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" /> {lang === "bn" ? "বন্ধ" : "Close"}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-4xl items-center px-4 py-6 sm:px-8">
        <div
          key={`${i}-${lang}`}
          className="w-full animate-fade-in rounded-3xl border border-border bg-card/85 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-12"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              {s.kicker[lang]} · {i + 1}/{total}
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold leading-tight text-foreground sm:text-4xl">
            {s.title[lang]}
          </h1>
          {s.body && (
            <p className="mt-4 text-base text-foreground/90 sm:text-lg">{s.body[lang]}</p>
          )}

          {s.bullets && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {s.bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  style={{ animation: `fade-in 0.4s ease-out ${idx * 90}ms backwards` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground sm:text-base">{b.title[lang]}</div>
                    <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{b.desc[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {i === total - 1 && (
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition"
            >
              <Home className="h-4 w-4" /> {lang === "bn" ? "অ্যাকাউন্ট তৈরি / লগইন" : "Create account / Login"}
            </Link>
          )}
        </div>
      </main>


      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => { setPlaying(false); setI((v) => Math.max(0, v - 1)); }}
            disabled={i === 0}
            className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> {lang === "bn" ? "পূর্ববর্তী" : "Prev"}
          </button>

          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setPlaying(false); setI(idx); }}
                className={`h-1.5 shrink-0 rounded-full transition-all ${idx === i ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => { setPlaying(false); setI((v) => Math.min(total - 1, v + 1)); }}
            disabled={i === total - 1}
            className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
          >
            {lang === "bn" ? "পরবর্তী" : "Next"} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
