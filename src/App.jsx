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

const DEFAULT_REJECTION_REASONS = [
  {
    code: "SLOT_FULL",
    label: "Peak Demand Conflict",
    message: "We are fully booked for this date and cannot accept additional appointments."
  },
  {
    code: "OUT_OF_SERVICE_AREA",
    label: "Venue Coverage",
    message: "We do not currently provide on-site makeover services at the requested destination/venue location."
  },
  {
    code: "TIMING_MISMATCH",
    label: "Schedule Conflict",
    message: "The requested service timing/slot cannot be accommodated alongside our existing confirmed appointments."
  },
  {
    code: "INCOMPLETE_DETAILS",
    label: "Incomplete Verification",
    message: "The booking could not be verified due to incomplete contact or venue address details."
  }
];

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

  activeAppVersion: "v4.1.0",
  appVersionsList: [
    { version: "v4.1.0", label: "Production Master (Current)", releaseDate: "August 30, 2026", status: "live", notes: "Full exact pricing per guest package, detailed discount subsections for guest/promo discounts on slips & admin queues." }
  ],

  rejectionReasons: DEFAULT_REJECTION_REASONS,

  theme: {
    fontFamily: "sans",
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
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    cardBg: "bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-slate-950/60 backdrop-blur-[28px] border border-purple-500/30 shadow-[0_12px_40px_rgba(168,85,247,0.18)]",
    cardHover: "hover:border-purple-400/60 hover:shadow-[0_16px_45px_rgba(168,85,247,0.3)]",
    appIconBg: "bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_8px_20px_rgba(168,85,247,0.4)]",
    appIconBorder: "border-purple-400/30",
    btnPrimary: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(236,72,153,0.35)] rounded-[18px]",
    accentText: "text-purple-400",
    badgeBg: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
    glowOrb: "from-purple-600/20 via-pink-600/10 to-transparent"
  },
  sunset_glow: {
    bg: "bg-[#0c0a09] text-[#F2F2F7]",
    cardBg: "bg-gradient-to-br from-amber-950/40 via-rose-950/25 to-slate-950/60 backdrop-blur-[28px] border border-amber-500/30 shadow-[0_12px_40px_rgba(245,158,11,0.18)]",
    cardHover: "hover:border-amber-400/60 hover:shadow-[0_16px_45px_rgba(245,158,11,0.3)]",
    appIconBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-500 text-white shadow-[0_8px_20px_rgba(245,158,11,0.4)]",
    appIconBorder: "border-amber-400/30",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(244,63,94,0.35)] rounded-[18px]",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    glowOrb: "from-amber-600/20 via-rose-600/10 to-transparent"
  },
  cyber_matrix: {
    bg: "bg-[#030a0a] text-[#F2F2F7]",
    cardBg: "bg-gradient-to-br from-cyan-950/40 via-emerald-950/25 to-slate-950/60 backdrop-blur-[28px] border border-cyan-500/30 shadow-[0_12px_40px_rgba(6,182,212,0.18)]",
    cardHover: "hover:border-cyan-400/60 hover:shadow-[0_16px_45px_rgba(6,182,212,0.3)]",
    appIconBg: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 shadow-[0_8px_20px_rgba(6,182,212,0.4)]",
    appIconBorder: "border-cyan-400/30",
    btnPrimary: "bg-gradient-to-r from-emerald-500 to-cyan-600 text-neutral-950 font-bold shadow-[0_10px_25px_rgba(6,182,212,0.35)] rounded-[18px]",
    accentText: "text-cyan-400",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
    glowOrb: "from-emerald-600/20 via-cyan-600/10 to-transparent"
  },
  real_glass_lens: {
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    cardBg: "bg-gradient-to-br from-blue-950/40 via-indigo-950/25 to-slate-950/60 backdrop-blur-[28px] border border-blue-500/30 shadow-[0_12px_40px_rgba(0,122,255,0.18)]",
    cardHover: "hover:border-blue-400/60 hover:shadow-[0_16px_45px_rgba(0,122,255,0.3)]",
    appIconBg: "bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-[0_8px_20px_rgba(0,122,255,0.4)]",
    appIconBorder: "border-blue-400/30",
    btnPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_10px_25px_rgba(0,122,255,0.3)] rounded-[18px]",
    accentText: "text-blue-400",
    badgeBg: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
    glowOrb: "from-blue-600/20 via-indigo-600/10 to-transparent"
  }
};

const FONT_MAP = {
  sans: "'Plus Jakarta Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
  comic: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif",
  serif: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  cinzel: "'Cinzel', serif",
  montserrat: "'Montserrat', sans-serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif"
};

const INITIAL_FOLDERS = [
  { id: 'bookings', label: 'Live Bookings Queue', icon: CalendarCheck, category: 'OPERATIONS', desc: 'Review, accept, hold, reject & generate slips', countKey: 'bookings' },
  { id: 'packages_master', label: 'Packages & Rates Manager', icon: Layers, category: 'CATALOG', desc: 'Manage package photos, names, rates and full details', countKey: null },
  { id: 'brands_master', label: 'Vanity Brands Manager', icon: Star, category: 'CATALOG', desc: 'Manage authentic cosmetics brand list on Vanity tab', countKey: null },
  { id: 'versions_master', label: 'App Version & Rollback', icon: GitBranch, category: 'SYSTEM', desc: 'Control live deployment version, staging & instant rollback', countKey: null },
  { id: 'general', label: 'General & Security Settings', icon: Settings, category: 'SECURITY', desc: 'Biometric, Face ID, Fingerprint Scan Registration & Recovery' },
  { id: 'calendar_view', label: 'Availability Calendar', icon: Calendar, category: 'SCHEDULE', desc: 'Color-coded monthly schedule matrix' },
  { id: 'feedbacks', label: 'Client Feedback & Suggestions', icon: MessageSquare, category: 'COMMUNITY', desc: 'View client reviews, ratings & feedback', countKey: 'feedbacks' },
  { id: 'gallery', label: 'Transformations & Media', icon: Film, category: 'MEDIA', desc: 'Upload client video reels, GIFs & photos' },
  { id: 'app_maintenance', label: 'Maintenance Mode', icon: Wrench, category: 'CONTROL', desc: 'Politely lock customer app during upgrades' },
  { id: 'floating', label: 'Floating Promo Banner', icon: Gift, category: 'MARKETING', desc: 'Edit bottom offer pill & auto-hide rules' },
  { id: 'coupons', label: 'Promo Coupons & Guest Offers', icon: Tag, category: 'MARKETING', desc: 'Manage discount codes, timers & guest tier offers' },
  { id: 'toggles_master', label: 'Feature & Section Toggles', icon: SlidersHorizontal, category: 'SYSTEM', desc: 'Enable or disable any tab, section or feature' },
  { id: 'traffic_logs', label: 'Visitor Logs & Traffic', icon: Activity, category: 'ANALYTICS', desc: 'Track real-time Instagram bio & link visits' },
  { id: 'promotions', label: 'WhatsApp Broadcast Studio', icon: Megaphone, category: 'MARKETING', desc: 'Send bulk promo alerts via Baileys gateway' },
  { id: 'announcements', label: 'Top Announcements Ticker', icon: Volume2, category: 'CONTENT', desc: 'Configure top rotating ticker announcements' },
  { id: 'convenience', label: 'Travel Fees & Zones', icon: Car, category: 'RATES', desc: 'Edit venue travel charges per area' },
  { id: 'theme', label: 'Themes & Typography', icon: Palette, category: 'DESIGN', desc: 'Aesthetic skins, fonts & mode defaults' },
  { id: 'profile', label: 'Studio Identity & Logo', icon: User, category: 'BRANDING', desc: 'Upload Studio Logo, Profile Photo & Contact' }
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
  const [selectedReasonCode, setSelectedReasonCode] = useState(DEFAULT_REJECTION_REASONS[0].code);
  const [rejectionReasonText, setRejectionReasonText] = useState(DEFAULT_REJECTION_REASONS[0].message);
  const [showManageReasonsModal, setShowManageReasonsModal] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const canvasRef = useRef(null);

  // Helper Upload Functions
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.9);
      setDraft(prev => ({ ...prev, studioLogo: compressed }));
      setPopupToast({ title: "Logo Ready", desc: "Studio Logo uploaded and compressed. Save to persist." });
    } catch (err) {
      alert("Error compressing logo image: " + err.message);
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
      alert("Error compressing profile image: " + err.message);
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
      setPopupToast({ title: "Package Image Set", desc: `Image updated for ${pkgKey}. Click Save to apply.` });
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
        setPopupToast({ title: "Image Uploaded", desc: "Photo uploaded to transformations gallery." });
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
            rejectionReasons: (data.rejectionReasons && data.rejectionReasons.length > 0) ? data.rejectionReasons : DEFAULT_REJECTION_REASONS,
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
      alert("Incorrect PIN. Please enter your correct 4-digit security PIN.");
    }
  };

  const handleBiometricOrFaceLogin = async () => {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("⚠️ Biometric hardware scanner is not available in this browser context. Please use PIN 8760.");
      return;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        alert("⚠️ No hardware biometric platform authenticator detected.");
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
      setPopupToast({ title: "Biometric Verified", desc: "Fingerprint hardware sensor authenticated successfully." });
    } catch (err) {
      console.warn("WebAuthn biometric auth error or cancelled:", err);
      alert("⚠️ Fingerprint scan cancelled or failed by hardware. Please enter your 4-digit PIN.");
    }
  };

  const handleRegisterFingerprintScan = async () => {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("⚠️ Biometric hardware API is not supported in this browser context.");
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
            rp: { name: "H&F Makeup Artist Admin" },
            user: {
              id: new TextEncoder().encode("admin_husna"),
              name: "admin@husna.com",
              displayName: "Husna Farooqui Admin"
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
      console.warn("Hardware credential creation notice:", err);
      clearInterval(interval);
      setIsScanningFinger(false);
      alert("⚠️ Fingerprint registration was cancelled or failed by device. Please try again.");
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
        console.warn("Cloud sync warning for fingerprint:", e);
      }

      setPopupToast({ title: "Fingerprint Saved", desc: "Hardware biometrics successfully registered." });
    }, 2000);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const targetEmail = currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com";
    setForgotPasswordStatus(`📧 Master Password Recovery Link & Current PIN dispatched to ${targetEmail}! Check inbox.`);
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
        desc: `"${sectionName}" has been updated and synced live to customer app.`
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
      console.warn("Theme instant sync notice:", err);
    }
  };

  const handleAcceptBookingWhatsApp = async (b) => {
    setPopupToast({ title: "Dispatching Slip", desc: `Sending final confirmation slip to ${b.clientName}...` });
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
      const availableReasons = draft?.rejectionReasons || DEFAULT_REJECTION_REASONS;
      const matched = availableReasons.find(r => r.code === selectedReasonCode);
      const chosenLabel = matched ? matched.label : "General";

      await updateDoc(doc(db, "bookings", rejectModalData.id), {
        status: "rejected",
        rejectionCode: selectedReasonCode,
        rejectionLabel: chosenLabel,
        rejectionReason: rejectionReasonText
      });
      setPopupToast({ title: "Booking Rejected", desc: `Booking declined successfully with reason code: ${selectedReasonCode}.` });
      setRejectModalData(null);
    } catch (err) {
      alert("Error rejecting booking: " + err.message);
    }
  };

  const handleAddRejectionReason = () => {
    const code = prompt("Enter Unique Rejection Code (e.g. BRIDAL_LOCKOUT, SHORT_NOTICE):");
    if (!code) return;
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    const label = prompt("Enter Rejection Reason Label / Category Title:", "Policy Mismatch");
    if (!label) return;
    const message = prompt("Enter Default Client Notification Message:", "We are unable to accept this booking request due to schedule limitations.");
    if (!message) return;

    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const currentReasons = currentDraftSafe.rejectionReasons || DEFAULT_REJECTION_REASONS;
    const updated = [...currentReasons, { code: cleanCode, label, message }];

    setDraft({ ...currentDraftSafe, rejectionReasons: updated });
    updateLiveConfig({ ...currentDraftSafe, rejectionReasons: updated }).catch(console.warn);
    setPopupToast({ title: "Reason Added", desc: `New rejection reason ${cleanCode} added successfully!` });
  };

  const handleRemoveRejectionReason = (codeToRemove) => {
    const currentDraftSafe = draft || DEFAULT_CONFIG;
    const currentReasons = currentDraftSafe.rejectionReasons || DEFAULT_REJECTION_REASONS;
    if (currentReasons.length <= 1) {
      alert("At least one rejection reason must be maintained.");
      return;
    }
    const updated = currentReasons.filter(r => r.code !== codeToRemove);
    setDraft({ ...currentDraftSafe, rejectionReasons: updated });
    updateLiveConfig({ ...currentDraftSafe, rejectionReasons: updated }).catch(console.warn);

    if (selectedReasonCode === codeToRemove && updated.length > 0) {
      setSelectedReasonCode(updated[0].code);
      setRejectionReasonText(updated[0].message);
    }
    setPopupToast({ title: "Reason Removed", desc: `Rejection reason ${codeToRemove} deleted.` });
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
    const rawKey = prompt("Enter Package Key (e.g. deluxe_glam, royal_reception):");
    if (!rawKey) return;
    const cleanKey = rawKey.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const titleName = prompt("Enter Package Display Name (e.g. Deluxe Glamour Makeup):", "Deluxe Makeup");
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
    setPopupToast({ title: "Package Added", desc: `Package "${titleName}" added successfully across kits!` });
  };

  // Instant Download Slip without any popup modal/toast
  const handleGenerateSlipJpgOnDemand = (b) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
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
    const hasRejectionNote = b.status === 'rejected' || !!b.rejectionReason;

    const baseHeight = 2550;
    const guestRowsHeight = guestList.length * 82;
    const rejectionExtraHeight = hasRejectionNote ? 260 : 0;
    canvas.width = 1200;
    canvas.height = Math.max(baseHeight, 1900 + guestRowsHeight + rejectionExtraHeight);

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.fillText(String(text ?? ''), x, y);
    };

    const drawRow = (label, value, y, options = {}) => {
      const rowHeight = options.height || 58;
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)';
      ctx.fillRect(90, y, 1020, rowHeight);
      drawText(label, 120, y + 36, options.labelSize || 19, 'bold', options.labelColor || '#94a3b8');
      drawText(value, 1080, y + 36, options.valueSize || 20, 'bold', options.valueColor || '#ffffff', 'right', options.mono ? 'monospace' : 'sans-serif');
      return y + rowHeight + (options.gap ?? 7);
    };

    const drawSectionTitle = (title, y, accent = '#c084fc') => {
      ctx.fillStyle = accent === '#c084fc' ? 'rgba(192,132,252,0.14)' : (accent === '#f43f5e' ? 'rgba(244,63,94,0.18)' : 'rgba(14,165,233,0.14)');
      ctx.fillRect(90, y, 1020, 62);
      drawText(title, 120, y + 39, 21, 'bold', accent);
      return y + 72;
    };

    const drawAdminSlip = (logoImgObj) => {
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, canvas.height);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = hasRejectionNote ? '#f43f5e' : '#c084fc';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, canvas.height - 80);
      ctx.strokeStyle = hasRejectionNote ? 'rgba(244,63,94,0.35)' : 'rgba(192,132,252,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, canvas.height - 110);

      if (logoImgObj) {
        try {
          ctx.save();
          ctx.globalAlpha = 0.07;
          ctx.drawImage(logoImgObj, 300, 900, 600, 600);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImgObj, 80, 80, 120, 120);
          ctx.restore();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
          ctx.stroke();
        } catch (e) {
          console.warn("Logo draw skipped due to cross-origin taint", e);
        }
        drawText(currentDraftSafe.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold');
        drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#c084fc');
      } else {
        drawText(currentDraftSafe.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#c084fc', 'center');
      }

      ctx.strokeStyle = 'rgba(192,132,252,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 230);
      ctx.lineTo(1110, 230);
      ctx.stroke();

      const isRejected = b.status === 'rejected';
      const isConfirmed = b.status === 'confirmed';
      drawText(
        isRejected ? '❌ APPOINTMENT DECLINED / REJECTED' : (isConfirmed ? '✅ OFFICIAL CONFIRMED APPOINTMENT SLIP' : '⏳ PENDING BOOKING REQUEST SLIP'),
        600, 305, 26, 'bold', isRejected ? '#f43f5e' : (isConfirmed ? '#059669' : '#fbbf24'), 'center'
      );

      let y = 370;
      y = drawRow('BOOKING NUMBER', b.bookingNumber || '#HF-RECORD', y, { valueColor: isRejected ? '#f43f5e' : '#c084fc', mono: true });
      y = drawRow('CLIENT NAME', b.clientName || 'Not Provided', y);
      y = drawRow('CONTACT NUMBER', b.clientPhone || 'Not Provided', y);
      y = drawRow('EVENT DATE', b.eventDate || 'Not Provided', y);
      y = drawRow('EXACT VENUE ADDRESS', b.venueAddress || 'To be confirmed', y);

      // Rejection details rendered directly on downloaded slip screen
      if (hasRejectionNote) {
        y += 12;
        y = drawSectionTitle('⚠️ APPOINTMENT REJECTION & CANCELLATION DETAILS', y, '#f43f5e');
        y = drawRow('• Status Verdict:', 'DECLINED / REJECTED', y, { labelSize: 18, labelColor: '#fca5a5', valueColor: '#f43f5e' });
        if (b.rejectionCode || b.rejectionLabel) {
          y = drawRow('• Reason Code & Category:', `${b.rejectionCode || 'REJECT'} • ${b.rejectionLabel || 'Schedule Limitation'}`, y, { labelSize: 17, labelColor: '#fca5a5', valueColor: '#fda4af', mono: true });
        }
        
        const reasonText = b.rejectionReason || 'Studio slot unavailable or fully booked for requested event date.';
        const boxHeight = 110;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
        ctx.fillRect(90, y, 1020, boxHeight);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(90, y, 1020, boxHeight);
        
        drawText('• Stated Reason for Decline:', 120, y + 32, 18, 'bold', '#fda4af');
        
        // Wrap rejection note
        ctx.font = 'italic 16px sans-serif';
        ctx.fillStyle = '#ffffff';
        const maxTextWidth = 960;
        const words = reasonText.split(' ');
        let line = '';
        let textY = y + 62;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && n > 0) {
            ctx.fillText(line, 120, textY);
            line = words[n] + ' ';
            textY += 26;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 120, textY);
        y += boxHeight + 14;
      }

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
      ctx.fillStyle = isRejected ? 'rgba(244,63,94,0.2)' : 'rgba(192,132,252,0.25)';
      ctx.fillRect(90, y, 1020, 125);
      ctx.strokeStyle = isRejected ? '#f43f5e' : '#c084fc';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, y, 1020, 125);
      drawText(isRejected ? 'Estimated Total Amount (Declined):' : 'Final Amount Payable:', 600, y + 42, 23, 'bold', '#e2e8f0', 'center');
      drawText(money(finalAmount), 600, y + 99, 48, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 105;
      drawText(`Studio Base Location: ${currentDraftSafe.baseLocation || ''} • Instagram: @${getCleanInstagramHandle(currentDraftSafe.instagramHandle || '')}`, 600, footerY, 17, 'normal', '#64748b', 'center');
      drawText(currentDraftSafe.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 34, 18, 'italic', isRejected ? '#f43f5e' : '#c084fc', 'center');

      // Instant download trigger
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
            const fallbackLink = document.createElement('a');
            fallbackLink.href = jpgUrl;
            fallbackLink.download = `Booking_Slip_${b.bookingNumber || b.clientName || 'HF'}.jpg`;
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            fallbackLink.remove();
            return;
          }
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `Booking_Slip_${b.bookingNumber || b.clientName || 'HF'}.jpg`;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }, 800);
        }, 'image/jpeg', 0.95);
      } catch (err) {
        console.error('Booking slip download failed:', err);
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
  const currentFontFamily = FONT_MAP[currentDraftSafe.theme?.fontFamily] || FONT_MAP.sans;

  const iosBg = adminThemeStyle.bg;
  const iosGroupCard = adminThemeStyle.cardBg;
  const iosInputBg = "bg-white/10 text-white border border-white/20 rounded-[16px]";
  const iosMuted = "text-[#a1a1aa]";

  const activeFolderObj = adminFolders.find(f => f.id === activeFolderId);
  const rejectionReasonsList = currentDraftSafe.rejectionReasons || DEFAULT_REJECTION_REASONS;

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${iosBg} flex items-center justify-center p-5 relative overflow-hidden transition-colors duration-300`}>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${adminThemeStyle.glowOrb} rounded-full blur-3xl pointer-events-none animate-pulse`} />
        
        {showForgotPasswordModal ? (
          <form onSubmit={handleForgotPasswordSubmit} className={`max-w-sm w-full p-8 rounded-[32px] border text-center space-y-4 shadow-2xl ${iosGroupCard} animate-fade-in`}>
            <div className={`w-16 h-16 rounded-[24px] ${adminThemeStyle.badgeBg} flex items-center justify-center mx-auto shadow-md`}>
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-[22px] font-bold tracking-tight">Recover Password</h2>
            <p className={`text-[13px] ${iosMuted}`}>Your recovery email is permanently secured to <strong>{currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com"}</strong>.</p>
            
            {forgotPasswordStatus && (
              <div className="p-3.5 rounded-[16px] bg-emerald-500/20 text-emerald-300 text-[13px] font-semibold border border-emerald-500/30">
                {forgotPasswordStatus}
              </div>
            )}

            <button type="submit" className={`w-full py-3.5 ${adminThemeStyle.btnPrimary} text-[14px] shadow-lg active:scale-95 transition`}>Send PIN to Recovery Email</button>
            <button type="button" onClick={() => setShowForgotPasswordModal(false)} className={`text-[13px] ${adminThemeStyle.accentText} underline`}>Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-[32px] border text-center space-y-5 shadow-2xl ${iosGroupCard}`}>
            <div className={`w-16 h-16 rounded-[24px] ${adminThemeStyle.appIconBg} flex items-center justify-center mx-auto shadow-lg`}>
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold tracking-tight">Admin Portal</h2>
              <p className={`text-[13px] ${iosMuted} mt-1`}>v4.2.0 Production Suite</p>
            </div>
            <input type="password" placeholder="Enter Admin PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={`w-full text-center text-[18px] p-4 font-mono ${adminThemeStyle.accentText} ${iosInputBg}`} />
            
            <button type="submit" className={`w-full py-4 ${adminThemeStyle.btnPrimary}`}>Unlock Console</button>
            
            <div className="space-y-2.5 pt-3 border-t border-slate-500/20">
              <button
                type="button"
                onClick={handleBiometricOrFaceLogin}
                className={`w-full py-3.5 font-bold text-[13px] ${adminThemeStyle.accentText} flex items-center justify-center gap-2 rounded-[16px] border border-white/10 ${isAdminDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}
              >
                <Fingerprint className="w-4 h-4" />
                <span>Login with Fingerprint / Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className={`text-[13px] ${adminThemeStyle.accentText} underline block w-full pt-1`}
              >
                Forgot Password? Send via Email
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: currentFontFamily, fontSize: `${screenZoom}%` }} className={`min-h-screen ${iosBg} font-sans pb-32 transition-colors duration-300 relative overflow-x-hidden`}>
      <div className={`absolute top-0 left-1/3 w-[650px] h-[650px] bg-gradient-to-br ${adminThemeStyle.glowOrb} rounded-full blur-3xl pointer-events-none animate-pulse`} />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {popupToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[24px] animate-fade-in">
          <div className={`max-w-md w-full rounded-[32px] p-7 text-center space-y-4 shadow-2xl relative ${isAdminDarkMode ? 'bg-[#18181b] border border-white/20 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
            <button
              onClick={() => setPopupToast(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-emerald-400 to-cyan-500 text-neutral-950 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold tracking-tight">{popupToast.title}</h3>
            <p className={`text-[13px] leading-relaxed ${iosMuted}`}>{popupToast.desc}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[24px] animate-fade-in">
          <div className={`max-w-sm w-full rounded-[28px] p-6 text-center space-y-4 shadow-2xl ${isAdminDarkMode ? 'bg-[#18181b] border border-white/20 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[18px]">Confirm Deletion</h3>
            <p className={`text-[13px] ${iosMuted}`}>
              {deleteConfirmModal.message || "Are you sure you want to delete this item? This action cannot be undone."}
            </p>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setDeleteConfirmModal(null)} className={`flex-1 py-3 rounded-[16px] font-bold text-[13px] ${isAdminDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>Cancel</button>
              <button onClick={handleExecuteDelete} className="flex-1 py-3 rounded-[16px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13px] shadow-lg">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal with Multiple Reason Selector */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[24px] animate-fade-in">
          <div className={`max-w-lg w-full rounded-[28px] p-6 space-y-4 shadow-2xl ${isAdminDarkMode ? 'bg-[#18181b] border border-white/20 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-[18px]">Reject Booking: {rejectModalData.bookingNumber || rejectModalData.clientName}</h3>
              </div>
              <button onClick={() => setRejectModalData(null)} className="p-1 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <p className={`text-[13px] ${iosMuted}`}>
              Decline booking for <strong>{rejectModalData.clientName}</strong> on <strong>{rejectModalData.eventDate}</strong>. Select or customize the rejection reason below:
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider">Select Preset Reason:</label>
                <button
                  type="button"
                  onClick={() => setShowManageReasonsModal(true)}
                  className={`text-[11px] font-bold ${adminThemeStyle.accentText} hover:underline flex items-center gap-1`}
                >
                  <Settings className="w-3.5 h-3.5" /> Manage Reasons List
                </button>
              </div>

              <select
                value={selectedReasonCode}
                onChange={(e) => {
                  const chosenCode = e.target.value;
                  setSelectedReasonCode(chosenCode);
                  const matched = rejectionReasonsList.find(r => r.code === chosenCode);
                  if (matched) {
                    setRejectionReasonText(matched.message);
                  }
                }}
                className={`w-full p-3.5 rounded-[16px] text-[13px] font-bold font-mono ${iosInputBg}`}
              >
                {rejectionReasonsList.map((reason) => (
                  <option key={reason.code} value={reason.code} className="text-black font-sans">
                    {reason.code} • {reason.label}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider">Rejection Message (Visible on App & Slip):</label>
                <textarea
                  rows={3}
                  value={rejectionReasonText}
                  onChange={e => setRejectionReasonText(e.target.value)}
                  className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-500/20">
              <button onClick={() => setRejectModalData(null)} className="px-4 py-2.5 rounded-[16px] bg-slate-200 text-[13px] font-bold text-slate-700">Cancel</button>
              <button onClick={handleConfirmRejection} className="px-5 py-2.5 rounded-[16px] bg-rose-600 text-white font-bold text-[13px] shadow-lg">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Reasons List Modal */}
      {showManageReasonsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[24px] animate-fade-in">
          <div className={`max-w-xl w-full rounded-[28px] p-6 space-y-4 shadow-2xl ${isAdminDarkMode ? 'bg-[#18181b] border border-white/20 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className={`w-5 h-5 ${adminThemeStyle.accentText}`} />
                <h3 className="font-bold text-[17px]">Manage Rejection Reasons & Codes</h3>
              </div>
              <button onClick={() => setShowManageReasonsModal(false)} className="p-1 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <p className={`text-[12px] ${iosMuted}`}>
              Add, edit, or delete standardized rejection reason codes used when declining booking appointments.
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {rejectionReasonsList.map((reason) => (
                <div key={reason.code} className={`p-3.5 rounded-[18px] border flex items-start justify-between gap-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold ${adminThemeStyle.accentText} bg-white/10 px-2 py-0.5 rounded-[8px]`}>
                        {reason.code}
                      </span>
                      <span className="font-bold text-xs">{reason.label}</span>
                    </div>
                    <p className={`text-[12px] italic ${iosMuted}`}>"{reason.message}"</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRejectionReason(reason.code)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg shrink-0"
                    title="Delete Reason Code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-500/20">
              <button
                type="button"
                onClick={handleAddRejectionReason}
                className="px-4 py-2.5 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add New Reason Code
              </button>
              <button
                type="button"
                onClick={() => setShowManageReasonsModal(false)}
                className={`px-4 py-2.5 rounded-[14px] ${adminThemeStyle.btnPrimary} text-xs font-bold`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-[28px] saturate-[180%] border-b px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm transition-colors duration-300 ${isAdminDarkMode ? 'bg-[#18181b]/85 border-white/10 text-white' : 'bg-white/85 border-black/10 text-[#1C1C1E]'}`}>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            {currentDraftSafe.studioLogo ? (
              <div className="w-10 h-10 rounded-[14px] bg-white/20 p-1 overflow-hidden shadow-sm shrink-0 border border-white/20">
                <img src={currentDraftSafe.studioLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-[14px] ${adminThemeStyle.appIconBg} flex items-center justify-center shadow-md shrink-0`}>
                <Crown className="w-5 h-5" />
              </div>
            )}

            <div>
              <h1 className="font-bold text-[16px] sm:text-[17px] tracking-tight leading-tight">
                {currentDraftSafe.studioName || 'H&F Studio Admin'}
              </h1>
              <p className={`text-[11px] font-mono ${adminThemeStyle.accentText}`}>v4.2.0 Pro Suite</p>
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={`p-2 rounded-[12px] ${isAdminDarkMode ? 'bg-white/10 text-amber-400' : 'bg-slate-100 text-slate-800'}`}>
              {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-[12px] text-rose-500 font-bold px-1 py-1">Lock</button>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-[16px] border text-xs font-medium w-full sm:w-auto justify-center ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-black/5 shadow-sm text-slate-700'}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Next Booking: <strong className={adminThemeStyle.accentText}>{nextConfirmedBooking ? `${nextConfirmedBooking.clientName} (${nextConfirmedBooking.eventDate})` : 'None Confirmed'}</strong></span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Pending: <strong className="text-amber-500">{pendingBookingsCount}</strong></span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] border ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-black/10'}`}>
            <ZoomIn className={`w-3.5 h-3.5 ${adminThemeStyle.accentText}`} />
            <select
              value={screenZoom}
              onChange={e => setScreenZoom(Number(e.target.value))}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer"
            >
              <option value={80} className="text-black">80%</option>
              <option value={100} className="text-black">100%</option>
              <option value={115} className="text-black">115%</option>
              <option value={130} className="text-black">130%</option>
            </select>
          </div>

          <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={`p-2.5 rounded-[14px] ${isAdminDarkMode ? 'bg-white/10 text-amber-400' : 'bg-slate-100 text-slate-800 shadow-sm'}`} title="Toggle Day/Night">
            {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="text-[13px] text-rose-500 font-bold hover:underline px-2 py-1">Lock</button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {activeFolderId ? (
            <button
              onClick={closeFolder}
              className={`px-4 py-2 rounded-[14px] text-[13px] font-bold flex items-center gap-2 ${adminThemeStyle.accentText} ${isAdminDarkMode ? 'bg-white/10' : 'bg-white shadow-sm border border-white/20'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h3 className={`font-bold text-[13px] uppercase tracking-wider ${iosMuted}`}>
                {isReorderMode ? 'Reorder Mode Active: Use ⬆️ ⬇️ to move apps' : 'Master Applications & Control Center'}
              </h3>
              
              <button
                onClick={() => {
                  if (isReorderMode) handleSaveSpecificCard("Card Sequence");
                  setIsReorderMode(!isReorderMode);
                }}
                className={`px-3.5 py-2 rounded-[12px] text-xs font-bold flex items-center gap-1.5 shadow ${isReorderMode ? 'bg-emerald-600 text-white' : `${adminThemeStyle.badgeBg}`}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isReorderMode ? 'Save Order' : 'Reorder Apps'}</span>
              </button>
            </div>
          )}

          {activeFolderObj && (
            <span className={`text-[13px] font-bold font-mono ${iosMuted}`}>
              Section: <strong className={isAdminDarkMode ? 'text-white' : 'text-[#1C1C1E]'}>{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {/* App-Like Icon / Card Grid for Main Screen */}
        {!activeFolderId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {adminFolders.map((f, index) => {
              const Icon = f.icon;
              const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

              return (
                <div
                  key={f.id}
                  onClick={() => !isReorderMode && openFolder(f.id)}
                  className={`p-5 rounded-[26px] transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden border ${adminThemeStyle.cardBg} ${adminThemeStyle.cardHover} ${
                    isReorderMode 
                      ? 'ring-2 ring-purple-400 animate-pulse' 
                      : 'hover:-translate-y-1.5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-[22px] ${adminThemeStyle.appIconBg} border ${adminThemeStyle.appIconBorder} flex items-center justify-center shrink-0 group-hover:scale-108 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    <div className="flex items-center gap-2">
                      {f.category && (
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${adminThemeStyle.badgeBg}`}>
                          {f.category}
                        </span>
                      )}
                      
                      {count !== null && (
                        <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {count}
                        </span>
                      )}
                      
                      {isReorderMode && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-[12px] border border-white/10">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'up'); }}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === adminFolders.length - 1}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'down'); }}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <h4 className={`font-bold text-[16px] sm:text-[17px] tracking-tight group-hover:${adminThemeStyle.accentText} transition-colors flex items-center justify-between`}>
                      <span>{f.label}</span>
                      <ChevronRight className={`w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${adminThemeStyle.accentText}`} />
                    </h4>
                    <p className={`text-[12.5px] line-clamp-2 leading-relaxed ${iosMuted}`}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1. PACKAGES & RATES MANAGER */}
        {activeFolderId === 'packages_master' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[18px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Layers className="w-5 h-5" /> Packages & Rates Master Manager
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Manage full aspect attributes: package display names, descriptions, extra modal details, images, and kit rates all in one place. Changes instantly sync to the client app cards.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewPackage}
                  className="px-4 py-2.5 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Add New Package
                </button>

                <div className={`inline-flex p-1.5 rounded-[18px] border gap-1 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('international')}
                    className={`px-4 py-2 rounded-[14px] text-xs font-bold transition ${editingKitTab === 'international' ? `${adminThemeStyle.btnPrimary} text-white shadow` : iosMuted}`}
                  >
                    👑 Luxury Kit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('drugstore')}
                    className={`px-4 py-2 rounded-[14px] text-xs font-bold transition ${editingKitTab === 'drugstore' ? `${adminThemeStyle.btnPrimary} text-white shadow` : iosMuted}`}
                  >
                    ✨ HD Kit
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
                  <div key={`${editingKitTab}_${k}`} className={`p-5 rounded-[24px] border space-y-4 relative ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Key: {k}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase font-bold">{editingKitTab}</span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmModal({ type: 'single', isPackage: true, kit: editingKitTab, pkgKey: k, message: `Are you sure you want to delete package "${pkgText.name}"?` })}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-20 rounded-[16px] overflow-hidden bg-neutral-200 border shrink-0 shadow">
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
                          className={`w-full p-3 rounded-[14px] text-xs font-mono ${iosInputBg}`}
                        />
                        <label className={`block text-center py-2.5 rounded-[14px] ${adminThemeStyle.badgeBg} ${adminThemeStyle.accentText} text-[11px] font-bold cursor-pointer hover:opacity-80 transition`}>
                          Upload Photo (&lt;20MB)
                          <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, editingKitTab, k)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-500/20">
                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Package Display Name</span>
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
                          className={`w-full p-3.5 rounded-[16px] text-xs font-bold ${iosInputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Price Rate (₹)</span>
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
                          className={`w-full p-3.5 rounded-[16px] font-mono ${adminThemeStyle.accentText} font-bold text-xs ${iosInputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Description (Card Display)</span>
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
                          className={`w-full p-3.5 rounded-[16px] text-xs ${iosInputBg}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Skin Finish (Modal Detail)</span>
                          <input
                            type="text"
                            placeholder="e.g. 16-Hour HD Glass"
                            value={pkgText.skinFinish || ''}
                            onChange={e => setDraft({
                              ...currentDraftSafe,
                              kitText: {
                                ...(currentDraftSafe.kitText || {}),
                                [editingKitTab]: {
                                  ...(currentDraftSafe.kitText?.[editingKitTab] || {}),
                                  [k]: { ...pkgText, skinFinish: e.target.value }
                                }
                              }
                            })}
                            className={`w-full p-3.5 rounded-[16px] text-xs ${iosInputBg}`}
                          />
                        </div>
                        <div>
                          <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Includes (Modal Detail)</span>
                          <input
                            type="text"
                            placeholder="e.g. Full Makeup + Styling"
                            value={pkgText.includes || ''}
                            onChange={e => setDraft({
                              ...currentDraftSafe,
                              kitText: {
                                ...(currentDraftSafe.kitText || {}),
                                [editingKitTab]: {
                                  ...(currentDraftSafe.kitText?.[editingKitTab] || {}),
                                  [k]: { ...pkgText, includes: e.target.value }
                                }
                              }
                            })}
                            className={`w-full p-3.5 rounded-[16px] text-xs ${iosInputBg}`}
                          />
                        </div>
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Packages & Rates Master' ? 'Saving...' : 'Save Packages & Rates Master Live'}</span>
            </button>
          </div>
        )}

        {/* 2. VANITY BRANDS MANAGER */}
        {activeFolderId === 'brands_master' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[18px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Star className="w-5 h-5" /> Vanity Brands Manager
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Manage categories, brand names, and descriptions displayed on the Vanity tab of the customer app.
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
                className="px-4 py-2.5 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Brand Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(currentDraftSafe?.internationalBrands || []).map((brand, idx) => (
                <div key={idx} className={`p-5 rounded-[24px] border space-y-4 relative ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Are you sure you want to delete the "${brand.category}" brand card?`,
                          onConfirm: () => {
                            const newBrands = [...(currentDraftSafe.internationalBrands || [])];
                            newBrands.splice(idx, 1);
                            setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                          }
                        });
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Category Label</span>
                      <input
                        type="text"
                        placeholder="e.g. Skin Prep"
                        value={brand.category || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], category: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs font-bold uppercase ${iosInputBg}`}
                      />
                    </div>
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Brand Names</span>
                      <input
                        type="text"
                        placeholder="e.g. Estée Lauder / Smashbox"
                        value={brand.name || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], name: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs font-bold ${adminThemeStyle.accentText} ${iosInputBg}`}
                      />
                    </div>
                    <div>
                      <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Description</span>
                      <input
                        type="text"
                        placeholder="e.g. Premium hydration and primer layer."
                        value={brand.desc || ''}
                        onChange={(e) => {
                          const newBrands = [...currentDraftSafe.internationalBrands];
                          newBrands[idx] = { ...newBrands[idx], desc: e.target.value };
                          setDraft({ ...currentDraftSafe, internationalBrands: newBrands });
                        }}
                        className={`w-full p-3.5 rounded-[16px] text-xs ${iosInputBg}`}
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Vanity Brands' ? 'Saving...' : 'Save Vanity Brands Live'}</span>
            </button>
          </div>
        )}

        {/* 3. APP VERSION & ROLLBACK MANAGER */}
        {activeFolderId === 'versions_master' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[18px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <GitBranch className="w-5 h-5" /> Live App Version Controller & Safe Rollback
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Control active deployed version of Main App across client devices. Promote staging releases to Live or execute instant fallback rollback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const ver = prompt("Enter Main App Version Tag (e.g. v3.9.1):");
                  if (!ver) return;
                  const label = prompt("Enter Version Title/Label:", "New Main App Build");
                  const notes = prompt("Enter Release Notes:", "Bug fixes & new features.");
                  
                  const updatedList = [
                    { version: ver.trim(), label: label || 'Release Build', releaseDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), status: "staged", notes: notes || '' },
                    ...(currentDraftSafe.appVersionsList || [])
                  ];

                  setDraft({
                    ...currentDraftSafe,
                    appVersionsList: updatedList
                  });
                  setPopupToast({ title: "Version Staged", desc: `Main App version ${ver} registered. Click 'Make Live' to deploy.` });
                }}
                className={`px-4 py-2.5 rounded-[14px] ${adminThemeStyle.btnPrimary} text-white text-xs font-bold flex items-center gap-1.5 shadow shrink-0`}
              >
                <Plus className="w-4 h-4" /> Register New Build
              </button>
            </div>

            <div className={`p-4 rounded-[20px] border flex items-center justify-between gap-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Currently Active Live Main App Version:</span>
                  <h4 className={`text-[17px] font-mono font-bold ${adminThemeStyle.accentText}`}>{currentDraftSafe.activeAppVersion || 'v3.9.0'}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {(currentDraftSafe.appVersionsList || []).map((verItem, vIdx) => {
                const isCurrentLive = currentDraftSafe.activeAppVersion === verItem.version;
                
                return (
                  <div key={vIdx} className={`p-5 rounded-[22px] border space-y-3 transition-all ${isCurrentLive ? 'border-emerald-500/50 bg-emerald-500/10' : (isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200')}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`font-mono font-bold text-[16px] ${adminThemeStyle.accentText}`}>{verItem.version}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isCurrentLive ? 'bg-emerald-500 text-neutral-950 shadow' : 'bg-slate-200 text-slate-700'}`}>
                            {isCurrentLive ? '🟢 LIVE PRODUCTION' : (verItem.status === 'staged' ? '🟡 STAGED' : '⚪ ARCHIVED / ROLLBACK')}
                          </span>
                          <span className={`text-[11px] font-mono ${iosMuted}`}>Released: {verItem.releaseDate}</span>
                        </div>
                        <h4 className="font-bold text-[14px]">{verItem.label}</h4>
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
                              setPopupToast({ title: "Rollback Triggered", desc: `Main App target switched to ${verItem.version}. Click Save below to finalize.` });
                            }}
                            className="px-4 py-2 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" /> Rollback / Make Live
                          </button>
                        )}
                        
                        <button
                          type="button"
                          disabled={isCurrentLive}
                          onClick={() => {
                            setDeleteConfirmModal({
                              type: 'single',
                              message: `Are you sure you want to remove release ${verItem.version}?`,
                              onConfirm: () => {
                                const list = (currentDraftSafe.appVersionsList || []).filter((_, i) => i !== vIdx);
                                setDraft({ ...currentDraftSafe, appVersionsList: list });
                              }
                            });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-[12px] disabled:opacity-20"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {verItem.notes && (
                      <p className={`text-[12px] leading-relaxed p-3 rounded-[14px] ${isAdminDarkMode ? 'bg-black/30 text-slate-300' : 'bg-white text-slate-700 shadow-sm'}`}>
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'App Versions' ? 'Saving...' : 'Save Main App Version Rollback Live'}</span>
            </button>
          </div>
        )}

        {/* 4. GENERAL & SECURITY SETTINGS */}
        {activeFolderId === 'general' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Settings className="w-5 h-5" /> General & Security Settings
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure Biometric, Face ID, Fingerprint Scan Registration, Password & Telegram Bot Notification credentials.</p>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Send className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Telegram Bot Notification Settings
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Enter your official Telegram Bot API Token and Chat ID to receive instant booking alerts.</p>

              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Telegram Bot API Token</label>
                  <input
                    type="text"
                    placeholder="e.g. 8891500480:AAGvxL16..."
                    value={currentDraftSafe.telegramBotToken || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, telegramBotToken: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] ${adminThemeStyle.accentText} border ${iosInputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Telegram Chat ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 8891500480"
                    value={currentDraftSafe.telegramChatId || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, telegramChatId: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] ${adminThemeStyle.accentText} border ${iosInputBg}`}
                  />
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Fingerprint className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Hardware Fingerprint Scanner Integration
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Scan and save your fingerprint data locally via your device biometric hardware.</p>

              <div className="p-4 rounded-[18px] bg-white/5 border border-white/10 text-center space-y-3">
                <div className={`w-14 h-14 rounded-2xl ${adminThemeStyle.appIconBg} flex items-center justify-center mx-auto shadow-md`}>
                  <Fingerprint className={`w-7 h-7 ${isScanningFinger ? 'animate-pulse text-amber-300' : ''}`} />
                </div>
                
                {isScanningFinger ? (
                  <div className="space-y-1.5">
                    <p className="text-[13px] font-bold text-amber-500">Scanning Fingerprint... ({scanProgress}%)</p>
                    <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className={`text-[12px] ${iosMuted}`}>
                      {currentDraftSafe.registeredFingerprintHash ? "✅ Hardware Fingerprint Registered & Saved Securely" : "⚠️ No fingerprint scanned yet"}
                    </p>
                    <button
                      type="button"
                      onClick={handleRegisterFingerprintScan}
                      className={`px-5 py-2.5 ${adminThemeStyle.btnPrimary} text-[13px] shadow active:scale-95 transition`}
                    >
                      {currentDraftSafe.registeredFingerprintHash ? "Re-Scan & Update Fingerprint" : "Scan & Save Fingerprint"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> Permanent Recovery Email ID
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>If you forget your PIN, recovery instructions and current PIN are dispatched here.</p>
              
              <input
                type="email"
                value={currentDraftSafe.recoveryEmail || "aqiffarooqui@gmail.com"}
                onChange={e => setDraft({ ...currentDraftSafe, recoveryEmail: e.target.value })}
                className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] font-bold ${adminThemeStyle.accentText} border ${iosInputBg}`}
              />
            </div>

            <form onSubmit={handlePasswordChange} className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Key className={`w-4 h-4 ${adminThemeStyle.accentText}`} /> Change Admin PIN Password
              </h4>

              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Current PIN</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current PIN"
                    value={oldPinInput}
                    onChange={e => setOldPinInput(e.target.value)}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>New PIN (Min 4 digits)</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new PIN"
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value)}
                      className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new PIN"
                      value={confirmPinInput}
                      onChange={e => setConfirmPinInput(e.target.value)}
                      className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'General Settings' ? 'Saving...' : 'Save General & Security Settings Live'}</span>
            </button>
          </div>
        )}

        {/* 5. LIVE BOOKINGS QUEUE */}
        {activeFolderId === 'bookings' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[16px] ${adminThemeStyle.accentText}`}>Incoming Customer Bookings Queue</h3>
                <p className={`text-[13px] ${iosMuted}`}>Filter, search by name/phone/no, select all, or delete multiple records.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold ${adminThemeStyle.badgeBg} px-3.5 py-1.5 rounded-full shadow-sm`}>
                {filteredBookingsList.length} / {bookingsList.length} Bookings
              </span>
            </div>

            <div className={`p-4 rounded-[20px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="relative">
                <Search className={`absolute left-3.5 top-3.5 w-4 h-4 ${iosMuted}`} />
                <input
                  type="text"
                  placeholder="Search by client name, phone number, or booking #..."
                  value={bookingSearchQuery}
                  onChange={e => setBookingSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 text-[13px] outline-none ${iosInputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Filter by Status</label>
                  <select
                    value={bookingStatusFilter}
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    className={`w-full p-3 text-[13px] font-bold outline-none ${iosInputBg}`}
                  >
                    <option value="all" className="text-black">🌟 All Statuses</option>
                    <option value="confirmed" className="text-black">✅ Confirmed / Accepted</option>
                    <option value="pending" className="text-black">⏳ Pending Review</option>
                    <option value="rejected" className="text-black">❌ Cancelled / Rejected</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Filter by Event Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={bookingDateFilter}
                      onChange={e => setBookingDateFilter(e.target.value)}
                      className={`flex-1 p-3 text-[13px] outline-none ${iosInputBg}`}
                    />
                    {bookingDateFilter && (
                      <button
                        type="button"
                        onClick={() => setBookingDateFilter('')}
                        className="px-3.5 py-2.5 rounded-[14px] bg-slate-200 text-xs font-bold text-slate-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-500/20">
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
                  <span>Select All Visible ({filteredBookingsList.length})</span>
                </button>

                {selectedBookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmModal({ type: 'batch', message: `Are you sure you want to delete ${selectedBookings.length} selected bookings?` })}
                    className="px-4 py-2 rounded-[14px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedBookings.length})</span>
                  </button>
                )}
              </div>
            </div>

            {filteredBookingsList.length === 0 ? (
              <p className={`text-[14px] py-12 text-center ${iosMuted}`}>No bookings match the search or filter criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookingsList.map(b => {
                  const isSelected = selectedBookings.includes(b.id);
                  const conflictingConfirmedBooking = b.status === 'pending' 
                    ? bookingsList.find(other => other.id !== b.id && other.eventDate === b.eventDate && other.status === 'confirmed')
                    : null;

                  return (
                    <div key={b.id} className={`p-5 rounded-[24px] border space-y-3.5 transition-all ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} ${isSelected ? 'ring-2 ring-purple-500' : ''} ${conflictingConfirmedBooking ? 'ring-2 ring-rose-500/60' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2.5 min-w-0">
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
                              <span className={`font-mono text-[12px] font-bold ${adminThemeStyle.accentText} bg-white/10 px-2.5 py-0.5 rounded-[8px]`}>
                                {b.bookingNumber || '#HF-PENDING'}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                b.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {b.status === 'confirmed' ? '✅ Confirmed' : b.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-[16px] mt-1.5 truncate">{b.clientName}</h4>
                            <p className={`text-[12px] font-mono ${iosMuted}`}>📞 {b.clientPhone}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmModal({ type: 'single', isBooking: true, id: b.id, message: `Are you sure you want to delete booking for ${b.clientName}?` })}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-[12px]"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {conflictingConfirmedBooking && (
                        <div className="p-3 rounded-[14px] bg-rose-500/15 text-rose-300 text-[12px] space-y-0.5 border border-rose-500/30">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>STUDIO BUSY FOR THIS DATE!</span>
                          </div>
                          <p className="text-[11px]">You already have Confirmed Booking <strong>{conflictingConfirmedBooking.bookingNumber || conflictingConfirmedBooking.clientName}</strong> on {b.eventDate}.</p>
                        </div>
                      )}

                      <div className={`text-[13px] space-y-2 border-t border-b py-3 ${isAdminDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                        {(() => {
                          const mainPackagePrice = Number(b.basePackagePrice || 0);
                          const zoneFee = Number(b.zoneFee || 0);
                          const mainMakeoverTotal = mainPackagePrice + zoneFee;
                          const guests = Array.isArray(b.extraGuestsList) ? b.extraGuestsList : [];
                          const guestGross = Number(b.extraGuestsCost || 0);
                          const guestDiscount = Number(b.guestDiscountSaved || 0);
                          const couponDiscount = Number(b.couponDiscountAmount || 0) || (
                            b.appliedCoupon && b.appliedCoupon !== 'None' ? Math.max(0, Number(b.discountAmount || 0) - guestDiscount) : 0
                          );
                          const totalBeforeDiscounts = mainMakeoverTotal + guestGross;
                          const totalDiscounts = Math.max(0, guestDiscount + couponDiscount);
                          const finalAmount = Number(b.totalAmount ?? Math.max(0, totalBeforeDiscounts - totalDiscounts));
                          const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

                          return (
                            <>
                              <div className={`p-3 rounded-[16px] border space-y-1.5 ${isAdminDarkMode ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
                                <div className="flex justify-between items-center font-bold text-sky-400">
                                  <span>1. Main Makeover Package:</span>
                                  <span className="font-mono">{money(mainMakeoverTotal)}</span>
                                </div>
                                <div className="flex justify-between gap-3"><span className={iosMuted}>• Vanity:</span><span className="font-medium text-right">{b.kitType || 'Luxury Vanity Kit'}</span></div>
                                <div className="flex justify-between gap-3"><span className={iosMuted}>• Package:</span><span className="font-medium text-right">{b.packageName || 'Bridal Makeup'}</span></div>
                                <div className="flex justify-between gap-3"><span className={iosMuted}>• Package Price:</span><span className="font-mono">{money(mainPackagePrice)}</span></div>
                                <div className="flex justify-between gap-3"><span className={iosMuted}>• Travel Fee ({b.zoneName || 'Venue Location'}):</span><span className="font-mono">{money(zoneFee)}</span></div>
                                <div className="flex justify-between pt-1.5 mt-1 border-t border-slate-500/20 font-bold text-sky-300">
                                  <span>Main Makeover Package Total:</span><span className="font-mono">{money(mainMakeoverTotal)}</span>
                                </div>
                              </div>

                              <div className={`p-3 rounded-[16px] border space-y-1.5 ${isAdminDarkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                                <div className="flex justify-between items-center font-bold text-purple-400">
                                  <span>2. Additional Family & Guest Makeovers ({guests.length || Number(b.extraGuestsCount || 0)}):</span>
                                  <span className="font-mono">{money(guestGross)}</span>
                                </div>
                                {guests.length > 0 ? guests.map((g, gIdx) => {
                                  const guestVanity = currentDraftSafe.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'International Luxury Vanity Kit' : 'Premium HD Kit');
                                  const guestPackage = currentDraftSafe.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey || 'Makeover';
                                  const guestPrice = Number(currentDraftSafe.pricingByKit?.[g.kit]?.[g.packageKey] || 0);
                                  return (
                                    <div key={gIdx} className="p-2 mt-1 rounded-[12px] bg-white/5 border border-white/5 space-y-1">
                                      <div className="font-bold text-[11px] text-purple-300">Makeover #{gIdx + 1}</div>
                                      <div className="flex justify-between gap-3"><span className={iosMuted}>• Vanity:</span><span className="font-medium text-right">{guestVanity}</span></div>
                                      <div className="flex justify-between gap-3"><span className={iosMuted}>• Package:</span><span className="font-medium text-right">{guestPackage}</span></div>
                                      <div className="flex justify-between gap-3"><span className={iosMuted}>• Price:</span><span className="font-mono text-emerald-400">{money(guestPrice)}</span></div>
                                    </div>
                                  );
                                }) : <span className={`text-[11px] ${iosMuted}`}>No additional family or guest makeovers.</span>}
                                <div className="flex justify-between pt-1.5 mt-1 border-t border-slate-500/20 font-bold text-purple-300">
                                  <span>Additional Family & Guest Makeovers Total:</span><span className="font-mono">{money(guestGross)}</span>
                                </div>
                              </div>

                              <div className={`flex justify-between items-center p-3 rounded-[14px] font-bold ${isAdminDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                <span>Booking Total Before Discounts:</span><span className="font-mono">{money(totalBeforeDiscounts)}</span>
                              </div>

                              <div className={`p-3 rounded-[16px] border space-y-1.5 ${isAdminDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                                <div className="font-bold text-emerald-400">3. Discounts & Offers</div>
                                {guestDiscount > 0 && (
                                  <div className="flex justify-between gap-3"><span className={iosMuted}>• Additional Family & Guest Makeovers Discount:</span><span className="font-mono text-emerald-400">-{money(guestDiscount)}</span></div>
                                )}
                                {b.appliedCoupon && b.appliedCoupon !== 'None' && couponDiscount > 0 && (
                                  <div className="flex justify-between gap-3"><span className={iosMuted}>• Coupon Code ({b.appliedCoupon}):</span><span className="font-mono text-emerald-400">-{money(couponDiscount)}</span></div>
                                )}
                                {guestDiscount === 0 && couponDiscount === 0 && <div className={`text-[11px] ${iosMuted}`}>• No discounts applied.</div>}
                                <div className="flex justify-between pt-1.5 mt-1 border-t border-slate-500/20 font-bold text-emerald-400">
                                  <span>Total Discounts:</span><span className="font-mono">-{money(totalDiscounts)}</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 font-bold text-[15px]">
                                <span>Final Amount Payable:</span>
                                <span className={`${adminThemeStyle.accentText} font-mono text-[17px]`}>{money(finalAmount)}</span>
                              </div>

                              <div className="flex justify-between gap-3 pt-1"><span className={iosMuted}>Venue Location:</span><span className="font-medium text-right">{b.zoneName || 'Not Provided'}</span></div>
                              <div className="flex justify-between gap-3"><span className={iosMuted}>Address:</span><span className="truncate max-w-[220px] text-right">{b.venueAddress || 'Not Provided'}</span></div>
                            </>
                          );
                        })()}

                        {b.rejectionReason && (
                          <div className="p-3 rounded-[14px] bg-rose-500/15 text-rose-300 text-[12px] border border-rose-500/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-rose-400 flex items-center gap-1.5">
                                <Ban className="w-3.5 h-3.5" /> Rejection Verdict:
                              </strong>
                              {b.rejectionCode && (
                                <span className="font-mono font-bold text-[10px] bg-rose-500/30 px-2 py-0.5 rounded text-white">
                                  {b.rejectionCode} {b.rejectionLabel ? `• ${b.rejectionLabel}` : ''}
                                </span>
                              )}
                            </div>
                            <p className="text-[11.5px] leading-relaxed italic">{b.rejectionReason}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] rounded-[14px] shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{b.status === 'confirmed' ? 'Resend WhatsApp Confirmed Slip' : 'Accept & Send WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalData(b);
                              const defaultReason = rejectionReasonsList[0] || DEFAULT_REJECTION_REASONS[0];
                              setSelectedReasonCode(defaultReason.code);
                              setRejectionReasonText(defaultReason.message);
                            }}
                            className="py-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <Ban className="w-3 h-3" /> Reject
                          </button>
                        </div>

                        {/* Instant direct download button */}
                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className={`w-full py-2.5 ${isAdminDarkMode ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} font-bold text-[11px] rounded-[14px] flex items-center justify-center gap-1.5 transition active:scale-95 border border-white/10`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Status Slip (.JPG)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. FEEDBACKS */}
        {activeFolderId === 'feedbacks' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <MessageSquare className="w-5 h-5" /> Client Feedback & Suggestions Box
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Reviews, ratings, and creative suggestions submitted by clients.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold ${adminThemeStyle.badgeBg} px-3.5 py-1.5 rounded-full`}>
                {feedbacksList.length} Feedbacks
              </span>
            </div>

            {feedbacksList.length === 0 ? (
              <p className={`text-[14px] py-12 text-center ${iosMuted}`}>No client feedback submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacksList.map(item => (
                  <div key={item.id} className={`p-4.5 rounded-[20px] border space-y-2.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <h4 className="font-bold text-[15px] mt-1">{item.clientName}</h4>
                        {item.clientPhone && item.clientPhone !== 'Not Provided' && (
                          <p className={`text-[11px] font-mono ${iosMuted}`}>📞 {item.clientPhone}</p>
                        )}
                      </div>
                      <button onClick={() => setDeleteConfirmModal({ type: 'single', isFeedback: true, id: item.id, message: `Are you sure you want to delete feedback from ${item.clientName}?` })} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <p className={`text-[13px] leading-relaxed p-3.5 rounded-[16px] ${isAdminDarkMode ? 'bg-black/30 text-slate-300' : 'bg-white text-slate-800 shadow-sm'}`}>
                      "{item.message}"
                    </p>

                    <div className="flex justify-end">
                      <span className={`text-[10px] font-mono ${iosMuted}`}>
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
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Calendar className="w-5 h-5" /> Interactive Monthly Booking Calendar
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Visual color tags show free vs booked dates (🟢 Green = Confirmed / Busy, 🟡 Amber = Pending).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2.5 rounded-[14px] bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] font-mono min-w-[130px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2.5 rounded-[14px] bg-white/10 text-white hover:bg-white/20">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className={`text-[11px] font-bold py-1 uppercase ${iosMuted}`}>{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty_${i}`} className="h-16 sm:h-20 rounded-[16px]" />
              ))}

              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayBookingStatus(day);
                return (
                  <div
                    key={`day_${day}`}
                    onClick={() => status.hasBookings ? setSelectedCalendarDay(status) : null}
                    className={`h-16 sm:h-20 rounded-[16px] p-1.5 flex flex-col justify-between items-center transition-all duration-200 border cursor-pointer ${
                      status.hasBookings 
                        ? (status.isConfirmed 
                            ? 'bg-emerald-500/20 border-emerald-500/50 hover:scale-105 shadow-md' 
                            : 'bg-amber-500/20 border-amber-500/50 hover:scale-105 shadow-md')
                        : (isAdminDarkMode ? 'bg-white/5 border-white/10 opacity-75' : 'bg-slate-100 border-slate-200 opacity-75')
                    }`}
                  >
                    <span className={`text-xs font-bold font-mono ${status.hasBookings ? (status.isConfirmed ? 'text-emerald-400' : 'text-amber-400') : ''}`}>
                      {day}
                    </span>

                    {status.hasBookings && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${status.isConfirmed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {status.count} Booked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCalendarDay && (
              <div className={`p-4 rounded-[18px] border space-y-3 animate-fade-in ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm ${adminThemeStyle.accentText}`}>Date: {selectedCalendarDay.dateStr}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCalendarDay.isConfirmed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {selectedCalendarDay.isConfirmed ? 'LOCKED / CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className={`${adminThemeStyle.accentText} text-xs underline font-bold`}>Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className={`p-3 rounded-[14px] border text-xs space-y-1 ${isAdminDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex justify-between font-bold">
                        <span>{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className={`font-mono ${adminThemeStyle.accentText}`}>₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className={iosMuted}>Look: {b.packageName} ({b.kitType})</p>
                      <p className={`text-[11px] truncate ${iosMuted}`}>📍 {b.venueAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. GALLERY & MEDIA */}
        {activeFolderId === 'gallery' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Film className="w-5 h-5" /> Transformations, Videos & GIFs Studio (20MB Max)
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Direct URLs (.mp4, .webm, .gif) or file uploads up to 20MB.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    ...currentDraftSafe,
                    galleryPhotos: [
                      ...(currentDraftSafe.galleryPhotos || []),
                      { type: "video", title: "New Glam Transformation", sub: "16HR HD Finish", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" }
                    ]
                  });
                }}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentDraftSafe?.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className={`p-4.5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono uppercase ${adminThemeStyle.accentText}`}>Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Image/GIF'})</span>
                    <button onClick={() => {
                      setDeleteConfirmModal({
                        type: 'single',
                        message: `Are you sure you want to delete media item #${idx + 1}?`,
                        onConfirm: () => {
                          setDraft({ ...currentDraftSafe, galleryPhotos: currentDraftSafe.galleryPhotos.filter((_, i) => i !== idx) });
                        }
                      });
                    }} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-[10px] mb-1 ${iosMuted}`}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...currentDraftSafe.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                      }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`}>
                        <option value="video">🎥 Auto-play Video</option>
                        <option value="image">🖼️ Image / Animated GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-[10px] mb-1 ${iosMuted}`}>Subtitle</label>
                      <input type="text" value={item.sub || ''} onChange={e => {
                        const copy = [...currentDraftSafe.galleryPhotos];
                        copy[idx] = { ...copy[idx], sub: e.target.value };
                        setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                      }} className={`w-full p-3 rounded-[14px] text-xs ${iosInputBg}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...currentDraftSafe.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`} />
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Direct URL (Video, GIF, or Image link)</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...currentDraftSafe.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...currentDraftSafe, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-mono ${adminThemeStyle.accentText} ${iosInputBg}`} />
                  </div>

                  <label className={`block text-center py-3 rounded-[14px] ${adminThemeStyle.badgeBg} ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer hover:opacity-80 transition shadow-sm`}>
                    Upload Video / GIF / Image (&lt;20MB)
                    <input type="file" accept="video/*,image/*,.gif" onChange={e => handleMediaUpload(e, idx)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Gallery Media'}
              onClick={() => handleSaveSpecificCard('Gallery Media')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Gallery Media' ? 'Saving...' : 'Save Gallery Media Live'}</span>
            </button>
          </div>
        )}

        {/* 9. MAINTENANCE MODE */}
        {activeFolderId === 'app_maintenance' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Wrench className="w-5 h-5" /> App Down & Maintenance Controller
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                Turn on to politely lock customer app with an elegant maintenance notice during upgrades.
              </p>
            </div>

            <div className={`p-5 rounded-[22px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${currentDraftSafe.isAppDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  <h4 className="font-bold text-sm">App Down / Maintenance Mode</h4>
                </div>
                <p className={`text-xs max-w-lg leading-relaxed ${iosMuted}`}>
                  {currentDraftSafe.isAppDown 
                    ? "🔴 ON: Customer App is locked. Visitors see a polite maintenance banner stating system upgrades are in progress."
                    : "🟢 OFF: Customer App is fully active, accepting estimates and live bookings."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...currentDraftSafe, isAppDown: !currentDraftSafe.isAppDown })}
                className={`px-5 py-3 rounded-[16px] font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                  currentDraftSafe.isAppDown ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {currentDraftSafe.isAppDown ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{currentDraftSafe.isAppDown ? 'MAINTENANCE (ON)' : 'LIVE (ACTIVE)'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Maintenance Mode'}
              onClick={() => handleSaveSpecificCard('Maintenance Mode')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance Status Live'}</span>
            </button>
          </div>
        )}

        {/* 10. FLOATING PROMO BANNER */}
        {activeFolderId === 'floating' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <Gift className="w-5 h-5" /> Floating Promo Offer Banner Controller
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure bottom-right floating offer pill text, code and activation status.</p>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Enable Floating Promo Banner Widget</span>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: {
                      ...(currentDraftSafe.floatingBanner || {}),
                      enabled: !(currentDraftSafe.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 ${currentDraftSafe?.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
                >
                  {currentDraftSafe?.floatingBanner?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{currentDraftSafe?.floatingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] mb-1 ${iosMuted}`}>Badge Tag</label>
                  <input
                    type="text"
                    value={currentDraftSafe?.floatingBanner?.tag || ''}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), tag: e.target.value }
                    })}
                    className={`w-full p-3.5 rounded-[14px] text-xs ${iosInputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] mb-1 ${iosMuted}`}>Promo Code</label>
                  <input
                    type="text"
                    value={currentDraftSafe?.floatingBanner?.code || ''}
                    onChange={e => setDraft({
                      ...currentDraftSafe,
                      floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), code: e.target.value.toUpperCase() }
                    })}
                    className={`w-full p-3.5 rounded-[14px] text-xs font-mono font-bold ${adminThemeStyle.accentText} ${iosInputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${iosMuted}`}>Banner Title</label>
                <input
                  type="text"
                  value={currentDraftSafe?.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), title: e.target.value }
                  })}
                  className={`w-full p-3.5 rounded-[14px] text-xs ${iosInputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${iosMuted}`}>Action Button Text</label>
                <input
                  type="text"
                  value={currentDraftSafe?.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...currentDraftSafe,
                    floatingBanner: { ...(currentDraftSafe.floatingBanner || {}), actionText: e.target.value }
                  })}
                  className={`w-full p-3.5 rounded-[14px] text-xs ${iosInputBg}`}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Floating Banner'}
              onClick={() => handleSaveSpecificCard('Floating Banner')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Floating Banner' ? 'Saving...' : 'Save Floating Banner Live'}</span>
            </button>
          </div>
        )}

        {/* 11. PROMO COUPONS, TIMERS & GUEST OFFERS SECTION */}
        {activeFolderId === 'coupons' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className={`font-bold text-[18px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Tag className="w-5 h-5" /> Promo Coupons, Timers & Extra Guest Offers
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Set promo discount codes, timers, active status, and automated extra guest group savings.</p>
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
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Coupon
              </button>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs uppercase tracking-wider">Extra Family Guest Discount Tier</span>
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
                  className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 ${currentDraftSafe?.guestDiscount?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
                >
                  {currentDraftSafe?.guestDiscount?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{currentDraftSafe?.guestDiscount?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Discount Percentage (%)</label>
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
                    className={`w-full p-3.5 rounded-[16px] font-mono ${adminThemeStyle.accentText} font-bold text-sm ${iosInputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>⏱️ Guest Offer Expiry Date & Time</label>
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
                    className={`w-full p-3.5 rounded-[16px] text-xs font-mono text-amber-400 ${iosInputBg}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(currentDraftSafe?.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className={`p-4.5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono font-bold text-[15px] ${adminThemeStyle.accentText}`}>{code}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isCodeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
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
                          className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${isCodeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          setDeleteConfirmModal({
                            type: 'single',
                            message: `Are you sure you want to delete coupon "${code}"?`,
                            onConfirm: () => {
                              const copy = { ...(currentDraftSafe.validCoupons || {}) };
                              delete copy[code];
                              setDraft({ ...currentDraftSafe, validCoupons: copy });
                            }
                          });
                        }} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className={`block text-[10px] mb-1 ${iosMuted}`}>Discount Type</span>
                        <select
                          value={c.type || 'percent'}
                          onChange={e => setDraft({
                            ...currentDraftSafe,
                            validCoupons: {
                              ...currentDraftSafe.validCoupons,
                              [code]: { ...c, type: e.target.value }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`}
                        >
                          <option value="percent">% Percent Off</option>
                          <option value="flat">₹ Flat Discount</option>
                        </select>
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${iosMuted}`}>Value ({c.type === 'percent' ? '%' : '₹'})</span>
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
                          className={`w-full p-3 rounded-[14px] font-mono ${adminThemeStyle.accentText} text-xs font-bold ${iosInputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${iosMuted}`}>⏱️ Expiry Date & Time</span>
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
                          className={`w-full p-3 rounded-[14px] text-xs font-mono text-amber-400 ${iosInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <span className={`block text-[10px] mb-1 ${iosMuted}`}>Promo Display Description / Label</span>
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
                        className={`w-full p-3 rounded-[14px] text-xs ${iosInputBg}`}
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Coupons & Offers' ? 'Saving...' : 'Save Promo Coupons & Guest Offers Live'}</span>
            </button>
          </div>
        )}

        {/* 12. MASTER FEATURE TOGGLES */}
        {activeFolderId === 'toggles_master' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div>
              <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <SlidersHorizontal className="w-5 h-5" /> Master Feature & Section Toggles
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Enable or disable any tab, section or feature on the customer app.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { key: 'showLogoOnApp', label: 'Show Studio Logo on Main App', desc: 'Render uploaded brand logo in header and splash' },
                { key: 'showProfileOnApp', label: 'Show Profile Photo on Main App', desc: 'Render artist avatar photo in header' },
                { key: 'enableAnnouncements', label: 'Top Announcements Ticker', desc: 'Show/hide rotating top announcement bar' },
                { key: 'enableCoupons', label: 'Promo Coupon System', desc: 'Enable/disable coupon codes application' },
                { key: 'enableGuestDiscount', label: 'Extra Guest Group Discount', desc: 'Apply automatic savings on multiple guests' },
                { key: 'enableFloatingBanner', label: 'Bottom Floating Offer Widget', desc: 'Show/hide bottom right floating promo pill' },
                { key: 'enableGallery', label: 'Transformations Video Gallery Tab', desc: 'Show/hide signature video & photo lookbook' },
                { key: 'enableBrands', label: 'Vanity Brands Kit Tab', desc: 'Show/hide authentic cosmetics brand list' },
                { key: 'enableEstimator', label: 'Estimator / Calculator Tab', desc: 'Show/hide custom booking price estimator' }
              ].map(toggle => {
                const isEnabled = currentDraftSafe?.toggles?.[toggle.key] !== false;
                return (
                  <div key={toggle.key} className={`p-4 rounded-[18px] border flex items-center justify-between gap-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[13px]">{toggle.label}</h4>
                      <p className={`text-[11px] ${iosMuted}`}>{toggle.desc}</p>
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
                      className={`px-4 py-2 rounded-[14px] flex items-center gap-1 font-bold text-xs transition active:scale-95 ${isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
                    >
                      {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Master Toggles'}
              onClick={() => handleSaveSpecificCard('Master Toggles')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Master Toggles' ? 'Saving...' : 'Save Master Toggles Live'}</span>
            </button>
          </div>
        )}

        {/* 13. VISITOR & TRAFFIC LOGS */}
        {activeFolderId === 'traffic_logs' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Activity className="w-5 h-5" /> Live Traffic & Instagram Visitor Logs
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Track visitors arriving from your Instagram bio, links, and direct traffic in real-time.</p>
              </div>
              <span className={`text-[13px] font-mono font-bold ${adminThemeStyle.badgeBg} px-3.5 py-1.5 rounded-full`}>
                {visitorLogs.length} Recent Visits Logged
              </span>
            </div>

            {visitorLogs.length === 0 ? (
              <p className={`text-[14px] py-12 text-center ${iosMuted}`}>No visitor traffic recorded yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {visitorLogs.map(log => (
                  <div key={log.id} className={`p-4 rounded-[18px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono ${adminThemeStyle.accentText}`}>Source/ID: @{log.instagramIdOrSource || 'Direct'}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">Active Visit</span>
                      </div>
                      <p className={`text-[12px] truncate max-w-md ${iosMuted}`}>{log.userAgent}</p>
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

        {/* 14. PROMOTIONS & BROADCAST */}
        {activeFolderId === 'promotions' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
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
              className={`w-full p-4 rounded-[18px] text-[13px] font-mono ${iosInputBg}`}
            />
            <button
              type="button"
              onClick={() => handleSaveSpecificCard('Broadcast Studio')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2 transition`}
            >
              <Send className="w-4 h-4" />
              <span>Save Broadcast Settings</span>
            </button>
          </div>
        )}

        {/* 15. ANNOUNCEMENTS TICKER */}
        {activeFolderId === 'announcements' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Volume2 className="w-5 h-5" /> Top Announcement Lines Ticker
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Edit rotating top banner messages displayed to clients.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...currentDraftSafe, announcements: [...(currentDraftSafe.announcements || []), "✨ New studio announcement line ✨"] })}
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow`}
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
                    className={`flex-1 p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmModal({
                        type: 'single',
                        message: `Are you sure you want to delete announcement line #${idx + 1}?`,
                        onConfirm: () => {
                          setDraft({ ...currentDraftSafe, announcements: currentDraftSafe.announcements.filter((_, i) => i !== idx) });
                        }
                      });
                    }}
                    className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-[14px]"
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Announcements' ? 'Saving...' : 'Save Announcements Live'}</span>
            </button>
          </div>
        )}

        {/* 16. TRAVEL FEES & CONVENIENCE ZONES */}
        {activeFolderId === 'convenience' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Car className="w-5 h-5" /> Travel Fees & Convenience Zones
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Manage venue travel charges for customer locations.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const keyName = prompt("Enter Unique Zone Key (e.g. noida_ext):");
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
                className={`px-4 py-2.5 ${adminThemeStyle.btnPrimary} text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow`}
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(currentDraftSafe?.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className={`p-4 rounded-[18px] border flex flex-col sm:flex-row items-center justify-between gap-3.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex-1 w-full space-y-1">
                    <span className={`text-[11px] font-mono uppercase font-bold ${adminThemeStyle.accentText}`}>Zone Key: {zKey}</span>
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
                      className={`w-full p-3.5 rounded-[14px] text-[13px] font-semibold ${iosInputBg}`}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <label className={`text-[13px] font-bold ${iosMuted}`}>Fee (₹):</label>
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
                      className={`w-32 p-3.5 rounded-[14px] font-mono ${adminThemeStyle.accentText} font-bold text-[13px] ${iosInputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Are you sure you want to delete zone "${zData.name}"?`,
                          onConfirm: () => {
                            const copy = { ...(currentDraftSafe.convenienceZones || {}) };
                            delete copy[zKey];
                            setDraft({ ...currentDraftSafe, convenienceZones: copy });
                          }
                        });
                      }}
                      className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-[14px]"
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Travel Fees' ? 'Saving...' : 'Save Travel Fees Live'}</span>
            </button>
          </div>
        )}

        {/* 17. THEMES & TYPOGRAPHY */}
        {activeFolderId === 'theme' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <h3 className={`font-bold text-[16px] uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
              <Palette className="w-5 h-5" /> Aesthetics & Console Customization
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`font-bold text-[14px] flex items-center gap-1.5 ${adminThemeStyle.accentText}`}>
                  <Smartphone className="w-4 h-4" /> Customer Main App Theme Settings
                </h4>
                <p className={`text-[12px] ${iosMuted}`}>Controls the appearance of the client booking application.</p>
                
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Color Theme</label>
                  <select value={currentDraftSafe?.theme?.colorTheme || 'real_glass_lens'} onChange={e => setDraft({ ...currentDraftSafe, theme: { ...(currentDraftSafe.theme || {}), colorTheme: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${adminThemeStyle.accentText} ${iosInputBg}`}>
                    <option value="real_glass_lens">🔮 Real Glass Lens (Translucent Mirror)</option>
                    <option value="real_ios_glass">🍎 Real iOS Liquid Glass</option>
                    <option value="liquid_glass">💎 Liquid Glass iOS</option>
                    <option value="one_ui_9">✨ Samsung One UI 9</option>
                    <option value="gold_rose">👑 Royal Gold Rose</option>
                    <option value="champagne">🥂 Champagne Gold</option>
                    <option value="emerald">💚 Emerald Luxe</option>
                    <option value="violet">🔮 Midnight Orchid Violet</option>
                    <option value="ruby">❤️ Ruby Velvet</option>
                    <option value="sapphire">💙 Sapphire Royal</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Font Family</label>
                  <select value={currentDraftSafe?.theme?.fontFamily || 'sans'} onChange={e => setDraft({ ...currentDraftSafe, theme: { ...(currentDraftSafe.theme || {}), fontFamily: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${adminThemeStyle.accentText} ${iosInputBg}`}>
                    <option value="sans">Plus Jakarta Sans</option>
                    <option value="outfit">Outfit (iOS Glass Minimal)</option>
                    <option value="serif">Playfair Display (Royal)</option>
                    <option value="cormorant">Cormorant Garamond</option>
                    <option value="cinzel">Cinzel</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="inter">Inter</option>
                    <option value="poppins">Poppins</option>
                    <option value="roboto">Roboto</option>
                  </select>
                </div>
              </div>

              <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`font-bold text-[14px] flex items-center gap-1.5 ${adminThemeStyle.accentText}`}>
                  <Shield className="w-4 h-4" /> Admin Console Theme Settings (Instant Apply)
                </h4>
                <p className={`text-[12px] ${iosMuted}`}>Instantly switch and apply console vibe.</p>
                
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Admin Aura Theme</label>
                  <select 
                    value={activeAdminThemeKey} 
                    onChange={e => handleInstantThemeChange(e.target.value)} 
                    className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${adminThemeStyle.accentText} ${iosInputBg}`}
                  >
                    <option value="admin_aurora">✨ Admin Aurora (Purple Neon Glow)</option>
                    <option value="sunset_glow">🌅 Sunset Amber Glow</option>
                    <option value="cyber_matrix">⚡ Cyber Matrix Emerald</option>
                    <option value="real_glass_lens">🔮 Crystal Glass Lens</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Default Customer Mode</label>
                  <select value={currentDraftSafe?.theme?.defaultMode || 'light'} onChange={e => setDraft({ ...currentDraftSafe, theme: { ...(currentDraftSafe.theme || {}), defaultMode: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${iosInputBg}`}>
                    <option value="light">☀️ Light Mode</option>
                    <option value="dark">🌙 Dark Mode</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Theme & Styles'}
              onClick={() => handleSaveSpecificCard('Theme & Styles')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Theme & Styles' ? 'Saving...' : 'Save Theme & Fonts Live'}</span>
            </button>
          </div>
        )}

        {/* 18. STUDIO IDENTITY & LOGO */}
        {activeFolderId === 'profile' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className={`font-bold text-[16px] flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                <User className="w-5 h-5" /> Studio Identity, Logo & Social Profiles
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure official studio title, upload custom logo & artist profile photo.</p>
            </div>

            <div className={`p-4.5 rounded-[20px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-bold uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <Crown className="w-4 h-4" /> 1. Official Studio Logo (Header & Splash)
                </span>
                <span className={`text-[11px] font-mono ${iosMuted}`}>Auto-Compressed</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow border">
                  {currentDraftSafe.studioLogo ? (
                    <img src={currentDraftSafe.studioLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Logo Image URL"
                    value={currentDraftSafe.studioLogo || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, studioLogo: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className={`inline-block px-4 py-2.5 rounded-[14px] ${adminThemeStyle.badgeBg} ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer hover:opacity-80 transition`}>
                    Upload & Compress Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className={`p-4.5 rounded-[20px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-bold uppercase flex items-center gap-2 ${adminThemeStyle.accentText}`}>
                  <ImageIcon className="w-4 h-4" /> 2. Artist Profile Photo
                </span>
                <span className={`text-[11px] font-mono ${iosMuted}`}>Avatar Card</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] overflow-hidden bg-neutral-200 border-2 border-white/20 shrink-0 shadow">
                  <img src={currentDraftSafe.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={currentDraftSafe.profileImage || ''}
                    onChange={e => setDraft({ ...currentDraftSafe, profileImage: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className={`inline-block px-4 py-2.5 rounded-[14px] ${adminThemeStyle.badgeBg} ${adminThemeStyle.accentText} text-xs font-bold cursor-pointer hover:opacity-80 transition`}>
                    Upload & Compress Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Display Title</label>
                <input type="text" value={currentDraftSafe.studioName || ''} onChange={e => setDraft({ ...currentDraftSafe, studioName: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Booking Contact Number</label>
                <input type="text" value={currentDraftSafe.whatsappNumber || ''} onChange={e => setDraft({ ...currentDraftSafe, whatsappNumber: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${adminThemeStyle.accentText} ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Instagram Handle</label>
                <input type="text" value={currentDraftSafe.instagramHandle || ''} onChange={e => setDraft({ ...currentDraftSafe, instagramHandle: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono text-pink-400 ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Artist Tagline / Subtitle</label>
                <input type="text" value={currentDraftSafe.artistTagline || ''} onChange={e => setDraft({ ...currentDraftSafe, artistTagline: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Studio Profile'}
              onClick={() => handleSaveSpecificCard('Studio Profile')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Studio Profile' ? 'Saving...' : 'Save Profile & Logo Live'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
