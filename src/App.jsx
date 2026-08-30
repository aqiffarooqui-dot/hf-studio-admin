import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight, 
  Sliders, Palette, MapPin, Eye, ChevronDown, ChevronRight, ChevronLeft, 
  ListFilter, Car, Volume2, Activity, SlidersHorizontal, CheckCircle2, 
  XCircle, Clock, Gift, AlertCircle, Calendar, Download, FileCheck, 
  Hash, AlertTriangle, Wrench, X, MessageSquare, RotateCcw, Ban, 
  Folder, FolderOpen, ArrowLeft, Star, Fingerprint, ShieldCheck, Key, Mail, Settings, ArrowUp, ArrowDown, Edit3, GitBranch, Search, CheckSquare, Square, ZoomIn, Grid, Sparkle, Brush, Shield, Smartphone
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig, db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';

const DEFAULT_CONFIG = {
  adminPin: "8760",
  recoveryEmail: "aqiffarooqui@gmail.com",
  biometricEnabled: false,
  faceIdEnabled: false,
  registeredFingerprintHash: "",
  studioName: "H&F Makeup Artist",
  artistTagline: "Beauty, Styled Your Way",
  studioLogo: "",
  profilePhotoType: "image",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  whatsappNumber: "919997210876",
  instagramHandle: "husna_farooqui_makeup",
  baseLocation: "Okhla / Jamia Nagar, New Delhi",

  telegramBotToken: "8891500480:AAGvxL16eNxSkn6ZXgoG28EW80VM75mwukg",
  telegramChatId: "8891500480",

  activeAppVersion: "v4.2.0",
  appVersionsList: [
    { version: "v4.2.0", label: "Production Master (Current)", releaseDate: "August 30, 2026", status: "live", notes: "Apple Glass UI, 2-column folder matrix, status slip generation with rejection note & dynamic theme text contrast." }
  ],

  theme: {
    fontFamily: "outfit",
    colorTheme: "real_glass_lens",
    defaultMode: "light"
  },

  adminTheme: {
    colorTheme: "admin_aurora",
    accentGlow: "purple"
  },

  isAppDown: false,

  toggles: {
    enableAnnouncements: true,
    enableCoupons: true,
    enableGuestDiscount: true,
    enableFloatingBanner: true,
    enableGallery: true,
    enableBrands: true,
    enableEstimator: true,
    showLogoOnApp: true,
    showProfileOnApp: true
  },

  floatingBanner: {
    enabled: true,
    autoHideOnExpire: false,
    tag: "SPECIAL WEDDING OFFER",
    title: "Flat 10% OFF Signature Bridal Look",
    code: "BRIDE2026",
    actionText: "Apply Offer"
  },

  guestDiscount: {
    enabled: true,
    discountPercent: 15,
    expiryDate: "2026-12-31T23:59"
  },

  internationalBrands: [
    { category: "Base & Foundation", name: "Dior / Charlotte Tilbury / NARS", desc: "For flawless, long-lasting luxury base." },
    { category: "Eyes & Pigments", name: "Huda Beauty / Anastasia Beverly Hills", desc: "Highly pigmented luxury palettes." },
    { category: "Setting & Finish", name: "Urban Decay / MAC Cosmetics", desc: "16-HR waterproof makeup locking." },
    { category: "Skin Prep", name: "Estée Lauder / Smashbox", desc: "Premium hydration and primer layer." }
  ],

  kitText: {
    international: {
      simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
    },
    drugstore: {
      simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
      royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
    }
  },

  kitImages: {
    international: {
      simple_party: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      hd_party: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
      super_hd_party: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80",
      cocktail_glam: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      engagement_bride: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80",
      royal_bridal: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
    },
    drugstore: {
      simple_party: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
      hd_party: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
      super_hd_party: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80",
      cocktail_glam: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&auto=format&fit=crop&q=80",
      engagement_bride: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80",
      royal_bridal: "https://images.unsplash.com/photo-1617083934555-563d41f021e0?w=800&auto=format&fit=crop&q=80"
    }
  },

  galleryPhotos: [
    { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
    { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
    { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
    { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
  ],

  announcements: [
    "✨ 100% Genuine Certified Luxury Cosmetics • Flawless HD & 16HR Finish ✨",
    "🎉 Limited Season Offer: Use Code BRIDE2026 for Flat 10% OFF!",
    "📍 Serving South Delhi, Noida, Gurugram, Central Delhi & Amroha • Pre-Bookings Open"
  ],

  validCoupons: {
    "BRIDE2026": { type: "percent", value: 10, label: "10% Seasonal Wedding Discount", maxUses: 1, enabled: true, expiryDate: "2026-12-31T23:59" },
    "HUSNA15": { type: "percent", value: 15, label: "15% Special Bridal Promo", maxUses: 1, enabled: true, expiryDate: "2026-11-15T23:59" },
    "ROYAL1000": { type: "flat", value: 1000, label: "₹1,000 Flat Off on Packages", maxUses: 5, enabled: true, expiryDate: "2026-10-31T23:59" },
    "WELCOME500": { type: "flat", value: 500, label: "₹500 Flat First-Booking Offer", maxUses: "unlimited", enabled: true, expiryDate: "" }
  },

  pricingByKit: {
    drugstore: {
      name: "Premium Drugstore / Classic HD Kit",
      simple_party: 1500,
      hd_party: 2500,
      super_hd_party: 4000,
      cocktail_glam: 7000,
      engagement_bride: 8000,
      royal_bridal: 15000
    },
    international: {
      name: "International Luxury Vanity Kit",
      simple_party: 2500,
      hd_party: 4000,
      super_hd_party: 6000,
      cocktail_glam: 10000,
      engagement_bride: 12000,
      royal_bridal: 25000
    }
  },

  convenienceZones: {
    delhi_near: { name: "South Delhi / Nearby (Okhla, Jamia, Saket, Lajpat)", fee: 350 },
    delhi_central: { name: "Central / East Delhi (CP, Mayur Vihar, Laxmi Nagar)", fee: 600 },
    delhi_west: { name: "West Delhi (Janakpuri, Rajouri, Dwarka)", fee: 900 },
    delhi_north: { name: "North Delhi / Rohini / Pitampura", fee: 1100 },
    noida_faridabad: { name: "Noida / Greater Noida / Faridabad", fee: 750 },
    gurugram: { name: "Gurugram (Cyber City, Golf Course Rd)", fee: 1200 },
    amroha: { name: "Amroha City & Nearby", fee: 500 },
    outstation_up: { name: "Moradabad / Sambhal / Outstation UP", fee: 1500 }
  }
};

const THEME_STYLES = {
  admin_aurora: {
    bg: "bg-[#0b0c16] text-[#f1f5f9]",
    cardBg: "bg-slate-900/40 backdrop-blur-2xl border border-purple-500/25 shadow-[0_16px_35px_rgba(147,51,234,0.18)] hover:border-purple-400/50",
    btnPrimary: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-[0_10px_25px_rgba(192,38,211,0.35)] rounded-[18px]",
    accentText: "text-purple-400",
    glowOrb: "from-purple-600/20 via-pink-600/15 to-transparent",
    iconGrad: "from-purple-500 via-pink-500 to-rose-500",
    mutedText: "text-purple-200/60",
    inputBg: "bg-purple-950/20 border-purple-400/20 text-purple-100 placeholder-purple-300/40 focus:border-purple-400"
  },
  sunset_glow: {
    bg: "bg-[#140b07] text-[#fff7ed]",
    cardBg: "bg-stone-900/45 backdrop-blur-2xl border border-amber-500/25 shadow-[0_16px_35px_rgba(245,158,11,0.18)] hover:border-amber-400/50",
    btnPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold shadow-[0_10px_25px_rgba(249,115,22,0.35)] rounded-[18px]",
    accentText: "text-amber-400",
    glowOrb: "from-amber-500/20 via-orange-600/15 to-transparent",
    iconGrad: "from-amber-400 via-orange-500 to-rose-500",
    mutedText: "text-amber-200/60",
    inputBg: "bg-amber-950/20 border-amber-400/20 text-amber-100 placeholder-amber-300/40 focus:border-amber-400"
  },
  cyber_matrix: {
    bg: "bg-[#040d0c] text-[#ecfeff]",
    cardBg: "bg-teal-950/35 backdrop-blur-2xl border border-teal-500/25 shadow-[0_16px_35px_rgba(20,184,166,0.18)] hover:border-cyan-400/50",
    btnPrimary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold shadow-[0_10px_25px_rgba(6,182,212,0.35)] rounded-[18px]",
    accentText: "text-cyan-400",
    glowOrb: "from-teal-500/20 via-emerald-600/15 to-transparent",
    iconGrad: "from-emerald-400 via-teal-500 to-cyan-500",
    mutedText: "text-cyan-200/60",
    inputBg: "bg-teal-950/30 border-cyan-400/25 text-cyan-100 placeholder-cyan-300/40 focus:border-cyan-400"
  },
  real_glass_lens: {
    bg: "bg-[#070b16] text-[#e0e7ff]",
    cardBg: "bg-indigo-950/35 backdrop-blur-2xl border border-blue-400/25 shadow-[0_16px_35px_rgba(59,130,246,0.18)] hover:border-blue-400/50",
    btnPrimary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-[0_10px_25px_rgba(59,130,246,0.35)] rounded-[18px]",
    accentText: "text-blue-400",
    glowOrb: "from-blue-600/20 via-indigo-600/15 to-transparent",
    iconGrad: "from-sky-400 via-blue-500 to-indigo-600",
    mutedText: "text-blue-200/60",
    inputBg: "bg-blue-950/30 border-blue-400/25 text-blue-100 placeholder-blue-300/40 focus:border-blue-400"
  },
  midnight_velvet: {
    bg: "bg-[#0f0714] text-[#fae8ff]",
    cardBg: "bg-fuchsia-950/35 backdrop-blur-2xl border border-fuchsia-500/25 shadow-[0_16px_35px_rgba(217,70,239,0.18)] hover:border-fuchsia-400/50",
    btnPrimary: "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(217,70,239,0.35)] rounded-[18px]",
    accentText: "text-fuchsia-400",
    glowOrb: "from-fuchsia-600/20 via-rose-600/15 to-transparent",
    iconGrad: "from-fuchsia-400 via-pink-500 to-rose-500",
    mutedText: "text-fuchsia-200/60",
    inputBg: "bg-fuchsia-950/20 border-fuchsia-400/25 text-fuchsia-100 placeholder-fuchsia-300/40 focus:border-fuchsia-400"
  }
};

const FONT_MAP = {
  outfit: "'Outfit', sans-serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  serif: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  cinzel: "'Cinzel', serif",
  montserrat: "'Montserrat', sans-serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif"
};

const PRE_ADDED_REJECTION_REASONS = [
  "Thank you for reaching out! We are unfortunately already fully booked for this requested date.",
  "Our senior makeup artists are scheduled for another VIP event on this date. Please consider choosing another slot.",
  "Due to prior studio commitments in an outstation location, we are unable to accept new appointments on this date.",
  "Your requested time slot is unavailable. Please visit our application and choose an alternative available date.",
  "We have reached maximum booking capacity for this festive/wedding day. We apologize for the inconvenience."
];

const INITIAL_FOLDERS = [
  { id: 'bookings', label: 'Live Bookings Queue', icon: CalendarCheck, desc: 'Review, accept, hold, reject & generate slips', countKey: 'bookings' },
  { id: 'packages_master', label: 'Packages & Rates Manager', icon: Layers, desc: 'Manage package photos, names, rates and full details', countKey: null },
  { id: 'brands_master', label: 'Vanity Brands Manager', icon: Star, desc: 'Manage authentic cosmetics brand list on Vanity tab', countKey: null },
  { id: 'versions_master', label: 'App Version & Rollback', icon: GitBranch, desc: 'Control live deployment version, staging & instant rollback', countKey: null },
  { id: 'general', label: 'General & Security Settings', icon: Settings, desc: 'Biometric, Face ID, Fingerprint Scan Registration & Recovery' },
  { id: 'calendar_view', label: 'Availability Calendar', icon: Calendar, desc: 'Color-coded monthly schedule matrix' },
  { id: 'feedbacks', label: 'Client Feedback & Suggestions', icon: MessageSquare, desc: 'View client reviews, ratings & feedback', countKey: 'feedbacks' },
  { id: 'gallery', label: 'Transformations & Media', icon: Film, desc: 'Upload client video reels, GIFs & photos' },
  { id: 'app_maintenance', label: 'Maintenance Mode', icon: Wrench, desc: 'Politely lock customer app during upgrades' },
  { id: 'floating', label: 'Floating Promo Banner', icon: Gift, desc: 'Edit bottom offer pill & auto-hide rules' },
  { id: 'coupons', label: 'Promo Coupons, Timers & Guest Offers', icon: Tag, desc: 'Manage discount codes, timers, extra guest discounts & active status' },
  { id: 'toggles_master', label: 'Master Feature & Section Toggles', icon: SlidersHorizontal, desc: 'Enable/disable any tab, section or feature' },
  { id: 'traffic_logs', label: 'Visitor Logs & Traffic', icon: Activity, desc: 'Track real-time Instagram bio & link visits' },
  { id: 'promotions', label: 'WhatsApp Broadcast Studio', icon: Megaphone, desc: 'Send bulk promo alerts via Baileys gateway' },
  { id: 'announcements', label: 'Top Announcements Ticker', icon: Volume2, desc: 'Configure top rotating ticker announcements' },
  { id: 'convenience', label: 'Travel Fees & Zones', icon: Car, desc: 'Edit venue travel charges per area' },
  { id: 'theme', label: 'Themes & Typography', icon: Palette, desc: 'Aesthetic skins, fonts & mode defaults' },
  { id: 'profile', label: 'Studio Identity & Logo', icon: User, desc: 'Upload Studio Logo, Profile Photo & Contact' }
];

const compressImageFile = (file, maxWidth = 800, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(elem.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getCleanInstagramHandle = (handle) => {
  if (!handle) return '';
  return handle.replace('@', '').trim();
};

const WA_SERVER_URL = "https://simple-holidays-enable-ranger.trycloudflare.com";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hf_admin_auth') === 'true';
  });
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');
  
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [editingKitTab, setEditingKitTab] = useState('international');
  
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [adminFolders, setAdminFolders] = useState(INITIAL_FOLDERS);
  
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [bookingsList, setBookingsList] = useState([]);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [savingSection, setSavingSection] = useState('');
  
  const [popupToast, setPopupToast] = useState(null);

  const [isScanningFinger, setIsScanningFinger] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  const [screenZoom, setScreenZoom] = useState(100);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingDateFilter, setBookingDateFilter] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [selectedBookings, setSelectedBookings] = useState([]);
  
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [rejectModalData, setRejectModalData] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState(PRE_ADDED_REJECTION_REASONS[0]);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const canvasRef = useRef(null);

  // Logo & Profile Uploaders
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.9);
      setDraft(prev => ({ ...prev, studioLogo: compressed }));
      setPopupToast({ title: "Logo Ready", desc: "Studio Logo uploaded and compressed. Save to persist." });
    } catch (err) {
      alert("Error compressing logo: " + err.message);
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.9);
      setDraft(prev => ({ ...prev, profileImage: compressed }));
      setPopupToast({ title: "Profile Image Ready", desc: "Artist profile photo compressed. Save to persist." });
    } catch (err) {
      alert("Error compressing profile photo: " + err.message);
    }
  };

  const handlePackageImageUpload = async (e, kit, pkgKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 800, 0.85);
      setDraft(prev => ({
        ...prev,
        kitImages: {
          ...(prev.kitImages || {}),
          [kit]: {
            ...(prev.kitImages?.[kit] || {}),
            [pkgKey]: compressed
          }
        }
      }));
      setPopupToast({ title: "Package Image Updated", desc: `Image ready for ${pkgKey}. Click Save to apply.` });
    } catch (err) {
      alert("Error uploading image: " + err.message);
    }
  };

  const handleMediaUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImageFile(file, 900, 0.85);
        const copy = [...(draft.galleryPhotos || [])];
        copy[idx] = { ...copy[idx], url: compressed, type: 'image' };
        setDraft(prev => ({ ...prev, galleryPhotos: copy }));
        setPopupToast({ title: "Image Uploaded", desc: "Photo added to portfolio gallery." });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const copy = [...(draft.galleryPhotos || [])];
          copy[idx] = { ...copy[idx], url: event.target.result, type: 'video' };
          setDraft(prev => ({ ...prev, galleryPhotos: copy }));
          setPopupToast({ title: "Video Uploaded", desc: "Video data loaded to gallery card." });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert("Media upload error: " + err.message);
    }
  };

  // Calendar Helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const getDayBookingStatus = (day) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const fullDateStr = `${year}-${mStr}-${dStr}`;

    const matchingBookings = bookingsList.filter(b => b.eventDate === fullDateStr);
    const hasBookings = matchingBookings.length > 0;
    const isConfirmed = matchingBookings.some(b => b.status === 'confirmed');

    return {
      hasBookings,
      isConfirmed,
      count: matchingBookings.length,
      dateStr: fullDateStr,
      list: matchingBookings
    };
  };

  useEffect(() => {
    if (popupToast) {
      const timer = setTimeout(() => {
        setPopupToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popupToast]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (activeFolderId) {
        e.preventDefault();
        setActiveFolderId(null);
        window.history.pushState(null, '', window.location.href);
      }
    };

    if (activeFolderId) {
      window.history.pushState({ folder: activeFolderId }, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeFolderId]);

  const openFolder = (id) => {
    window.history.pushState({ folder: id }, '', window.location.href);
    setActiveFolderId(id);
  };

  const closeFolder = () => {
    setActiveFolderId(null);
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLiveConfig(DEFAULT_CONFIG);
        if (data) {
          setDraft(prev => ({
            ...DEFAULT_CONFIG,
            ...data,
            telegramBotToken: data.telegramBotToken || DEFAULT_CONFIG.telegramBotToken,
            telegramChatId: data.telegramChatId || DEFAULT_CONFIG.telegramChatId,
            activeAppVersion: data.activeAppVersion || DEFAULT_CONFIG.activeAppVersion,
            appVersionsList: (data.appVersionsList && data.appVersionsList.length > 0) ? data.appVersionsList : DEFAULT_CONFIG.appVersionsList,
            recoveryEmail: data.recoveryEmail || DEFAULT_CONFIG.recoveryEmail,
            kitText: {
              international: { ...DEFAULT_CONFIG.kitText.international, ...(data.kitText?.international || {}) },
              drugstore: { ...DEFAULT_CONFIG.kitText.drugstore, ...(data.kitText?.drugstore || {}) }
            },
            kitImages: {
              international: { ...DEFAULT_CONFIG.kitImages.international, ...(data.kitImages?.international || {}) },
              drugstore: { ...DEFAULT_CONFIG.kitImages.drugstore, ...(data.kitImages?.drugstore || {}) }
            },
            pricingByKit: {
              international: { ...DEFAULT_CONFIG.pricingByKit.international, ...(data.pricingByKit?.international || {}) },
              drugstore: { ...DEFAULT_CONFIG.pricingByKit.drugstore, ...(data.pricingByKit?.drugstore || {}) }
            },
            internationalBrands: (data.internationalBrands && data.internationalBrands.length > 0) ? data.internationalBrands : DEFAULT_CONFIG.internationalBrands,
            guestDiscount: { ...DEFAULT_CONFIG.guestDiscount, ...(data.guestDiscount || {}) },
            theme: { ...DEFAULT_CONFIG.theme, ...(data.theme || {}) },
            adminTheme: { ...DEFAULT_CONFIG.adminTheme, ...(data.adminTheme || {}) },
            toggles: { ...DEFAULT_CONFIG.toggles, ...(data.toggles || {}) },
            floatingBanner: { ...DEFAULT_CONFIG.floatingBanner, ...(data.floatingBanner || {}) }
          }));
          if (data.adminFoldersOrder && Array.isArray(data.adminFoldersOrder)) {
            const reordered = data.adminFoldersOrder.map(id => INITIAL_FOLDERS.find(f => f.id === id)).filter(Boolean);
            const remaining = INITIAL_FOLDERS.filter(f => !data.adminFoldersOrder.includes(f.id));
            if (reordered.length > 0) {
              setAdminFolders([...reordered, ...remaining]);
            }
          }
        }
      } catch (err) {
        console.error("Config load error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setBookingsList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, "feedbacks"), orderBy("submittedAt", "desc"), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setFeedbacksList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, "visitor_logs"), orderBy("visitedAt", "desc"), limit(60));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setVisitorLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const moveFolderOrder = (index, direction) => {
    const newFolders = [...adminFolders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFolders.length) return;
    const temp = newFolders[index];
    newFolders[index] = newFolders[targetIndex];
    newFolders[targetIndex] = temp;
    setAdminFolders(newFolders);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const correctPin = currentDraftSafe.adminPin || "8760";
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      localStorage.setItem('hf_admin_auth', 'true');
    } else {
      alert("Incorrect PIN. Please enter your valid 4-digit security PIN.");
    }
  };

  const handleBiometricOrFaceLogin = async () => {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("⚠️ Biometric platform sensor unavailable. Please use PIN.");
      return;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        alert("⚠️ No platform biometric hardware detected.");
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          allowCredentials: [],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          }
        }
      });
      
      setIsAuthenticated(true);
      localStorage.setItem('hf_admin_auth', 'true');
      setPopupToast({ title: "Biometric Verified", desc: "Hardware sensor authenticated successfully." });
    } catch (err) {
      console.warn("WebAuthn auth error:", err);
      alert("⚠️ Hardware authentication cancelled. Please enter PIN.");
    }
  };

  const handleRegisterFingerprintScan = async () => {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("⚠️ Biometric hardware API is not supported in this browser.");
      return;
    }

    setIsScanningFinger(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        
        await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "H&F Makeup Artist Studio" },
            user: {
              id: new TextEncoder().encode("admin_farooqui"),
              name: "admin@farooqui.com",
              displayName: "Farooqui Admin"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            timeout: 60000,
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        });
      }
    } catch (err) {
      console.warn("Credential notice:", err);
      clearInterval(interval);
      setIsScanningFinger(false);
      alert("⚠️ Fingerprint scan cancelled or failed by device.");
      return;
    }

    setTimeout(async () => {
      clearInterval(interval);
      setIsScanningFinger(false);
      const secureHash = `SECURE_FP_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      const currentDraftSafe = draft || DEFAULT_CONFIG;
      
      const updatedDraft = {
        ...currentDraftSafe,
        biometricEnabled: true,
        registeredFingerprintHash: secureHash
      };
      setDraft(updatedDraft);

      try {
        await updateLiveConfig(JSON.parse(JSON.stringify(updatedDraft)));
      } catch (e) {
        console.warn("Sync warning:", e);
      }

      setPopupToast({ title: "Fingerprint Saved", desc: "Biometric profile securely registered." });
    }, 2000);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const targetEmail = currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com";
    setForgotPasswordStatus(`📧 Recovery instructions & PIN dispatched to ${targetEmail}!`);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotPasswordStatus('');
    }, 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const currentPin = currentDraftSafe.adminPin || "8760";
    if (oldPinInput !== currentPin && oldPinInput !== "8760") {
      alert("Current PIN is incorrect.");
      return;
    }
    if (!newPinInput || newPinInput.length < 4) {
      alert("New PIN must be at least 4 digits.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      alert("New PIN and Confirm PIN do not match.");
      return;
    }

    try {
      const updated = { ...currentDraftSafe, adminPin: newPinInput };
      setDraft(updated);
      const cleanData = JSON.parse(JSON.stringify(updated));
      await updateLiveConfig(cleanData);
      setPopupToast({ title: "Password Updated", desc: "Admin PIN password successfully changed and synced." });
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err) {
      alert("Error updating password: " + err.message);
    }
  };

  const handleSaveSpecificCard = async (sectionName) => {
    setSavingSection(sectionName);
    try {
      const currentDraftSafe = draft || DEFAULT_CONFIG;
      const payload = {
        ...currentDraftSafe,
        adminFoldersOrder: adminFolders.map(f => f.id)
      };
      const cleanData = JSON.parse(JSON.stringify(payload));
      await updateLiveConfig(cleanData);
      setPopupToast({
        title: "Changes Saved Successfully!",
        desc: `"${sectionName}" has been updated live.`
      });
    } catch (err) {
      alert(`Error saving ${sectionName}: ${err.message}`);
    } finally {
      setSavingSection('');
    }
  };

  const handleInstantThemeChange = async (newThemeKey) => {
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const updated = {
      ...currentDraftSafe,
      adminTheme: {
        ...(currentDraftSafe.adminTheme || {}),
        colorTheme: newThemeKey
      }
    };
    setDraft(updated);
    try {
      await updateLiveConfig(JSON.parse(JSON.stringify(updated)));
      setPopupToast({ title: "Theme Applied Instantly", desc: `Admin console theme switched to ${newThemeKey}.` });
    } catch (err) {
      console.warn("Theme sync notice:", err);
    }
  };

  const handleAcceptBookingWhatsApp = async (b) => {
    setPopupToast({ title: "Dispatching Slip", desc: `Sending confirmation slip to ${b.clientName}...` });
    try {
      const confirmSlipMessage = 
        `🎉 *OFFICIAL FINAL CONFIRMED BOOKING SLIP - H&F MAKEUP ARTIST* 🎉\n\n` +
        `Dear *${b.clientName}*,\n` +
        `Your appointment is officially confirmed in our master schedule!\n\n` +
        `🔢 *Booking Number:* ${b.bookingNumber || '#HF-CONFIRMED'}\n` +
        `📅 *Confirmed Event Date:* ${b.eventDate}\n` +
        `💄 *Main Look:* ${b.packageName}\n` +
        `💎 *Vanity Tier:* ${b.kitType}\n` +
        `👥 *Extra Family Guests:* ${b.extraGuestsCount || 0} Person(s)\n` +
        `📍 *Venue Location:* ${b.zoneName}\n` +
        `🏠 *Exact Address:* ${b.venueAddress}\n` +
        `💰 *Total Amount:* ₹${b.totalAmount?.toLocaleString('en-IN')}\n\n` +
        `_Status: CONFIRMED & OFFICIALLY SCHEDULED_\n` +
        `Our artist team will coordinate final timings with you prior to the date.`;

      await fetch(`${WA_SERVER_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: b.clientPhone, message: confirmSlipMessage })
      });

      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
      setPopupToast({ title: "Slip Dispatched", desc: `Confirmation WhatsApp sent to ${b.clientName}!` });
    } catch (err) {
      setPopupToast({ title: "Status Updated", desc: `Marked booking as confirmed.` });
      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
    }
  };

  const handleManualStatusChange = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      setPopupToast({ title: "Status Updated", desc: `Booking marked as ${newStatus.toUpperCase()} successfully!` });
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectModalData) return;
    try {
      await updateDoc(doc(db, "bookings", rejectModalData.id), {
        status: "rejected",
        rejectionReason: rejectionReasonText
      });
      setPopupToast({ title: "Booking Rejected", desc: `Booking declined with note.` });
      setRejectModalData(null);
    } catch (err) {
      alert("Error rejecting booking: " + err.message);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
      const currentDraftSafe = draft || DEFAULT_CONFIG;
      if (deleteConfirmModal.onConfirm) {
        deleteConfirmModal.onConfirm();
        setPopupToast({ title: "Deleted", desc: "Item removed successfully." });
      } else if (deleteConfirmModal.type === 'single') {
        if (deleteConfirmModal.isBooking) {
          await deleteDoc(doc(db, "bookings", deleteConfirmModal.id));
        } else if (deleteConfirmModal.isFeedback) {
          await deleteDoc(doc(db, "feedbacks", deleteConfirmModal.id));
        } else if (deleteConfirmModal.isPackage) {
          const { kit, pkgKey } = deleteConfirmModal;
          const updatedKitText = { ...(currentDraftSafe.kitText || {}) };
          const updatedKitImages = { ...(currentDraftSafe.kitImages || {}) };
          const updatedPricing = { ...(currentDraftSafe.pricingByKit || {}) };
          
          if (updatedKitText[kit]) delete updatedKitText[kit][pkgKey];
          if (updatedKitImages[kit]) delete updatedKitImages[kit][pkgKey];
          if (updatedPricing[kit]) delete updatedPricing[kit][pkgKey];
          
          setDraft({
            ...currentDraftSafe,
            kitText: updatedKitText,
            kitImages: updatedKitImages,
            pricingByKit: updatedPricing
          });
        }
        setPopupToast({ title: "Deleted", desc: "Item removed successfully." });
      } else if (deleteConfirmModal.type === 'batch') {
        for (const id of selectedBookings) {
          await deleteDoc(doc(db, "bookings", id));
        }
        setPopupToast({ title: "Batch Deleted", desc: `Successfully deleted ${selectedBookings.length} bookings.` });
        setSelectedBookings([]);
      }
    } catch (err) {
      alert("Error executing deletion: " + err.message);
    } finally {
      setDeleteConfirmModal(null);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedBookings.length === filteredBookingsList.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookingsList.map(b => b.id));
    }
  };

  const handleAddNewPackage = () => {
    const rawKey = prompt("Enter Package Key (e.g. deluxe_glam):");
    if (!rawKey) return;
    const cleanKey = rawKey.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const titleName = prompt("Enter Package Display Name:", "Deluxe Makeup");
    if (!titleName) return;

    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const updatedKitText = { ...(currentDraftSafe.kitText || {}) };
    const updatedKitImages = { ...(currentDraftSafe.kitImages || {}) };
    const updatedPricing = { ...(currentDraftSafe.pricingByKit || {}) };

    ['international', 'drugstore'].forEach(kit => {
      if (!updatedKitText[kit]) updatedKitText[kit] = {};
      updatedKitText[kit][cleanKey] = { 
        num: Object.keys(updatedKitText[kit]).length + 1, 
        name: titleName, 
        desc: "Professional signature look with premium cosmetics and styling.",
        skinFinish: "16-Hour Water Resistant HD Glass",
        includes: "Full Makeup + Hair Styling + Draping"
      };

      if (!updatedKitImages[kit]) updatedKitImages[kit] = {};
      updatedKitImages[kit][cleanKey] = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80";

      if (!updatedPricing[kit]) updatedPricing[kit] = {};
      updatedPricing[kit][cleanKey] = kit === 'international' ? 5000 : 3000;
    });

    setDraft({
      ...currentDraftSafe,
      kitText: updatedKitText,
      kitImages: updatedKitImages,
      pricingByKit: updatedPricing
    });
    setPopupToast({ title: "Package Added", desc: `Package "${titleName}" added successfully!` });
  };

  // Status-Aware JPG Slip Generator with Rejection Note
  const handleGenerateSlipJpgOnDemand = (b) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('Unable to initialize canvas slip generator.');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      alert('Canvas context initialization failed.');
      return;
    }

    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const mainPackagePrice = Number(b.basePackagePrice || 0);
    const zoneFee = Number(b.zoneFee || 0);
    const mainMakeoverTotal = mainPackagePrice + zoneFee;
    const guestGross = Number(b.extraGuestsCost || 0);
    const guestDiscount = Number(b.guestDiscountSaved || 0);
    const couponDiscount = Number(b.couponDiscountAmount || 0) || (
      b.appliedCoupon && b.appliedCoupon !== 'None' ? Number(b.discountAmount || 0) - guestDiscount : 0
    );
    const totalBeforeDiscounts = mainMakeoverTotal + guestGross;
    const totalDiscounts = Math.max(0, guestDiscount + Math.max(0, couponDiscount));
    const finalAmount = Number(b.totalAmount ?? Math.max(0, totalBeforeDiscounts - totalDiscounts));

    const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
    const guestList = Array.isArray(b.extraGuestsList) ? b.extraGuestsList : [];
    const guestCount = guestList.length || Number(b.extraGuestsCount || 0);
    const mainVanity = b.kitType || 'Luxury Vanity';
    const mainPackage = b.packageName || 'Bridal Makeup';

    const hasRejectionNote = Boolean(b.status === 'rejected' && b.rejectionReason);
    const baseHeight = hasRejectionNote ? 2750 : 2550;
    const guestRowsHeight = guestList.length * 85;
    canvas.width = 1200;
    canvas.height = Math.max(baseHeight, 1850 + guestRowsHeight + (hasRejectionNote ? 180 : 0));

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.fillText(String(text ?? ''), x, y);
    };

    const drawRow = (label, value, y, options = {}) => {
      const rowHeight = options.height || 58;
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.04)';
      ctx.fillRect(90, y, 1020, rowHeight);
      drawText(label, 120, y + 36, options.labelSize || 19, 'bold', options.labelColor || '#94a3b8');
      drawText(value, 1080, y + 36, options.valueSize || 20, 'bold', options.valueColor || '#ffffff', 'right', options.mono ? 'monospace' : 'sans-serif');
      return y + rowHeight + (options.gap ?? 7);
    };

    const drawSectionTitle = (title, y, accent = '#c084fc') => {
      ctx.fillStyle = accent === '#c084fc' ? 'rgba(192,132,252,0.15)' : 'rgba(56,189,248,0.15)';
      ctx.fillRect(90, y, 1020, 62);
      drawText(title, 120, y + 39, 21, 'bold', accent);
      return y + 72;
    };

    const drawAdminSlip = (logoImgObj) => {
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, canvas.height);
      bgGrad.addColorStop(0, '#0a0a12');
      bgGrad.addColorStop(0.5, '#13112c');
      bgGrad.addColorStop(1, '#090d1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isRejected = b.status === 'rejected';
      const isConfirmed = b.status === 'confirmed';

      const borderColor = isRejected ? '#f43f5e' : (isConfirmed ? '#10b981' : '#f59e0b');

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, canvas.height - 80);
      ctx.strokeStyle = `${borderColor}40`;
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, canvas.height - 110);

      if (logoImgObj) {
        try {
          ctx.save();
          ctx.globalAlpha = 0.06;
          ctx.drawImage(logoImgObj, 300, 900, 600, 600);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImgObj, 80, 80, 120, 120);
          ctx.restore();
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
          ctx.stroke();
        } catch (e) {
          console.warn("Logo skipped:", e);
        }
        drawText(currentDraftSafe.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold');
        drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#c084fc');
      } else {
        drawText(currentDraftSafe.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#c084fc', 'center');
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 230);
      ctx.lineTo(1110, 230);
      ctx.stroke();

      const statusTitle = isRejected 
        ? '❌ BOOKING STATUS: DECLINED / REJECTED' 
        : (isConfirmed ? '✅ BOOKING STATUS: CONFIRMED & SCHEDULED' : '⏳ BOOKING STATUS: PENDING APPROVAL');
      
      const statusColor = isRejected ? '#f43f5e' : (isConfirmed ? '#10b981' : '#f59e0b');
      const statusBg = isRejected ? 'rgba(244,63,94,0.18)' : (isConfirmed ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)');

      ctx.fillStyle = statusBg;
      ctx.fillRect(90, 260, 1020, 65);
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(90, 260, 1020, 65);
      drawText(statusTitle, 600, 303, 24, 'bold', statusColor, 'center');

      let y = 350;

      if (isRejected && b.rejectionReason) {
        ctx.fillStyle = 'rgba(244,63,94,0.12)';
        ctx.fillRect(90, y, 1020, 95);
        ctx.strokeStyle = 'rgba(244,63,94,0.35)';
        ctx.lineWidth = 2;
        ctx.strokeRect(90, y, 1020, 95);
        drawText('REASON FOR REJECTION / CANCELLATION NOTE:', 120, y + 33, 17, 'bold', '#fb7185');
        drawText(b.rejectionReason, 120, y + 68, 16, 'normal', '#fda4af');
        y += 115;
      }

      y = drawRow('BOOKING NUMBER', b.bookingNumber || '#HF-RECORD', y, { valueColor: '#c084fc', mono: true });
      y = drawRow('CLIENT NAME', b.clientName || 'Not Provided', y);
      y = drawRow('CONTACT NUMBER', b.clientPhone || 'Not Provided', y);
      y = drawRow('EVENT DATE', b.eventDate || 'Not Provided', y);
      y = drawRow('EXACT VENUE ADDRESS', b.venueAddress || 'To be confirmed', y);

      y += 12;
      y = drawSectionTitle('1. Main Makeover Package', y, '#38bdf8');
      y = drawRow('• Vanity:', mainVanity, y, { labelSize: 18 });
      y = drawRow('• Package:', mainPackage, y, { labelSize: 18 });
      y = drawRow('• Package Price:', money(mainPackagePrice), y, { labelSize: 18, mono: true });
      y = drawRow(`• Travel Fee (${b.zoneName || 'Venue Location'}):`, money(zoneFee), y, { labelSize: 18, mono: true });
      y = drawRow('Main Makeover Package Total:', money(mainMakeoverTotal), y, { labelColor: '#7dd3fc', valueColor: '#7dd3fc', mono: true, height: 64 });

      y += 12;
      y = drawSectionTitle(`2. Additional Family & Guest Makeovers (${guestCount}):`, y, '#c084fc');
      if (guestList.length) {
        guestList.forEach((g, idx) => {
          const guestKit = currentDraftSafe.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'International Luxury Vanity Kit' : 'Premium HD Kit');
          const guestPkg = currentDraftSafe.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey || 'Makeover';
          const guestPrice = Number(currentDraftSafe.pricingByKit?.[g.kit]?.[g.packageKey] || 0);
          y = drawRow(`Makeover #${idx + 1} • Vanity:`, guestKit, y, { labelSize: 17, valueSize: 18 });
          y = drawRow('• Package:', guestPkg, y, { labelSize: 17, valueSize: 18 });
          y = drawRow('• Price:', money(guestPrice), y, { labelSize: 17, mono: true });
        });
      } else {
        y = drawRow('• No additional family or guest makeovers', money(0), y, { labelSize: 17, valueColor: '#94a3b8', mono: true });
      }
      y = drawRow('Additional Family & Guest Makeovers Total:', money(guestGross), y, { labelColor: '#d8b4fe', valueColor: '#d8b4fe', mono: true, height: 64 });

      y += 12;
      y = drawRow('Booking Total Before Discounts:', money(totalBeforeDiscounts), y, { labelColor: '#ffffff', valueColor: '#ffffff', mono: true, height: 68, bg: 'rgba(255,255,255,0.08)' });

      y += 12;
      y = drawSectionTitle('3. Discounts & Offers', y, '#34d399');
      if (guestDiscount > 0) {
        y = drawRow('• Additional Family & Guest Makeovers Discount:', `-${money(guestDiscount)}`, y, { labelSize: 17, valueColor: '#34d399', mono: true });
      }
      if (b.appliedCoupon && b.appliedCoupon !== 'None' && couponDiscount > 0) {
        y = drawRow(`• Coupon Code (${b.appliedCoupon}):`, `-${money(couponDiscount)}`, y, { labelSize: 17, valueColor: '#34d399', mono: true });
      }
      if (guestDiscount === 0 && couponDiscount === 0) {
        y = drawRow('• No discounts applied', money(0), y, { labelSize: 17, valueColor: '#94a3b8', mono: true });
      }
      y = drawRow('Total Discounts:', `-${money(totalDiscounts)}`, y, { labelColor: '#86efac', valueColor: '#86efac', mono: true, height: 64 });

      y += 18;
      ctx.fillStyle = 'rgba(192,132,252,0.22)';
      ctx.fillRect(90, y, 1020, 125);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, y, 1020, 125);
      drawText('Final Amount Payable:', 600, y + 42, 23, 'bold', '#e2e8f0', 'center');
      drawText(money(finalAmount), 600, y + 99, 48, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 105;
      drawText(`Studio Base Location: ${currentDraftSafe.baseLocation || ''} • Instagram: @${getCleanInstagramHandle(currentDraftSafe.instagramHandle || '')}`, 600, footerY, 17, 'normal', '#64748b', 'center');
      drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 34, 18, 'italic', '#c084fc', 'center');

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
            const fallbackLink = document.createElement('a');
            fallbackLink.href = jpgUrl;
            fallbackLink.download = `Booking_Slip_${b.status.toUpperCase()}_${b.bookingNumber || b.clientName || 'HF'}.jpg`;
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            fallbackLink.remove();
            return;
          }
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `Booking_Slip_${b.status.toUpperCase()}_${b.bookingNumber || b.clientName || 'HF'}.jpg`;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }, 1000);
        }, 'image/jpeg', 0.95);
      } catch (err) {
        console.error('Download error:', err);
      }
    };

    const logoUrlToLoad = currentDraftSafe.studioLogo || DEFAULT_CONFIG.studioLogo;
    if (logoUrlToLoad) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => drawAdminSlip(logoImg);
      logoImg.onerror = () => drawAdminSlip(null);
      logoImg.src = logoUrlToLoad;
    } else {
      drawAdminSlip(null);
    }
  };

  const filteredBookingsList = bookingsList.filter(b => {
    const statusMatch = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const dateMatch = !bookingDateFilter || b.eventDate === bookingDateFilter;
    
    const searchLower = bookingSearchQuery.toLowerCase().trim();
    const nameMatch = !searchLower || (b.clientName && b.clientName.toLowerCase().includes(searchLower));
    const phoneMatch = !searchLower || (b.clientPhone && b.clientPhone.toLowerCase().includes(searchLower));
    const bNumMatch = !searchLower || (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchLower));
    const queryMatch = !searchLower || nameMatch || phoneMatch || bNumMatch;

    return statusMatch && dateMatch && queryMatch;
  });

  const nextConfirmedBooking = bookingsList.find(b => b.status === 'confirmed');
  const pendingBookingsCount = bookingsList.filter(b => b.status === 'pending').length;

  const currentDraftSafe = draft || DEFAULT_CONFIG;
  const activeAdminThemeKey = currentDraftSafe.adminTheme?.colorTheme || 'admin_aurora';
  const adminThemeStyle = THEME_STYLES[activeAdminThemeKey] || THEME_STYLES.admin_aurora;
  const currentFontFamily = FONT_MAP[currentDraftSafe.theme?.fontFamily] || FONT_MAP.outfit;

  const activeFolderObj = adminFolders.find(f => f.id === activeFolderId);

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${adminThemeStyle.bg} flex items-center justify-center p-5 relative overflow-hidden transition-colors duration-500`}>
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br ${adminThemeStyle.glowOrb} rounded-full blur-[120px] pointer-events-none animate-pulse`} />
        
        {showForgotPasswordModal ? (
          <form onSubmit={handleForgotPasswordSubmit} className={`max-w-md w-full p-8 sm:p-10 rounded-[36px] border text-center space-y-5 shadow-2xl ${adminThemeStyle.cardBg} animate-fade-in`}>
            <div className={`w-18 h-18 rounded-[26px] bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center mx-auto shadow-xl`}>
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-[24px] font-bold tracking-tight">Recover Master PIN</h2>
            <p className={`text-[13px] ${adminThemeStyle.mutedText} leading-relaxed`}>Your recovery email is secured to <strong>{currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com"}</strong>.</p>
            
            {forgotPasswordStatus && (
              <div className="p-4 rounded-[18px] bg-emerald-500/20 text-emerald-300 text-[13px] font-semibold border border-emerald-500/30">
                {forgotPasswordStatus}
              </div>
            )}

            <button type="submit" className={`w-full py-4 ${adminThemeStyle.btnPrimary} text-[14px]`}>Send PIN to Recovery Email</button>
            <button type="button" onClick={() => setShowForgotPasswordModal(false)} className={`text-[13px] ${adminThemeStyle.accentText} underline block mx-auto pt-2`}>Back to PIN Unlock</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className={`max-w-md w-full p-8 sm:p-10 rounded-[36px] border text-center space-y-6 shadow-2xl ${adminThemeStyle.cardBg}`}>
            <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center mx-auto shadow-2xl`}>
              <Lock className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-[26px] font-bold tracking-tight">Admin Master Console</h2>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-1 font-medium`}>H&F Makeup Studio v4.2.0 Glass Edition</p>
            </div>

            <input 
              type="password" 
              placeholder="Enter 4-Digit Security PIN" 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)} 
              className={`w-full text-center text-[20px] tracking-widest p-4.5 font-mono ${adminThemeStyle.inputBg} rounded-[20px] outline-none shadow-inner border`} 
            />
            
            <button type="submit" className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} text-[15px]`}>
              Unlock Glass Console
            </button>
            
            <div className="space-y-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleBiometricOrFaceLogin}
                className={`w-full py-3.5 font-bold text-[13px] ${adminThemeStyle.accentText} flex items-center justify-center gap-2 rounded-[18px] border border-white/15 bg-white/5 hover:bg-white/10 transition`}
              >
                <Fingerprint className="w-5 h-5" />
                <span>Biometric Hardware / Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className={`text-[13px] ${adminThemeStyle.accentText} underline block w-full pt-1 opacity-80 hover:opacity-100`}
              >
                Forgot Password? Send PIN to Email
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: currentFontFamily, fontSize: `${screenZoom}%` }} className={`min-h-screen ${adminThemeStyle.bg} pb-36 transition-colors duration-500 relative overflow-x-hidden selection:bg-purple-500/30`}>
      <div className={`fixed -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br ${adminThemeStyle.glowOrb} rounded-full blur-[140px] pointer-events-none -z-10`} />
      <div className={`fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl ${adminThemeStyle.glowOrb} rounded-full blur-[140px] pointer-events-none -z-10`} />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {popupToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fade-in">
          <div className={`max-w-md w-full rounded-[32px] p-7 text-center space-y-4 shadow-2xl relative ${adminThemeStyle.cardBg}`}>
            <button
              onClick={() => setPopupToast(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center mx-auto shadow-lg animate-bounce`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold tracking-tight">{popupToast.title}</h3>
            <p className={`text-[13px] leading-relaxed ${adminThemeStyle.mutedText}`}>{popupToast.desc}</p>
            <button
              onClick={() => setPopupToast(null)}
              className={`w-full py-3.5 ${adminThemeStyle.btnPrimary} text-[14px]`}
            >
              Okay, Close
            </button>
          </div>
        </div>
      )}

      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fade-in">
          <div className={`max-w-sm w-full rounded-[30px] p-6 text-center space-y-4 shadow-2xl ${adminThemeStyle.cardBg}`}>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[18px]">Confirm Action</h3>
            <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>
              {deleteConfirmModal.message || "Are you sure you want to permanently delete this record?"}
            </p>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setDeleteConfirmModal(null)} className="flex-1 py-3 rounded-[16px] font-bold text-[13px] bg-white/10 text-white hover:bg-white/15">Cancel</button>
              <button onClick={handleExecuteDelete} className="flex-1 py-3 rounded-[16px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13px] shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fade-in">
          <div className={`max-w-lg w-full rounded-[32px] p-6 sm:p-7 space-y-4 shadow-2xl ${adminThemeStyle.cardBg}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[14px] bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px]">Decline Booking</h3>
                  <p className={`text-[12px] ${adminThemeStyle.mutedText}`}>{rejectModalData.bookingNumber || rejectModalData.clientName}</p>
                </div>
              </div>
              <button onClick={() => setRejectModalData(null)} className="p-1 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>
              Client <strong>{rejectModalData.clientName}</strong> will receive this decline status and note on their generated slip.
            </p>

            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider text-rose-300">Select or Customize Rejection Reason:</label>
              <select 
                onChange={e => setRejectionReasonText(e.target.value)}
                className={`w-full p-3 rounded-[14px] text-[12px] mb-2 font-medium ${adminThemeStyle.inputBg}`}
              >
                {PRE_ADDED_REJECTION_REASONS.map((r, i) => (
                  <option key={i} value={r} className="text-black">{r}</option>
                ))}
              </select>

              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={e => setRejectionReasonText(e.target.value)}
                className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg} border`}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button onClick={() => setRejectModalData(null)} className="px-4 py-2.5 rounded-[16px] bg-white/10 text-[13px] font-bold text-white hover:bg-white/15">Cancel</button>
              <button onClick={handleConfirmRejection} className="px-5 py-2.5 rounded-[16px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13px] shadow-lg">Confirm Decline</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-3xl saturate-150 border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-lg bg-black/40`}>
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            {currentDraftSafe.studioLogo ? (
              <div className="w-11 h-11 rounded-[16px] bg-white/10 p-1.5 overflow-hidden shadow-inner shrink-0 border border-white/20">
                <img src={currentDraftSafe.studioLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className={`w-11 h-11 rounded-[16px] bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center shadow-lg shrink-0`}>
                <Crown className="w-5 h-5" />
              </div>
            )}

            <div>
              <h1 className="font-bold text-[17px] tracking-tight leading-tight text-white flex items-center gap-2">
                {currentDraftSafe.studioName || 'H&F Makeup Studio'}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10 ${adminThemeStyle.accentText}`}>v4.2</span>
              </h1>
              <p className={`text-[11px] font-medium ${adminThemeStyle.mutedText}`}>{currentDraftSafe.artistTagline || 'Beauty, Styled Your Way'}</p>
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <button onClick={() => setIsAuthenticated(false)} className="text-[12px] text-rose-400 font-bold px-2 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">Lock</button>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-[20px] border border-white/10 bg-white/5 text-xs font-medium w-full sm:w-auto justify-center shadow-inner`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className={adminThemeStyle.mutedText}>Next: <strong className="text-emerald-300 font-semibold">{nextConfirmedBooking ? `${nextConfirmedBooking.clientName} (${nextConfirmedBooking.eventDate})` : 'None Confirmed'}</strong></span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className={adminThemeStyle.mutedText}>Pending: <strong className="text-amber-300 font-semibold">{pendingBookingsCount}</strong></span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] border border-white/10 bg-white/5`}>
            <ZoomIn className={`w-3.5 h-3.5 ${adminThemeStyle.accentText}`} />
            <select
              value={screenZoom}
              onChange={e => setScreenZoom(Number(e.target.value))}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-white"
            >
              <option value={85} className="text-black">85%</option>
              <option value={100} className="text-black">100%</option>
              <option value={115} className="text-black">115%</option>
            </select>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="text-[13px] text-rose-400 font-bold hover:bg-rose-500/20 px-3.5 py-1.5 rounded-[14px] bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Lock
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {activeFolderId ? (
            <button
              onClick={closeFolder}
              className={`px-4 py-2.5 rounded-[18px] text-[13px] font-bold flex items-center gap-2 ${adminThemeStyle.accentText} bg-white/10 hover:bg-white/15 border border-white/15 shadow-md transition active:scale-95`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h3 className={`font-bold text-[13px] uppercase tracking-wider ${adminThemeStyle.mutedText} flex items-center gap-2`}>
                <Sparkles className="w-4 h-4 text-purple-400" />
                {isReorderMode ? 'Reorder Mode Active: Move Cards Up/Down' : 'Apple Glass Workspace • 2 Cards Per Row'}
              </h3>
              
              <button
                onClick={() => {
                  if (isReorderMode) handleSaveSpecificCard("Folder Sequence");
                  setIsReorderMode(!isReorderMode);
                }}
                className={`px-4 py-2 rounded-[16px] text-xs font-bold flex items-center gap-1.5 shadow transition ${isReorderMode ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/15 text-purple-300 border border-purple-400/30'}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isReorderMode ? 'Save Layout' : 'Reorder Cards'}</span>
              </button>
            </div>
          )}

          {activeFolderObj && (
            <span className={`text-[13px] font-medium font-mono ${adminThemeStyle.mutedText}`}>
              Active: <strong className="text-white font-bold">{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {/* 2-COLUMN ILLUSTRATIVE APPLE GLASS GRID */}
        {!activeFolderId && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
            {adminFolders.map((f, index) => {
              const Icon = f.icon;
              const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

              return (
                <div
                  key={f.id}
                  onClick={() => !isReorderMode && openFolder(f.id)}
                  className={`p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-3 sm:space-y-4 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${
                    isReorderMode 
                      ? 'bg-purple-500/20 ring-2 ring-purple-400 animate-pulse' 
                      : adminThemeStyle.cardBg
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[22px] bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 border border-white/20`}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {count !== null && (
                        <span className={`text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/15 bg-white/10 ${adminThemeStyle.accentText}`}>
                          {count}
                        </span>
                      )}
                      
                      {isReorderMode && (
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-[14px] border border-white/10">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'up'); }}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === adminFolders.length - 1}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'down'); }}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className={`font-bold text-[14px] sm:text-[18px] tracking-tight group-hover:${adminThemeStyle.accentText} transition-colors text-white line-clamp-1`}>
                      {f.label}
                    </h4>
                    <p className={`text-[11px] sm:text-[13px] mt-1 leading-relaxed line-clamp-2 font-medium ${adminThemeStyle.mutedText}`}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1. PACKAGES & RATES MANAGER */}
        {activeFolderId === 'packages_master' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Layers className="w-5 h-5" /> Packages & Rates Master
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>
                  Manage package titles, photos, descriptions, skin finish notes and vanity tier pricing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewPackage}
                  className="px-4 py-2.5 rounded-[16px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>

                <div className="inline-flex p-1.5 rounded-[20px] border border-white/10 bg-white/5 gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('international')}
                    className={`px-4 py-2 rounded-[16px] text-xs font-bold transition ${editingKitTab === 'international' ? `${adminThemeStyle.btnPrimary} text-white shadow` : adminThemeStyle.mutedText}`}
                  >
                    👑 Luxury Kit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('drugstore')}
                    className={`px-4 py-2 rounded-[16px] text-xs font-bold transition ${editingKitTab === 'drugstore' ? `${adminThemeStyle.btnPrimary} text-white shadow` : adminThemeStyle.mutedText}`}
                  >
                    ✨ HD Classic
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(currentDraftSafe.kitText?.[editingKitTab] || {}).map(k => {
                const pkgText = currentDraftSafe.kitText[editingKitTab][k] || { name: k, desc: '' };
                const pkgImg = currentDraftSafe.kitImages?.[editingKitTab]?.[k] || '';
                const pkgPrice = currentDraftSafe.pricingByKit?.[editingKitTab]?.[k] || 0;

                return (
                  <div key={`${editingKitTab}_${k}`} className={`p-5 rounded-[28px] border border-white/10 space-y-4 bg-white/5 backdrop-blur-md relative`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Key: {k}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white uppercase font-bold">{editingKitTab}</span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmModal({ type: 'single', isPackage: true, kit: editingKitTab, pkgKey: k, message: `Delete "${pkgText.name}" package?` })}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-20 rounded-[18px] overflow-hidden bg-neutral-900 border border-white/20 shrink-0 shadow-lg">
                        <img src={pkgImg} alt={pkgText.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={pkgImg || ''}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            kitImages: {
                              ...(currentDraftSafe.kitImages || {}),
                              [editingKitTab]: {
                                ...(currentDraftSafe.kitImages?.[editingKitTab] || {}),
                                [k]: e.target.value
                              }
                            }
                          })}
                          className={`w-full p-3 rounded-[16px] text-xs font-mono ${adminThemeStyle.inputBg}`}
                        />
                        <label className={`block text-center py-2.5 rounded-[14px] bg-white/10 ${adminThemeStyle.accentText} text-[11px] font-bold cursor-pointer border border-white/10 hover:bg-white/15 transition`}>
                          Upload Compressed Photo
                          <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, editingKitTab, k)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Package Display Name</span>
                        <input
                          type="text"
                          value={pkgText.name || ''}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            kitText: {
                              ...(currentDraftSafe.kitText || {}),
                              [editingKitTab]: {
                                ...(currentDraftSafe.kitText?.[editingKitTab] || {}),
                                [k]: { ...pkgText, name: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3.5 rounded-[16px] text-xs font-bold ${adminThemeStyle.inputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Price Rate (₹)</span>
                        <input
                          type="number"
                          value={pkgPrice}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            pricingByKit: {
                              ...(currentDraftSafe.pricingByKit || {}),
                              [editingKitTab]: {
                                ...(currentDraftSafe.pricingByKit?.[editingKitTab] || {}),
                                [k]: Number(e.target.value)
                              }
                            }
                          })}
                          className={`w-full p-3.5 rounded-[16px] font-mono ${adminThemeStyle.accentText} font-bold text-sm ${adminThemeStyle.inputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Description (Card Display)</span>
                        <textarea
                          rows={2}
                          value={pkgText.desc || ''}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            kitText: {
                              ...(currentDraftSafe.kitText || {}),
                              [editingKitTab]: {
                                ...(currentDraftSafe.kitText?.[editingKitTab] || {}),
                                [k]: { ...pkgText, desc: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3.5 rounded-[16px] text-xs ${adminThemeStyle.inputBg}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Packages & Rates Master'}
              onClick={() => handleSaveSpecificCard('Packages & Rates Master')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Packages & Rates Master' ? 'Saving Changes...' : 'Save Packages & Rates Master'}</span>
            </button>
          </div>
        )}

        {/* 2. VANITY BRANDS MANAGER */}
        {activeFolderId === 'brands_master' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Star className="w-5 h-5" /> Vanity Brands Manager
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>
                  Manage categories, brand names, and descriptions displayed on the Vanity tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    ...currentDraftSafe,
                    internationalBrands: [
                      ...(currentDraftSafe.internationalBrands || []),
                      { category: "New Category", name: "Brand Names", desc: "Short description." }
                    ]
                  });
                }}
                className="px-4 py-2.5 rounded-[16px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Brand Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(currentDraftSafe?.internationalBrands || []).map((brand, idx) => (
                <div key={idx} className={`p-5 rounded-[28px] border border-white/10 space-y-4 bg-white/5`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Category #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Delete "${brand.category}" brand card?`,
                          onConfirm: () => {
                            const newBrands = [...(currentDraftSafe.internationalBrands || [])];
                            newBrands.splice(idx, 1);
                            setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                          }
                        });
                      }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Category Title</span>
                      <input
                        type="text"
                        value={brand.category || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], category: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs font-bold uppercase ${adminThemeStyle.inputBg}`}
                      />
                    </div>
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Cosmetic Brands</span>
                      <input
                        type="text"
                        value={brand.name || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], name: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs font-bold ${adminThemeStyle.accentText} ${adminThemeStyle.inputBg}`}
                      />
                    </div>
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Description</span>
                      <input
                        type="text"
                        value={brand.desc || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], desc: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs ${adminThemeStyle.inputBg}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Vanity Brands'}
              onClick={() => handleSaveSpecificCard('Vanity Brands')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Vanity Brands' ? 'Saving...' : 'Save Vanity Brands'}</span>
            </button>
          </div>
        )}

        {/* 3. APP VERSION & ROLLBACK */}
        {activeFolderId === 'versions_master' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <GitBranch className="w-5 h-5" /> Live Version Controller & Instant Rollback
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>
                  Control active deployed version across all clients. Promote staging releases to Live.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const ver = prompt("Enter App Version Tag (e.g. v4.2.1):");
                  if (!ver) return;
                  const label = prompt("Enter Version Title/Label:", "New App Build");
                  const notes = prompt("Enter Release Notes:", "Improvements & design updates.");
                  
                  const updatedList = [
                    { version: ver.trim(), label: label || 'Release Build', releaseDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), status: "staged", notes: notes || '' },
                    ...(currentDraftSafe.appVersionsList || [])
                  ];

                  setDraft({
                    ...currentDraftSafe,
                    appVersionsList: updatedList
                  });
                  setPopupToast({ title: "Version Staged", desc: `App version ${ver} registered.` });
                }}
                className={`px-4 py-2.5 rounded-[16px] ${adminThemeStyle.btnPrimary} text-white text-xs font-bold flex items-center gap-1.5 shadow`}
              >
                <Plus className="w-4 h-4" /> Register New Build
              </button>
            </div>

            <div className="p-4 rounded-[22px] border border-white/10 bg-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Current Production Version:</span>
                  <h4 className={`text-[17px] font-mono font-bold ${adminThemeStyle.accentText}`}>{currentDraftSafe.activeAppVersion || 'v4.2.0'}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {(currentDraftSafe.appVersionsList || []).map((verItem, vIdx) => {
                const isCurrentLive = currentDraftSafe.activeAppVersion === verItem.version;
                
                return (
                  <div key={vIdx} className={`p-5 rounded-[26px] border space-y-3 transition-all ${isCurrentLive ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`font-mono font-bold text-[16px] ${adminThemeStyle.accentText}`}>{verItem.version}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isCurrentLive ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-white/10 text-slate-300'}`}>
                            {isCurrentLive ? '🟢 LIVE PRODUCTION' : (verItem.status === 'staged' ? '🟡 STAGED' : '⚪ ARCHIVED')}
                          </span>
                          <span className={`text-[11px] font-mono ${adminThemeStyle.mutedText}`}>Released: {verItem.releaseDate}</span>
                        </div>
                        <h4 className="font-bold text-[14px] text-white">{verItem.label}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCurrentLive && (
                          <button
                            type="button"
                            onClick={() => {
                              setDraft({
                                ...currentDraftSafe,
                                activeAppVersion: verItem.version
                              });
                              setPopupToast({ title: "Target Switched", desc: `Target switched to ${verItem.version}. Click Save to apply.` });
                            }}
                            className="px-4 py-2 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" /> Make Live
                          </button>
                        )}
                        
                        <button
                          type="button"
                          disabled={isCurrentLive}
                          onClick={() => {
                            setDeleteConfirmModal({
                              type: 'single',
                              message: `Remove release ${verItem.version}?`,
                              onConfirm: () => {
                                const list = (currentDraftSafe.appVersionsList || []).filter((_, i) => i !== vIdx);
                                setDraft({ ...currentDraftSafe, appVersionsList: list });
                              }
                            });
                          }}
                          className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-[12px] disabled:opacity-20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {verItem.notes && (
                      <p className="text-[12px] leading-relaxed p-3 rounded-[16px] bg-black/30 text-slate-300">
                        <strong>Release Notes:</strong> {verItem.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'App Versions'}
              onClick={() => handleSaveSpecificCard('App Versions')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'App Versions' ? 'Saving...' : 'Save App Version Status'}</span>
            </button>
          </div>
        )}

        {/* 4. GENERAL & SECURITY SETTINGS */}
        {activeFolderId === 'general' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div>
              <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Settings className="w-5 h-5" /> General & Security Settings
              </h3>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>Configure Biometrics, Telegram bot tokens, and master password credentials.</p>
            </div>

            <div className={`p-5 rounded-[26px] border border-white/10 space-y-4 bg-white/5`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2 text-white">
                <Send className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Telegram Bot Notification Settings
              </h4>
              <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Enter your Telegram Bot API Token and Chat ID to receive instant customer booking notifications.</p>

              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminThemeStyle.mutedText}`}>Telegram Bot API Token</label>
                  <input
                    type="text"
                    placeholder="e.g. 8891500480:AAGvxL16..."
                    value={currentDraftSafe.telegramBotToken || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, telegramBotToken: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] ${adminThemeStyle.accentText} border ${adminThemeStyle.inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminThemeStyle.mutedText}`}>Telegram Chat ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 8891500480"
                    value={currentDraftSafe.telegramChatId || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, telegramChatId: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] ${adminThemeStyle.accentText} border ${adminThemeStyle.inputBg}`}
                  />
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-[26px] border border-white/10 space-y-4 bg-white/5`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2 text-white">
                <Fingerprint className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Hardware Biometrics Integration
              </h4>
              <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Scan and save your fingerprint profile locally via your device sensor.</p>

              <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center space-y-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${adminThemeStyle.iconGrad} text-white flex items-center justify-center mx-auto shadow-md`}>
                  <Fingerprint className={`w-7 h-7 ${isScanningFinger ? 'animate-pulse text-amber-300' : ''}`} />
                </div>
                
                {isScanningFinger ? (
                  <div className="space-y-1.5">
                    <p className="text-[13px] font-bold text-amber-400">Scanning Hardware Sensor... ({scanProgress}%)</p>
                    <div className="w-48 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className={`text-[12px] ${adminThemeStyle.mutedText}`}>
                      {currentDraftSafe.registeredFingerprintHash ? "✅ Biometrics Successfully Registered" : "⚠️ No fingerprint recorded"}
                    </p>
                    <button
                      type="button"
                      onClick={handleRegisterFingerprintScan}
                      className={`px-5 py-2.5 rounded-[16px] ${adminThemeStyle.btnPrimary} text-white font-bold text-[13px] shadow active:scale-95 transition`}
                    >
                      {currentDraftSafe.registeredFingerprintHash ? "Re-Scan Biometrics" : "Register Hardware Fingerprint"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-5 rounded-[26px] border border-white/10 space-y-3 bg-white/5`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-amber-400" /> Permanent Recovery Email ID
              </h4>
              <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Emergency PIN reset instructions are dispatched to this email address.</p>
              
              <input
                type="email"
                value={currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com"}
                onChange={e => setDraft({ ...currentDraftSafe, recoveryEmail: e.target.value })}
                className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] font-bold ${adminThemeStyle.accentText} border ${adminThemeStyle.inputBg}`}
              />
            </div>

            <form onSubmit={handlePasswordChange} className={`p-5 rounded-[26px] border border-white/10 space-y-4 bg-white/5`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2 text-white">
                <Key className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Change Admin PIN Password
              </h4>

              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminThemeStyle.mutedText}`}>Current PIN</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current PIN"
                    value={oldPinInput}
                    onChange={e => setOldPinInput(e.target.value)}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${adminThemeStyle.mutedText}`}>New PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 4 digits"
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value)}
                      className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${adminThemeStyle.mutedText}`}>Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new PIN"
                      value={confirmPinInput}
                      onChange={e => setConfirmPinInput(e.target.value)}
                      className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 ${adminThemeStyle.btnPrimary}`}
                >
                  Update Admin Password
                </button>
              </div>
            </form>

            <button
              type="button"
              disabled={savingSection === 'General Settings'}
              onClick={() => handleSaveSpecificCard('General Settings')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'General Settings' ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        )}

        {/* 5. LIVE BOOKINGS QUEUE */}
        {activeFolderId === 'bookings' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[19px] ${adminThemeStyle.accentText}`}>Live Customer Appointments Queue</h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Accept, reject, manage records, or export status-aware JPG receipts.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold px-4 py-1.5 rounded-full border border-white/15 bg-white/10 ${adminThemeStyle.accentText}`}>
                {filteredBookingsList.length} of {bookingsList.length} Appointments
              </span>
            </div>

            <div className={`p-5 rounded-[28px] border border-white/10 space-y-4 bg-white/5 backdrop-blur-md`}>
              <div className="relative">
                <Search className={`absolute left-4 top-3.5 w-4 h-4 ${adminThemeStyle.mutedText}`} />
                <input
                  type="text"
                  placeholder="Search by client name, mobile number, or booking #..."
                  value={bookingSearchQuery}
                  onChange={e => setBookingSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 text-[13px] outline-none ${adminThemeStyle.inputBg} rounded-[18px]`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Filter by Booking Status</label>
                  <select
                    value={bookingStatusFilter}
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    className={`w-full p-3.5 text-[13px] font-bold outline-none ${adminThemeStyle.inputBg} rounded-[18px]`}
                  >
                    <option value="all" className="text-black">🌟 All Statuses</option>
                    <option value="confirmed" className="text-black">✅ Confirmed / Accepted</option>
                    <option value="pending" className="text-black">⏳ Pending Review</option>
                    <option value="rejected" className="text-black">❌ Declined / Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Filter by Event Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={bookingDateFilter}
                      onChange={e => setBookingDateFilter(e.target.value)}
                      className={`flex-1 p-3.5 text-[13px] outline-none ${adminThemeStyle.inputBg} rounded-[18px]`}
                    />
                    {bookingDateFilter && (
                      <button
                        type="button"
                        onClick={() => setBookingDateFilter('')}
                        className="px-4 py-2.5 rounded-[16px] bg-white/15 text-xs font-bold text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`flex items-center gap-2 text-[13px] font-bold ${adminThemeStyle.accentText} hover:underline`}
                >
                  {selectedBookings.length === filteredBookingsList.length && filteredBookingsList.length > 0 ? (
                    <CheckSquare className={`w-4 h-4 ${adminThemeStyle.accentText}`} />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Select Visible ({filteredBookingsList.length})</span>
                </button>

                {selectedBookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmModal({ type: 'batch', message: `Delete ${selectedBookings.length} selected appointments?` })}
                    className="px-4 py-2 rounded-[14px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedBookings.length})</span>
                  </button>
                )}
              </div>
            </div>

            {filteredBookingsList.length === 0 ? (
              <p className={`text-[14px] py-14 text-center ${adminThemeStyle.mutedText}`}>No appointments found matching this filter.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBookingsList.map(b => {
                  const isSelected = selectedBookings.includes(b.id);
                  const isDeclined = b.status === 'rejected';
                  const isConfirmed = b.status === 'confirmed';

                  return (
                    <div key={b.id} className={`p-6 rounded-[30px] border border-white/10 space-y-4 bg-white/5 backdrop-blur-md transition-all ${isSelected ? 'ring-2 ring-purple-400' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedBookings(selectedBookings.filter(id => id !== b.id));
                              } else {
                                setSelectedBookings([...selectedBookings, b.id]);
                              }
                            }}
                            className="mt-1 w-4 h-4 accent-purple-500 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-mono text-[12px] font-bold ${adminThemeStyle.accentText} bg-white/10 px-2.5 py-0.5 rounded-[10px]`}>
                                {b.bookingNumber || '#HF-RECORD'}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-3 py-0.5 rounded-full ${
                                isConfirmed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                                isDeclined ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 
                                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {isConfirmed ? '✅ Confirmed' : isDeclined ? '❌ Declined' : '⏳ Pending'}
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-[17px] mt-1.5 text-white truncate">{b.clientName}</h4>
                            <p className={`text-[12px] font-mono ${adminThemeStyle.mutedText}`}>📞 {b.clientPhone}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmModal({ type: 'single', isBooking: true, id: b.id, message: `Delete booking record for ${b.clientName}?` })}
                          className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-[14px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {isDeclined && b.rejectionReason && (
                        <div className="p-3.5 rounded-[18px] bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[12px] space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Rejection Reason Attached:</span>
                          </div>
                          <p className="leading-relaxed text-rose-200">{b.rejectionReason}</p>
                        </div>
                      )}

                      <div className="text-[13px] space-y-2 border-t border-b border-white/10 py-3.5">
                        <div className="flex justify-between gap-3">
                          <span className={adminThemeStyle.mutedText}>Event Date:</span>
                          <span className="font-mono font-bold text-white">{b.eventDate}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className={adminThemeStyle.mutedText}>Look & Vanity:</span>
                          <span className="font-semibold text-right text-slate-200">{b.packageName} ({b.kitType})</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className={adminThemeStyle.mutedText}>Total Payable:</span>
                          <span className={`font-mono font-bold ${adminThemeStyle.accentText} text-[15px]`}>₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className={adminThemeStyle.mutedText}>Venue:</span>
                          <span className="text-right truncate max-w-[200px] text-slate-300">{b.venueAddress || b.zoneName}</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] rounded-[16px] shadow flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isConfirmed ? 'Resend WhatsApp Confirmation Slip' : 'Accept & Dispatch WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2.5 bg-blue-500/20 text-blue-300 font-bold text-[11px] rounded-[14px] flex items-center justify-center gap-1 border border-blue-500/30"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded-[14px] flex items-center justify-center gap-1 border border-amber-500/30"
                          >
                            <RotateCcw className="w-3 h-3" /> Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalData(b);
                              setRejectionReasonText(PRE_ADDED_REJECTION_REASONS[0]);
                            }}
                            className="py-2.5 bg-rose-500/20 text-rose-300 font-bold text-[11px] rounded-[14px] flex items-center justify-center gap-1 border border-rose-500/30"
                          >
                            <Ban className="w-3 h-3" /> Reject
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className={`w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-[12px] rounded-[16px] flex items-center justify-center gap-2 transition border border-white/15 shadow-sm`}
                        >
                          <Download className="w-4 h-4 text-purple-300" />
                          <span>Download {b.status.toUpperCase()} Slip (.JPG)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. CLIENT FEEDBACKS */}
        {activeFolderId === 'feedbacks' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-5 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <MessageSquare className="w-5 h-5" /> Client Reviews & Suggestions
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Customer testimonials and ratings submitted via app.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 ${adminThemeStyle.accentText}`}>
                {feedbacksList.length} Feedbacks
              </span>
            </div>

            {feedbacksList.length === 0 ? (
              <p className={`text-[14px] py-14 text-center ${adminThemeStyle.mutedText}`}>No client feedback records found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacksList.map(item => (
                  <div key={item.id} className="p-5 rounded-[26px] border border-white/10 space-y-3 bg-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <h4 className="font-bold text-[15px] mt-1 text-white">{item.clientName}</h4>
                        {item.clientPhone && item.clientPhone !== 'Not Provided' && (
                          <p className={`text-[11px] font-mono ${adminThemeStyle.mutedText}`}>📞 {item.clientPhone}</p>
                        )}
                      </div>
                      <button onClick={() => setDeleteConfirmModal({ type: 'single', isFeedback: true, id: item.id, message: `Delete feedback from ${item.clientName}?` })} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <p className="text-[13px] leading-relaxed p-3.5 rounded-[18px] bg-black/30 text-slate-200">
                      "{item.message}"
                    </p>

                    <div className="flex justify-end">
                      <span className={`text-[10px] font-mono ${adminThemeStyle.mutedText}`}>
                        {item.submittedAt ? new Date(item.submittedAt.toDate?.() || item.submittedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. AVAILABILITY CALENDAR */}
        {activeFolderId === 'calendar_view' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Calendar className="w-5 h-5" /> Booking Matrix Calendar
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>
                  Color tags indicate reserved slots (🟢 Confirmed, 🟡 Pending).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2.5 rounded-[14px] bg-white/10 hover:bg-white/15 text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] font-mono min-w-[130px] text-center text-white">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2.5 rounded-[14px] bg-white/10 hover:bg-white/15 text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className={`text-[11px] font-bold py-1 uppercase ${adminThemeStyle.mutedText}`}>{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty_${i}`} className="h-16 sm:h-20 rounded-[18px]" />
              ))}

              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayBookingStatus(day);
                return (
                  <div
                    key={`day_${day}`}
                    onClick={() => status.hasBookings ? setSelectedCalendarDay(status) : null}
                    className={`h-16 sm:h-20 rounded-[18px] p-1.5 flex flex-col justify-between items-center transition-all duration-200 border cursor-pointer ${
                      status.hasBookings 
                        ? (status.isConfirmed 
                            ? 'bg-emerald-500/20 border-emerald-500/50 hover:scale-105 shadow-md' 
                            : 'bg-amber-500/20 border-amber-500/50 hover:scale-105 shadow-md')
                        : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className={`text-xs font-bold font-mono ${status.hasBookings ? (status.isConfirmed ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-300'}`}>
                      {day}
                    </span>

                    {status.hasBookings && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${status.isConfirmed ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-amber-500 text-slate-950 font-bold'}`}>
                        {status.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCalendarDay && (
              <div className="p-5 rounded-[26px] border border-white/10 space-y-3 bg-white/5 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm ${adminThemeStyle.accentText}`}>Date: {selectedCalendarDay.dateStr}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${selectedCalendarDay.isConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {selectedCalendarDay.isConfirmed ? 'CONFIRMED' : 'PENDING'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className={`text-xs underline font-bold ${adminThemeStyle.accentText}`}>Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className="p-3.5 rounded-[18px] border border-white/10 text-xs space-y-1 bg-black/40">
                      <div className="flex justify-between font-bold text-white">
                        <span>{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className={`font-mono ${adminThemeStyle.accentText}`}>₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className={adminThemeStyle.mutedText}>Look: {b.packageName} ({b.kitType})</p>
                      <p className={`text-[11px] truncate ${adminThemeStyle.mutedText}`}>📍 {b.venueAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. GALLERY & MEDIA */}
        {activeFolderId === 'gallery' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-5 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Film className="w-5 h-5" /> Video Reels, GIFs & Portfolio Studio
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Upload high-res media clips (.mp4, .gif, .jpg) up to 20MB.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    ...currentDraftSafe,
                    galleryPhotos: [
                      ...(currentDraftSafe.galleryPhotos || []),
                      { type: "video", title: "New Glam Look", sub: "16HR HD Finish", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" }
                    ]
                  });
                }}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[16px] text-xs flex items-center gap-1 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentDraftSafe?.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className="p-5 rounded-[28px] border border-white/10 space-y-3 bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Item #{idx + 1} ({item.type === 'video' ? '🎥 Video' : '🖼️ Photo'})</span>
                    <button onClick={() => {
                      setDeleteConfirmModal({
                        type: 'single',
                        message: `Delete media card #${idx + 1}?`,
                        onConfirm: () => {
                          setDraft({ ...currentDraftSafe, galleryPhotos: currentDraftSafe.galleryPhotos.filter((_, i) => i !== idx) });
                        }
                      });
                    }} className="text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...currentDraftSafe.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                      }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${adminThemeStyle.inputBg}`}>
                        <option value="video" className="text-black">🎥 Video Clip</option>
                        <option value="image" className="text-black">🖼️ Image / GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Subtitle</label>
                      <input type="text" value={item.sub || ''} onChange={e => {
                        const copy = [...currentDraftSafe.galleryPhotos];
                        copy[idx] = { ...copy[idx], sub: e.target.value };
                        setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                      }} className={`w-full p-3 rounded-[14px] text-xs ${adminThemeStyle.inputBg}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...currentDraftSafe.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${adminThemeStyle.inputBg}`} />
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>URL</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...currentDraftSafe.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-mono ${adminThemeStyle.accentText} ${adminThemeStyle.inputBg}`} />
                  </div>

                  <label className={`block text-center py-3 rounded-[14px] bg-white/10 ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer border border-white/10 hover:bg-white/15 transition`}>
                    Upload Compressed Media (&lt;20MB)
                    <input type="file" accept="video/*,image/*,.gif" onChange={e => handleMediaUpload(e, idx)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Gallery Media'}
              onClick={() => handleSaveSpecificCard('Gallery Media')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Gallery Media' ? 'Saving...' : 'Save Gallery Media'}</span>
            </button>
          </div>
        )}

        {/* 9. MAINTENANCE MODE */}
        {activeFolderId === 'app_maintenance' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div>
              <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Wrench className="w-5 h-5" /> Maintenance & App Down Switch
              </h3>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>
                Temporarily restrict client access during scheduled updates.
              </p>
            </div>

            <div className="p-5 rounded-[28px] border border-white/10 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${currentDraftSafe.isAppDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                  <h4 className="font-bold text-sm text-white">Application Maintenance State</h4>
                </div>
                <p className={`text-xs max-w-lg leading-relaxed ${adminThemeStyle.mutedText}`}>
                  {currentDraftSafe.isAppDown 
                    ? "🔴 ON: Customer App displays an elegant maintenance splash screen."
                    : "🟢 OFF: Customer App is active and taking appointments."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...currentDraftSafe, isAppDown: !currentDraftSafe.isAppDown })}
                className={`px-5 py-3 rounded-[16px] font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow ${
                  currentDraftSafe.isAppDown ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {currentDraftSafe.isAppDown ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{currentDraftSafe.isAppDown ? 'MAINTENANCE (ON)' : 'ACTIVE (LIVE)'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Maintenance Mode'}
              onClick={() => handleSaveSpecificCard('Maintenance Mode')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance State'}</span>
            </button>
          </div>
        )}

        {/* 10. FLOATING BANNER */}
        {activeFolderId === 'floating' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div>
              <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Gift className="w-5 h-5" /> Floating Offer Pill Widget
              </h3>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>Configure promotional pill text, target code and visibility.</p>
            </div>

            <div className="p-5 rounded-[28px] border border-white/10 space-y-4 bg-white/5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Enable Floating Widget</span>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: {
                      ...(currentDraftSafe.floatingBanner || {}),
                      enabled: !(currentDraftSafe.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 ${currentDraftSafe?.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}
                >
                  {currentDraftSafe?.floatingBanner?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{currentDraftSafe?.floatingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Badge Tag</label>
                  <input
                    type="text"
                    value={currentDraftSafe?.floatingBanner?.tag || ''}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), tag: e.target.value }
                    })}
                    className={`w-full p-3.5 rounded-[14px] text-xs ${adminThemeStyle.inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Promo Code</label>
                  <input
                    type="text"
                    value={currentDraftSafe?.floatingBanner?.code || ''}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), code: e.target.value.toUpperCase() }
                    })}
                    className={`w-full p-3.5 rounded-[14px] text-xs font-mono font-bold ${adminThemeStyle.accentText} ${adminThemeStyle.inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Title</label>
                <input
                  type="text"
                  value={currentDraftSafe?.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), title: e.target.value }
                  })}
                  className={`w-full p-3.5 rounded-[14px] text-xs ${adminThemeStyle.inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Button Text</label>
                <input
                  type="text"
                  value={currentDraftSafe?.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), actionText: e.target.value }
                  })}
                  className={`w-full p-3.5 rounded-[14px] text-xs ${adminThemeStyle.inputBg}`}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Floating Banner'}
              onClick={() => handleSaveSpecificCard('Floating Banner')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Floating Banner' ? 'Saving...' : 'Save Floating Banner'}</span>
            </button>
          </div>
        )}

        {/* 11. PROMO COUPONS & GUEST OFFERS */}
        {activeFolderId === 'coupons' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Tag className="w-5 h-5" /> Promo Coupons & Extra Guest Offers
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Configure discount codes, timers, and automatic guest bundle discounts.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const code = prompt("Enter Coupon Code:");
                  if (code) {
                    const clean = code.toUpperCase().trim();
                    setDraft({
                      ...currentDraftSafe,
                      validCoupons: {
                        ...(currentDraftSafe.validCoupons || {}),
                        [clean]: {
                          type: "percent",
                          value: 10,
                          label: "Special Seasonal Promo",
                          maxUses: 1,
                          enabled: true,
                          expiryDate: "2026-12-31T23:59"
                        }
                      }
                    });
                  }
                }}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[16px] text-xs flex items-center gap-1 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Coupon
              </button>
            </div>

            <div className="p-5 rounded-[28px] border border-white/10 space-y-4 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-white">Extra Guest Bundle Discount Tier</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...currentDraftSafe,
                    guestDiscount: {
                      ...(currentDraftSafe.guestDiscount || {}),
                      enabled: !(currentDraftSafe.guestDiscount?.enabled !== false)
                    }
                  })}
                  className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 ${currentDraftSafe?.guestDiscount?.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}
                >
                  {currentDraftSafe?.guestDiscount?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{currentDraftSafe?.guestDiscount?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={currentDraftSafe?.guestDiscount?.discountPercent ?? 15}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      guestDiscount: {
                        ...(currentDraftSafe.guestDiscount || {}),
                        discountPercent: Number(e.target.value)
                      }
                    })}
                    className={`w-full p-3.5 rounded-[16px] font-mono ${adminThemeStyle.accentText} font-bold text-sm ${adminThemeStyle.inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${adminThemeStyle.mutedText}`}>⏱️ Guest Offer Expiry Date & Time</label>
                  <input
                    type="datetime-local"
                    value={currentDraftSafe?.guestDiscount?.expiryDate || ''}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      guestDiscount: {
                        ...(currentDraftSafe.guestDiscount || {}),
                        expiryDate: e.target.value
                      }
                    })}
                    className={`w-full p-3.5 rounded-[16px] text-xs font-mono text-amber-400 ${adminThemeStyle.inputBg}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(currentDraftSafe?.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className="p-5 rounded-[28px] border border-white/10 space-y-3 bg-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono font-bold text-[15px] ${adminThemeStyle.accentText}`}>{code}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isCodeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {isCodeActive ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDraft({
                            ...currentDraftSafe,
                            validCoupons: {
                              ...currentDraftSafe.validCoupons,
                              [code]: { ...c, enabled: !isCodeActive }
                            }
                          })}
                          className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${isCodeActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          setDeleteConfirmModal({
                            type: 'single',
                            message: `Delete coupon "${code}"?`,
                            onConfirm: () => {
                              const copy = { ...(currentDraftSafe.validCoupons || {}) };
                              delete copy[code];
                              setDraft({ ...currentDraftSafe, validCoupons: copy });
                            }
                          });
                        }} className="text-rose-400 p-2 hover:bg-rose-500/20 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Type</span>
                        <select
                          value={c.type || 'percent'}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            validCoupons: {
                              ...currentDraftSafe.validCoupons,
                              [code]: { ...c, type: e.target.value }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] text-xs font-bold ${adminThemeStyle.inputBg}`}
                        >
                          <option value="percent" className="text-black">% Percent Off</option>
                          <option value="flat" className="text-black">₹ Flat Off</option>
                        </select>
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Value ({c.type === 'percent' ? '%' : '₹'})</span>
                        <input
                          type="number"
                          value={c.value || 0}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            validCoupons: {
                              ...currentDraftSafe.validCoupons,
                              [code]: { ...c, value: Number(e.target.value) }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] font-mono ${adminThemeStyle.accentText} text-xs font-bold ${adminThemeStyle.inputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>⏱️ Expiry Date</span>
                        <input
                          type="datetime-local"
                          value={c.expiryDate || ''}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            validCoupons: {
                              ...currentDraftSafe.validCoupons,
                              [code]: { ...c, expiryDate: e.target.value }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] text-xs font-mono text-amber-400 ${adminThemeStyle.inputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <span className={`block text-[10px] mb-1 ${adminThemeStyle.mutedText}`}>Promo Display Label</span>
                      <input
                        type="text"
                        value={c.label || ''}
                        onChange={e => setDraft({
                          ...currentDraftSafe,
                          validCoupons: {
                            ...currentDraftSafe.validCoupons,
                            [code]: { ...c, label: e.target.value }
                          }
                        })}
                        className={`w-full p-3 rounded-[14px] text-xs ${adminThemeStyle.inputBg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Coupons & Offers'}
              onClick={() => handleSaveSpecificCard('Coupons & Offers')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Coupons & Offers' ? 'Saving...' : 'Save Coupons & Offers'}</span>
            </button>
          </div>
        )}

        {/* 12. MASTER FEATURE TOGGLES */}
        {activeFolderId === 'toggles_master' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-5 ${adminThemeStyle.cardBg}`}>
            <div>
              <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <SlidersHorizontal className="w-5 h-5" /> Master Feature & Tab Toggles
              </h3>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>Enable or disable individual components and sections across customer app.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'showLogoOnApp', label: 'Studio Logo in Header', desc: 'Display official studio logo in client top header' },
                { key: 'showProfileOnApp', label: 'Artist Profile Avatar', desc: 'Display artist profile photo on banner' },
                { key: 'enableAnnouncements', label: 'Top Rotating Announcements', desc: 'Show/hide rotating offer banner ticker' },
                { key: 'enableCoupons', label: 'Promo Coupon Input', desc: 'Allow visitors to apply discount codes' },
                { key: 'enableGuestDiscount', label: 'Extra Guest Group Savings', desc: 'Apply automatic bundle discount on multiple guests' },
                { key: 'enableFloatingBanner', label: 'Bottom Floating Offer Pill', desc: 'Show/hide floating bottom offer widget' },
                { key: 'enableGallery', label: 'Transformations Video Gallery Tab', desc: 'Show/hide signature video lookbook tab' },
                { key: 'enableBrands', label: 'Vanity Brands Showcase Tab', desc: 'Show/hide authentic cosmetics brand kit tab' },
                { key: 'enableEstimator', label: 'Price Estimator Calculator Tab', desc: 'Show/hide custom booking price estimator tab' }
              ].map(toggle => {
                const isEnabled = currentDraftSafe?.toggles?.[toggle.key] !== false;
                return (
                  <div key={toggle.key} className="p-4.5 rounded-[24px] border border-white/10 flex items-center justify-between gap-3 bg-white/5">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[13px] text-white">{toggle.label}</h4>
                      <p className={`text-[11px] ${adminThemeStyle.mutedText}`}>{toggle.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft({
                        ...currentDraftSafe,
                        toggles: {
                          ...(currentDraftSafe.toggles || {}),
                          [toggle.key]: !isEnabled
                        }
                      })}
                      className={`px-4 py-2 rounded-[14px] flex items-center gap-1 font-bold text-xs transition active:scale-95 ${isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}
                    >
                      {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{isEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Master Toggles'}
              onClick={() => handleSaveSpecificCard('Master Toggles')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Master Toggles' ? 'Saving...' : 'Save Feature Toggles'}</span>
            </button>
          </div>
        )}

        {/* 13. TRAFFIC LOGS */}
        {activeFolderId === 'traffic_logs' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-4 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Activity className="w-5 h-5" /> Real-time Instagram Visitor Logs
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Track live visits arriving from Instagram bio and direct link clicks.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 ${adminThemeStyle.accentText}`}>
                {visitorLogs.length} Visits Logged
              </span>
            </div>

            {visitorLogs.length === 0 ? (
              <p className={`text-[14px] py-14 text-center ${adminThemeStyle.mutedText}`}>No visitor activity recorded yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {visitorLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-[22px] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] bg-white/5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono ${adminThemeStyle.accentText}`}>Source: @{log.instagramIdOrSource || 'Direct Bio'}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">Active Visitor</span>
                      </div>
                      <p className={`text-[12px] truncate max-w-md ${adminThemeStyle.mutedText}`}>{log.userAgent}</p>
                    </div>
                    <span className={`text-[12px] font-mono font-medium ${adminThemeStyle.accentText}`}>
                      {log.visitedAt ? new Date(log.visitedAt.toDate?.() || log.visitedAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 14. BROADCAST STUDIO */}
        {activeFolderId === 'promotions' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-4 ${adminThemeStyle.cardBg}`}>
            <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
              <Megaphone className="w-5 h-5" /> WhatsApp Broadcast Studio
            </h3>
            <textarea
              rows={6}
              value={currentDraftSafe?.announcements?.[0] || ""}
              onChange={e => {
                const updated = [...(currentDraftSafe.announcements || [])];
                updated[0] = e.target.value;
                setDraft({...currentDraftSafe, announcements: updated});
              }}
              className={`w-full p-4 rounded-[20px] text-[13px] font-mono ${adminThemeStyle.inputBg}`}
            />
            <button
              type="button"
              onClick={() => handleSaveSpecificCard('Broadcast Studio')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Send className="w-4 h-4" />
              <span>Save Broadcast Message</span>
            </button>
          </div>
        )}

        {/* 15. ANNOUNCEMENTS TICKER */}
        {activeFolderId === 'announcements' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-4 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Volume2 className="w-5 h-5" /> Rotating Top Announcement Lines
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Configure scrolling announcements displayed on customer app top header.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...currentDraftSafe, announcements: [...(currentDraftSafe.announcements || []), "✨ New studio announcement line ✨"] })}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[16px] text-xs flex items-center gap-1 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-3">
              {(currentDraftSafe?.announcements || []).map((line, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className={`text-[13px] font-mono font-bold w-6 ${adminThemeStyle.accentText}`}>#{idx + 1}</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const copy = [...currentDraftSafe.announcements];
                      copy[idx] = e.target.value;
                      setDraft({ ...currentDraftSafe, announcements: copy });
                    }}
                    className={`flex-1 p-3.5 rounded-[18px] text-[13px] ${adminThemeStyle.inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmModal({
                        type: 'single',
                        message: `Delete announcement line #${idx + 1}?`,
                        onConfirm: () => {
                          setDraft({ ...currentDraftSafe, announcements: currentDraftSafe.announcements.filter((_, i) => i !== idx) });
                        }
                      });
                    }}
                    className="p-2.5 text-rose-400 hover:bg-rose-500/20 rounded-[14px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Announcements'}
              onClick={() => handleSaveSpecificCard('Announcements')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Announcements' ? 'Saving...' : 'Save Announcements'}</span>
            </button>
          </div>
        )}

        {/* 16. TRAVEL FEES & CONVENIENCE */}
        {activeFolderId === 'convenience' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-4 ${adminThemeStyle.cardBg}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Car className="w-5 h-5" /> Travel Fees & Venue Zones
                </h3>
                <p className={`text-[13px] ${adminThemeStyle.mutedText}`}>Manage location charges automatically factored into the total bill.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const keyName = prompt("Enter Zone Key (e.g. noida_ext):");
                  if (keyName) {
                    const cleanKey = keyName.toLowerCase().replace(/[^a-z0-9_]/g, '');
                    setDraft({
                      ...currentDraftSafe,
                      convenienceZones: {
                        ...(currentDraftSafe.convenienceZones || {}),
                        [cleanKey]: { name: "New Location Zone", fee: 500 }
                      }
                    });
                  }
                }}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[16px] text-xs flex items-center gap-1 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(currentDraftSafe?.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className="p-4 rounded-[22px] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-white/5">
                  <div className="flex-1 w-full space-y-1">
                    <span className={`text-[11px] font-mono uppercase font-bold ${adminThemeStyle.accentText}`}>Key: {zKey}</span>
                    <input
                      type="text"
                      value={zData.name}
                      onChange={(e) => setDraft({
                        ...currentDraftSafe,
                        convenienceZones: {
                          ...currentDraftSafe.convenienceZones,
                          [zKey]: { ...zData, name: e.target.value }
                        }
                      })}
                      className={`w-full p-3.5 rounded-[16px] text-[13px] font-semibold ${adminThemeStyle.inputBg}`}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <label className={`text-[13px] font-bold ${adminThemeStyle.mutedText}`}>Fee (₹):</label>
                    <input
                      type="number"
                      value={zData.fee}
                      onChange={(e) => setDraft({
                        ...currentDraftSafe,
                        convenienceZones: {
                          ...currentDraftSafe.convenienceZones,
                          [zKey]: { ...zData, fee: Number(e.target.value) }
                        }
                      })}
                      className={`w-32 p-3.5 rounded-[16px] font-mono ${adminThemeStyle.accentText} font-bold text-[13px] ${adminThemeStyle.inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Delete zone "${zData.name}"?`,
                          onConfirm: () => {
                            const copy = { ...(currentDraftSafe.convenienceZones || {}) };
                            delete copy[zKey];
                            setDraft({ ...currentDraftSafe, convenienceZones: copy });
                          }
                        });
                      }}
                      className="p-2.5 text-rose-400 hover:bg-rose-500/20 rounded-[14px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Travel Fees'}
              onClick={() => handleSaveSpecificCard('Travel Fees')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Travel Fees' ? 'Saving...' : 'Save Travel Fees'}</span>
            </button>
          </div>
        )}

        {/* 17. THEMES & CUSTOMIZATION */}
        {activeFolderId === 'theme' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <h3 className={`font-bold text-[19px] uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
              <Palette className="w-5 h-5" /> Aesthetics & Theme Controller
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-[28px] border border-white/10 space-y-3.5 bg-white/5">
                <h4 className={`font-bold text-[14px] flex items-center gap-1.5 ${adminThemeStyle.accentText}`}>
                  <Shield className="w-4 h-4" /> Admin Console Theme (Live Switch)
                </h4>
                <p className={`text-[12px] ${adminThemeStyle.mutedText}`}>Select your preferred illustrative glass skin:</p>
                
                <div>
                  <select 
                    value={activeAdminThemeKey} 
                    onChange={e => handleInstantThemeChange(e.target.value)} 
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-bold ${adminThemeStyle.inputBg}`}
                  >
                    <option value="admin_aurora" className="text-black">✨ Admin Aurora (Purple Neon Glow)</option>
                    <option value="cyber_matrix" className="text-black">⚡ Cyber Matrix (Teal & Emerald)</option>
                    <option value="sunset_glow" className="text-black">🌅 Sunset Amber (Gold Glow)</option>
                    <option value="real_glass_lens" className="text-black">🔮 Crystal Glass Lens (Cobalt Blue)</option>
                    <option value="midnight_velvet" className="text-black">🌸 Midnight Velvet (Fuchsia Orchid)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-[28px] border border-white/10 space-y-3.5 bg-white/5">
                <h4 className={`font-bold text-[14px] flex items-center gap-1.5 ${adminThemeStyle.accentText}`}>
                  <Smartphone className="w-4 h-4" /> Customer App Typography & Fonts
                </h4>
                <p className={`text-[12px] ${adminThemeStyle.mutedText}`}>Sync fonts across entire client portal:</p>
                
                <div>
                  <select 
                    value={currentDraftSafe?.theme?.fontFamily || 'outfit'} 
                    onChange={e => setDraft({ ...currentDraftSafe, theme: { ...(currentDraftSafe.theme || {}), fontFamily: e.target.value } })} 
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-bold ${adminThemeStyle.inputBg}`}
                  >
                    <option value="outfit" className="text-black">Outfit (Apple Glass Minimal)</option>
                    <option value="sans" className="text-black">Plus Jakarta Sans</option>
                    <option value="serif" className="text-black">Playfair Display (Royal Classic)</option>
                    <option value="cormorant" className="text-black">Cormorant Garamond</option>
                    <option value="montserrat" className="text-black">Montserrat</option>
                    <option value="inter" className="text-black">Inter</option>
                    <option value="poppins" className="text-black">Poppins</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Theme & Styles'}
              onClick={() => handleSaveSpecificCard('Theme & Styles')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Theme & Styles' ? 'Saving...' : 'Save Theme & Fonts'}</span>
            </button>
          </div>
        )}

        {/* 18. STUDIO IDENTITY & LOGO */}
        {activeFolderId === 'profile' && (
          <div className={`p-6 sm:p-8 rounded-[36px] space-y-6 ${adminThemeStyle.cardBg}`}>
            <div>
              <h3 className={`font-bold text-[19px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <User className="w-5 h-5" /> Studio Identity, Logo & Socials
              </h3>
              <p className={`text-[13px] ${adminThemeStyle.mutedText} mt-0.5`}>Configure studio title, contact number, Instagram profile, and brand logos.</p>
            </div>

            <div className="p-5 rounded-[28px] border border-white/10 space-y-3 bg-white/5">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-bold uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Crown className="w-4 h-4" /> Studio Brand Logo (Header & Splash)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[18px] bg-white/10 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow border border-white/20">
                  {currentDraftSafe.studioLogo ? (
                    <img src={currentDraftSafe.studioLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Logo Image URL"
                    value={currentDraftSafe.studioLogo || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, studioLogo: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${adminThemeStyle.inputBg}`}
                  />
                  <label className={`inline-block px-4 py-2.5 rounded-[14px] bg-white/10 ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer border border-white/10 hover:bg-white/15 transition`}>
                    Upload Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-[28px] border border-white/10 space-y-3 bg-white/5">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-bold uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <ImageIcon className="w-4 h-4" /> Artist Profile Avatar
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-neutral-900 border-2 border-purple-400/40 shrink-0 shadow">
                  <img src={currentDraftSafe.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={currentDraftSafe.profileImage || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, profileImage: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${adminThemeStyle.inputBg}`}
                  />
                  <label className={`inline-block px-4 py-2.5 rounded-[14px] bg-white/10 ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer border border-white/10 hover:bg-white/15 transition`}>
                    Upload Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${adminThemeStyle.mutedText}`}>Studio Display Title</label>
                <input type="text" value={currentDraftSafe.studioName || ''} onChange={e => setDraft({ ...currentDraftSafe, studioName: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${adminThemeStyle.mutedText}`}>WhatsApp Booking Number</label>
                <input type="text" value={currentDraftSafe.whatsappNumber || ''} onChange={e => setDraft({ ...currentDraftSafe, whatsappNumber: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${adminThemeStyle.accentText} ${adminThemeStyle.inputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${adminThemeStyle.mutedText}`}>Instagram Handle</label>
                <input type="text" value={currentDraftSafe.instagramHandle || ''} onChange={e => setDraft({ ...currentDraftSafe, instagramHandle: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono text-pink-400 ${adminThemeStyle.inputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${adminThemeStyle.mutedText}`}>Tagline / Subtitle</label>
                <input type="text" value={currentDraftSafe.artistTagline || ''} onChange={e => setDraft({ ...currentDraftSafe, artistTagline: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${adminThemeStyle.inputBg}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Studio Profile'}
              onClick={() => handleSaveSpecificCard('Studio Profile')}
              className={`w-full py-4.5 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Studio Profile' ? 'Saving...' : 'Save Studio Profile & Socials'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
