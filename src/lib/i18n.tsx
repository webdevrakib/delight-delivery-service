import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";
const STORAGE_KEY = "krishi-lang";
type Dict = Record<string, { bn: string; en: string }>;

export const dict: Dict = {
  appName: { bn: "কৃষক বন্ধু", en: "Krishok Bondhu" },
  tagline: { bn: "কৃষকের পাশে সরকারি সাহায্য", en: "Beside every farmer" },
  heroTitle: { bn: "মাটির সাথে, প্রযুক্তির হাতে", en: "Rooted in soil, powered by tech" },
  heroSub: { bn: "যন্ত্র বুকিং, ফসল বিক্রি ও কৃষি পরামর্শ — একটাই অ্যাপে।", en: "Machine booking, crop selling and farming tips — all in one app." },
  getStarted: { bn: "শুরু করুন", en: "Get started" },
  login: { bn: "লগইন", en: "Login" },
  signup: { bn: "নিবন্ধন", en: "Sign up" },
  logout: { bn: "লগ আউট", en: "Logout" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  fullName: { bn: "পুরো নাম", en: "Full name" },
  continueWithGoogle: { bn: "গুগল দিয়ে এগিয়ে যান", en: "Continue with Google" },
  or: { bn: "অথবা", en: "or" },
  haveAccount: { bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?", en: "Already have an account?" },
  noAccount: { bn: "অ্যাকাউন্ট নেই?", en: "No account?" },
  back: { bn: "ফিরে যান", en: "Back" },

  // bottom nav
  home: { bn: "হোম", en: "Home" },
  machines: { bn: "যন্ত্র", en: "Machines" },
  sell: { bn: "ফসল বিক্রি", en: "Sell" },
  krishiBondhu: { bn: "কৃষক বন্ধু", en: "Krishok Bondhu" },
  profile: { bn: "প্রোফাইল", en: "Profile" },

  welcome: { bn: "স্বাগতম", en: "Welcome" },
  quickAccess: { bn: "দ্রুত অ্যাক্সেস", en: "Quick access" },
  todayMarket: { bn: "আজকের বাজার দর", en: "Today's market price" },
  weatherInfo: { bn: "আবহাওয়ার তথ্য", en: "Weather" },
  urgentNotice: { bn: "জরুরি নোটিশ", en: "Urgent notice" },
  noticeBody: { bn: "আগামী ৩ দিন উত্তরাঞ্চলে ভারী বৃষ্টির সম্ভাবনা — পাকা ধান দ্রুত কাটুন।", en: "Heavy rain forecast in north for 3 days — harvest ripe paddy quickly." },

  govSchemes: { bn: "সরকারি যোজনা", en: "Govt. schemes" },
  farmingTips: { bn: "কৃষি পরামর্শ", en: "Farming tips" },
  marketPrices: { bn: "বাজার দর", en: "Market prices" },
  machineBooking: { bn: "যন্ত্র বুকিং", en: "Machine booking" },
  cropSelling: { bn: "ফসল বিক্রি", en: "Crop selling" },

  // machines
  allMachines: { bn: "সব যন্ত্র", en: "All machines" },
  addMachine: { bn: "যন্ত্র যোগ করুন", en: "List a machine" },
  myListings: { bn: "আমার listing", en: "My listings" },
  bookNow: { bn: "বুকিং দিন", en: "Book now" },
  ratePerDay: { bn: "প্রতিদিন ভাড়া", en: "Rate per day" },
  district: { bn: "জেলা", en: "District" },
  upazila: { bn: "উপজেলা", en: "Upazila" },
  contactPhone: { bn: "যোগাযোগ ফোন", en: "Contact phone" },
  machineType: { bn: "যন্ত্রের ধরন", en: "Machine type" },
  paddyHarvester: { bn: "ধান কাটার মেশিন", en: "Paddy harvester" },
  thresher: { bn: "মাড়াই যন্ত্র", en: "Thresher" },
  tractor: { bn: "ট্রাক্টর", en: "Tractor" },
  powerTiller: { bn: "পাওয়ার টিলার", en: "Power tiller" },
  startDate: { bn: "শুরুর তারিখ", en: "Start date" },
  endDate: { bn: "শেষ তারিখ", en: "End date" },
  bookingConfirmed: { bn: "বুকিং নিশ্চিত হয়েছে", en: "Booking confirmed" },
  machineAdded: { bn: "যন্ত্র যোগ করা হয়েছে", en: "Machine listed" },
  available: { bn: "উপলব্ধ", en: "Available" },
  unavailable: { bn: "অনুপলব্ধ", en: "Unavailable" },
  title: { bn: "নাম/শিরোনাম", en: "Title" },
  description: { bn: "বিবরণ", en: "Description" },

  // sell / buyers
  buyerList: { bn: "ক্রেতার তালিকা", en: "Buyer list" },
  contactDirect: { bn: "সরাসরি যোগাযোগ", en: "Contact directly" },
  bargain: { bn: "দরদাম", en: "Bargain" },
  buyerType: { bn: "ক্রেতার ধরন", en: "Buyer type" },
  cropsBuying: { bn: "যে ফসল কেনে", en: "Crops bought" },
  verifiedBuyer: { bn: "যাচাই করা", en: "Verified" },
  recordSale: { bn: "বিক্রি লিখে রাখুন", en: "Record sale" },
  crop: { bn: "ফসল", en: "Crop" },
  quantityKg: { bn: "পরিমাণ (কেজি)", en: "Quantity (kg)" },
  pricePerKg: { bn: "দাম প্রতি কেজি (৳)", en: "Price per kg (BDT)" },
  saleDate: { bn: "বিক্রির তারিখ", en: "Sale date" },
  saleRecorded: { bn: "বিক্রি সংরক্ষিত", en: "Sale recorded" },

  // krishi bondhu
  weatherTab: { bn: "আবহাওয়া", en: "Weather" },
  tipsTab: { bn: "চাষাবাদ", en: "Tips" },
  diseaseTab: { bn: "রোগবালাই", en: "Diseases" },
  askQuestion: { bn: "প্রশ্ন করুন", en: "Ask question" },
  yourQuestion: { bn: "আপনার প্রশ্ন", en: "Your question" },
  questionSent: { bn: "প্রশ্ন পাঠানো হয়েছে — শীঘ্রই উত্তর পাবেন", en: "Question sent — answer coming soon" },
  myQuestions: { bn: "আমার প্রশ্ন", en: "My questions" },
  pendingAnswer: { bn: "উত্তরের অপেক্ষায়", en: "Awaiting answer" },
  weatherToday: { bn: "আজ", en: "Today" },
  weatherTomorrow: { bn: "আগামীকাল", en: "Tomorrow" },

  // profile
  phone: { bn: "ফোন নম্বর", en: "Phone number" },
  village: { bn: "গ্রাম", en: "Village" },
  landSize: { bn: "জমির পরিমাণ", en: "Land size" },
  landUnitAcre: { bn: "একর", en: "Acre" },
  landUnitShotok: { bn: "শতাংশ", en: "Shotok" },
  primaryCrops: { bn: "প্রধান ফসল (কমা দিয়ে আলাদা)", en: "Primary crops (comma separated)" },
  language: { bn: "ভাষা", en: "Language" },
  saveProfile: { bn: "সংরক্ষণ করুন", en: "Save profile" },
  profileSaved: { bn: "প্রোফাইল সংরক্ষিত", en: "Profile saved" },
  changePhoto: { bn: "ছবি পরিবর্তন", en: "Change photo" },
  uploading: { bn: "আপলোড হচ্ছে…", en: "Uploading…" },
  bookingHistory: { bn: "বুকিং ইতিহাস", en: "Booking history" },
  salesHistory: { bn: "বিক্রির ইতিহাস", en: "Sales history" },
  totalSold: { bn: "মোট বিক্রি", en: "Total sold" },
  totalEarned: { bn: "মোট আয়", en: "Total earned" },
  noHistory: { bn: "এখনো কোনো record নেই", en: "No records yet" },

  // misc
  category: { bn: "বিভাগ", en: "Category" },
  all: { bn: "সব", en: "All" },
  loading: { bn: "লোড হচ্ছে…", en: "Loading…" },
  noData: { bn: "কোনো তথ্য নেই", en: "No data" },
  perKg: { bn: "প্রতি কেজি", en: "per kg" },
  perQuintal: { bn: "প্রতি কুইন্টাল", en: "per quintal" },
  eligibility: { bn: "যোগ্যতা", en: "Eligibility" },
  learnMore: { bn: "আরও জানুন", en: "Learn more" },
  signingIn: { bn: "সাইন ইন হচ্ছে…", en: "Signing in…" },
  authError: { bn: "ভুল হয়েছে, আবার চেষ্টা করুন।", en: "Something went wrong, please try again." },
  signupCheckEmail: { bn: "ইমেইল চেক করুন কনফার্মেশনের জন্য।", en: "Check your email to confirm." },
  submit: { bn: "পাঠান", en: "Submit" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  save: { bn: "সংরক্ষণ", en: "Save" },

  // sell modes
  sellMyCrop: { bn: "ফসল বিক্রি করুন", en: "Sell my crop" },
  buyCrop: { bn: "ফসল ক্রয় করুন", en: "Buy crops" },
  addCropListing: { bn: "+ ফসল যোগ করুন", en: "+ Add crop" },
  myActiveListings: { bn: "আমার active listings", en: "My active listings" },
  noListingsYet: { bn: "এখনো কোনো listing নেই — আপনার প্রথম ফসল যোগ করুন!", en: "No listings yet — add your first crop!" },
  quantity: { bn: "পরিমাণ", en: "Quantity" },
  unit: { bn: "একক", en: "Unit" },
  pricePerUnit: { bn: "প্রতি এককের দাম (৳)", en: "Price per unit (BDT)" },
  area: { bn: "এলাকা", en: "Area" },
  unitKg: { bn: "কেজি", en: "kg" },
  unitMon: { bn: "মণ", en: "mon" },
  cropPaddy: { bn: "ধান", en: "Paddy" },
  cropJute: { bn: "পাট", en: "Jute" },
  cropPotato: { bn: "আলু", en: "Potato" },
  cropWheat: { bn: "গম", en: "Wheat" },
  cropCorn: { bn: "ভুট্টা", en: "Corn" },
  cropVeg: { bn: "সবজি", en: "Vegetables" },
  listingAdded: { bn: "ফসল listing যোগ হয়েছে", en: "Listing added" },
  markSold: { bn: "বিক্রিত mark করুন", en: "Mark as sold" },
  remove: { bn: "সরান", en: "Remove" },
  removed: { bn: "সরানো হয়েছে", en: "Removed" },
  markedSold: { bn: "বিক্রিত mark করা হয়েছে", en: "Marked as sold" },

  // machines modes
  rentMachine: { bn: "যন্ত্র ভাড়া করুন", en: "Rent a machine" },
  myMachines: { bn: "আমার যন্ত্র", en: "My machines" },
  ratePerHour: { bn: "প্রতি ঘন্টা ভাড়া (৳)", en: "Rate per hour (BDT)" },
  perHour: { bn: "/ ঘন্টা", en: "/ hour" },
  perDay: { bn: "/ দিন", en: "/ day" },
  contactOwner: { bn: "মালিকের সাথে যোগাযোগ করুন", en: "Contact owner" },
  availableFrom: { bn: "কবে থেকে available", en: "Available from" },

  // dashboard
  liveTime: { bn: "বাংলাদেশ সময়", en: "Bangladesh time" },
  viewAll: { bn: "সব দেখুন", en: "View all" },


  // landing page
  problemsTitle: { bn: "কৃষকের সমস্যা", en: "Farmer's challenges" },
  problemsSub: { bn: "যে সমস্যাগুলো প্রতিদিন কৃষককে সামলাতে হয়", en: "Daily challenges farmers face" },
  problem1: { bn: "সরকারি সাহায্যের তথ্য সহজে পাওয়া যায় না", en: "Govt. help info is hard to find" },
  problem1Desc: { bn: "অনেক যোজনা আছে কিন্তু কোনটা কার জন্য — জানা কঠিন।", en: "Many schemes, but knowing which fits is tough." },
  problem2: { bn: "ন্যায্য মূল্য পাওয়া যায় না", en: "Fair price is hard to get" },
  problem2Desc: { bn: "বাজার দর না জানলে দাম কম হয়।", en: "Without market rates, prices stay low." },
  problem3: { bn: "যন্ত্র ভাড়ার অভাব", en: "Hard to rent machines" },
  problem3Desc: { bn: "সঠিক সময়ে যন্ত্র না পেলে ফসল নষ্ট হয়।", en: "Without timely machines, crops are lost." },
  problem4: { bn: "ভাষার বাধা", en: "Language barrier" },
  problem4Desc: { bn: "ইংরেজি ফর্ম বুঝতে অসুবিধা।", en: "English forms are hard to follow." },
  solutionsTitle: { bn: "আমাদের সমাধান", en: "Our solution" },
  solutionsSub: { bn: "এক অ্যাপে কৃষকের সব প্রয়োজন", en: "Everything in one app" },
  feature1Title: { bn: "যন্ত্র বুকিং", en: "Machine booking" },
  feature1Desc: { bn: "ট্রাক্টর, ধান কাটার মেশিন ও মাড়াই যন্ত্র সরাসরি ভাড়া নিন।", en: "Rent tractors, harvesters and threshers directly." },
  feature2Title: { bn: "রিয়েল-টাইম বাজার দর", en: "Real-time prices" },
  feature2Desc: { bn: "বাংলাদেশের জেলা ভিত্তিক দৈনিক দর।", en: "District-wise daily prices for Bangladesh." },
  feature3Title: { bn: "সরাসরি ক্রেতা", en: "Direct buyers" },
  feature3Desc: { bn: "পাইকার ও আড়ৎদারের সাথে সরাসরি যোগাযোগ ও দরদাম।", en: "Connect directly with paikars and arots." },
  feature4Title: { bn: "দ্বিভাষিক", en: "Bilingual" },
  feature4Desc: { bn: "বাংলা ও ইংরেজি — এক ট্যাপে পরিবর্তন।", en: "Bangla & English — switch with one tap." },
  howTitle: { bn: "কীভাবে কাজ করে", en: "How it works" },
  howSub: { bn: "সহজ কয়েকটি ধাপে শুরু করুন", en: "Get started in a few easy steps" },
  step1Title: { bn: "নিবন্ধন করুন", en: "Sign up" },
  step1Desc: { bn: "ইমেইল দিয়ে এক মিনিটে।", en: "Email signup in under a minute." },
  step2Title: { bn: "প্রোফাইল পূরণ করুন", en: "Fill profile" },
  step2Desc: { bn: "জেলা, ফসল ও জমির পরিমাণ দিন।", en: "Add district, crops and land." },
  step3Title: { bn: "সাহায্য পান", en: "Get help" },
  step3Desc: { bn: "যন্ত্র, ক্রেতা ও পরামর্শ — হাতের মুঠোয়।", en: "Machines, buyers & tips in your pocket." },
  step4Title: { bn: "বিজ্ঞপ্তি চালু করুন", en: "Enable alerts" },
  step4Desc: { bn: "আবহাওয়া, দাম ও যোজনার আপডেট সময়মতো পান।", en: "Get timely weather, price & scheme updates." },
  step5Title: { bn: "বাজার দর দেখুন", en: "Track market price" },
  step5Desc: { bn: "প্রতিদিনের ফসলের দাম দেখে সঠিক সময়ে বিক্রি করুন।", en: "See daily crop prices and sell at the right time." },
  step6Title: { bn: "কৃষক সম্প্রদায়ে যোগ দিন", en: "Join the community" },
  step6Desc: { bn: "অন্য কৃষকদের সাথে অভিজ্ঞতা ও পরামর্শ ভাগ করুন।", en: "Share tips and experience with other farmers." },
  statSchemes: { bn: "সরকারি যোজনা", en: "Govt. schemes" },
  statDistricts: { bn: "জেলা কভারেজ", en: "Districts" },
  statCrops: { bn: "ফসলের দাম", en: "Crops tracked" },
  statTips: { bn: "কৃষি পরামর্শ", en: "Farming tips" },
  faqTitle: { bn: "সাধারণ প্রশ্ন", en: "FAQs" },
  faq1Q: { bn: "এই অ্যাপ কি বিনামূল্যে?", en: "Is it free?" },
  faq1A: { bn: "হ্যাঁ, কৃষক বন্ধু সম্পূর্ণ বিনামূল্যে।", en: "Yes, completely free." },
  faq2Q: { bn: "তথ্য কতটা সঠিক?", en: "How accurate is the info?" },
  faq2A: { bn: "সরকারি সূত্র থেকে সংগ্রহ করা ও নিয়মিত আপডেট করা।", en: "From official sources, updated regularly." },
  faq3Q: { bn: "ইন্টারনেট ছাড়া কাজ করে?", en: "Does it work offline?" },
  faq3A: { bn: "সীমিত অফলাইন ব্যবহার সম্ভব।", en: "Limited offline use is supported." },
  faq4Q: { bn: "আমার তথ্য কি সুরক্ষিত?", en: "Is my data safe?" },
  faq4A: { bn: "সব তথ্য এনক্রিপ্টেড — শুধু আপনি দেখতে পারেন।", en: "Encrypted — only you can see it." },
  faq5Q: { bn: "কোন কোন ভাষা সমর্থিত?", en: "Which languages are supported?" },
  faq5A: { bn: "বাংলা ও ইংরেজি — যেকোনো সময় টগল করতে পারবেন।", en: "Bangla and English — toggle anytime." },
  faq6Q: { bn: "মোবাইলে কি ব্যবহার করা যাবে?", en: "Can I use it on mobile?" },
  faq6A: { bn: "হ্যাঁ, এটি সম্পূর্ণ রেসপন্সিভ — মোবাইল, ট্যাব ও ডেস্কটপে কাজ করে।", en: "Yes, it's fully responsive across mobile, tablet and desktop." },
  faq7Q: { bn: "সাহায্য কোথায় পাব?", en: "Where can I get support?" },
  faq7A: { bn: "অ্যাপের মধ্যেই সহায়তা সেকশন আছে, অথবা আমাদের ইমেইল করুন।", en: "Use the in-app help section or email us anytime." },
  faq8Q: { bn: "নতুন ফিচার কি যোগ হবে?", en: "Will new features be added?" },
  faq8A: { bn: "হ্যাঁ, আমরা নিয়মিত নতুন ফিচার ও আপডেট নিয়ে আসি।", en: "Yes, we ship new features and updates regularly." },
  ctaTitle: { bn: "আজই শুরু করুন — কৃষি হোক আরও সহজ", en: "Start today — make farming easier" },
  ctaSub: { bn: "হাজারো কৃষকের সাথে যুক্ত হন। বিনামূল্যে।", en: "Join thousands of farmers. Free." },
  ctaButton: { bn: "ফ্রি অ্যাকাউন্ট তৈরি করুন", en: "Create free account" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (s === "bn" || s === "en") setLangState(s);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };
  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
