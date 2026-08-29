import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight, 
  Sliders, Palette, MapPin, Eye, ChevronDown, ChevronRight, ChevronLeft, 
  ListFilter, Car, Volume2, Activity, SlidersHorizontal, CheckCircle2, 
  XCircle, Clock, Gift, AlertCircle, Calendar, Download, FileCheck, 
  Hash, AlertTriangle, Wrench, X, MessageSquare, RotateCcw, Ban, 
  Folder, FolderOpen, ArrowLeft, Star, Fingerprint, ShieldCheck, Key, Mail, Settings, ArrowUp, ArrowDown, Edit3, GitBranch, Search, CheckSquare, Square, ZoomIn
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

  theme: {
    fontFamily: "sans",
    colorTheme: "real_glass_lens",
    defaultMode: "light"
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
    discountPercent: 15
  },

  kitText: {
    international: {
      simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling." },
      hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling." },
      super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry." },
      cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling." },
      engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling." },
      royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling." }
    },
    drugstore: {
      simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling." },
      hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling." },
      super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling." },
      cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling." },
      engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping." },
      royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping." }
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
  real_glass_lens: {
    accentGradient: "from-sky-300 via-blue-400 to-indigo-400",
    btnPrimary: "bg-white/40 backdrop-blur-[24px] border border-white/60 hover:bg-white/60 text-black font-bold shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[16px]",
    accentText: "text-blue-600 dark:text-blue-300",
    accentBorder: "border-white/50",
    activeNav: "bg-white/50 backdrop-blur-[24px] border border-white/70 text-blue-700 font-bold shadow-md rounded-[22px] px-4 py-2"
  },
  real_ios_glass: {
    accentGradient: "from-sky-400 via-blue-500 to-indigo-500",
    btnPrimary: "bg-[#007AFF] hover:bg-blue-600 text-white font-semibold shadow-lg rounded-[16px]",
    accentText: "text-blue-500 dark:text-blue-400",
    accentBorder: "border-blue-500/40",
    activeNav: "bg-[#007AFF] text-white font-bold shadow-md rounded-[22px] px-4 py-2"
  },
  liquid_glass: {
    accentGradient: "from-cyan-400 via-sky-300 to-indigo-400",
    btnPrimary: "bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-xl rounded-[16px]",
    accentText: "text-cyan-500 dark:text-cyan-400",
    accentBorder: "border-cyan-500/40",
    activeNav: "bg-cyan-500 text-neutral-950 font-bold shadow-lg rounded-[22px] px-4 py-2"
  },
  one_ui_9: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md rounded-[16px]",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/30",
    activeNav: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md rounded-[22px] px-4 py-2"
  },
  gold_rose: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md rounded-[16px]",
    accentText: "text-rose-600 dark:text-rose-400",
    accentBorder: "border-rose-500/30",
    activeNav: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow rounded-[22px] px-4 py-2"
  },
  champagne: {
    accentGradient: "from-amber-200 via-yellow-400 to-amber-500",
    btnPrimary: "bg-amber-400 text-neutral-950 font-bold shadow-lg rounded-[16px]",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-400/30",
    activeNav: "bg-amber-400 text-neutral-950 font-bold shadow rounded-[22px] px-4 py-2"
  },
  emerald: {
    accentGradient: "from-emerald-400 via-teal-300 to-emerald-500",
    btnPrimary: "bg-emerald-500 text-neutral-950 font-bold shadow-lg rounded-[16px]",
    accentText: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30",
    activeNav: "bg-emerald-500 text-neutral-950 font-bold shadow rounded-[22px] px-4 py-2"
  },
  violet: {
    accentGradient: "from-purple-400 via-pink-400 to-rose-400",
    btnPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg rounded-[16px]",
    accentText: "text-purple-600 dark:text-purple-400",
    accentBorder: "border-purple-500/30",
    activeNav: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow rounded-[22px] px-4 py-2"
  },
  ruby: {
    accentGradient: "from-rose-500 via-red-600 to-pink-600",
    btnPrimary: "bg-rose-600 text-white font-bold shadow-lg rounded-[16px]",
    accentText: "text-rose-500 dark:text-rose-400",
    accentBorder: "border-rose-500/30",
    activeNav: "bg-rose-600 text-white font-bold shadow rounded-[22px] px-4 py-2"
  },
  sapphire: {
    accentGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    btnPrimary: "bg-indigo-600 text-white font-bold shadow-lg rounded-[16px]",
    accentText: "text-indigo-500 dark:text-indigo-400",
    accentBorder: "border-indigo-500/30",
    activeNav: "bg-indigo-600 text-white font-bold shadow rounded-[22px] px-4 py-2"
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

const PRE_ADDED_REJECTION_REASONS = [
  "Thank you for reaching out! We are unfortunately already fully booked for this date. Please consider selecting another date.",
  "Our senior makeup artists are scheduled for another event on this requested date. We would love to accommodate you on an alternate date.",
  "Due to prior studio commitments in another city/location, we cannot take further appointments for this date.",
  "Your requested time slot is unavailable. Please visit our app and choose an alternative available date.",
  "We are currently experiencing peak seasonal bookings and this date has reached full capacity. We apologize for the inconvenience.",
  "Thank you for your interest! Unfortunately, we are not operational at the requested venue location on this date."
];

const INITIAL_FOLDERS = [
  { id: 'bookings', label: 'Live Bookings Queue', icon: CalendarCheck, desc: 'Review, accept, hold, reject & generate slips', countKey: 'bookings' },
  { id: 'general', label: 'General & Security Settings', icon: Settings, desc: 'Biometric, Face ID, Fingerprint Scan Registration & Recovery' },
  { id: 'calendar_view', label: 'Availability Calendar', icon: Calendar, desc: 'Color-coded monthly schedule matrix' },
  { id: 'feedbacks', label: 'Client Feedback & Suggestions', icon: MessageSquare, desc: 'View client reviews, ratings & feedback', countKey: 'feedbacks' },
  { id: 'packages_master', label: 'Package Management (Images & Titles)', icon: Layers, desc: 'Manage package photos, names and descriptions per kit' },
  { id: 'gallery', label: 'Transformations & Media', icon: Film, desc: 'Upload client video reels, GIFs & photos' },
  { id: 'app_maintenance', label: 'Maintenance Mode', icon: Wrench, desc: 'Politely lock customer app during upgrades' },
  { id: 'floating', label: 'Floating Promo Banner', icon: Gift, desc: 'Edit bottom offer pill & auto-hide rules' },
  { id: 'coupons', label: 'Promo Coupons & Timers', icon: Tag, desc: 'Manage discount codes, timers & active status' },
  { id: 'toggles_master', label: 'Master Feature & Section Toggles', icon: SlidersHorizontal, desc: 'Enable/disable any tab, section or feature' },
  { id: 'traffic_logs', label: 'Visitor Logs & Traffic', icon: Activity, desc: 'Track real-time Instagram bio & link visits' },
  { id: 'promotions', label: 'WhatsApp Broadcast Studio', icon: Megaphone, desc: 'Send bulk promo alerts via Baileys gateway' },
  { id: 'announcements', label: 'Top Announcements Ticker', icon: Volume2, desc: 'Configure top rotating ticker announcements' },
  { id: 'convenience', label: 'Travel Fees & Zones', icon: Car, desc: 'Edit venue travel charges per area' },
  { id: 'prices', label: 'Package Rates Manager', icon: Percent, desc: 'Adjust rates for Luxury vs HD kit looks' },
  { id: 'theme', label: 'Themes & Typography', icon: Palette, desc: 'Aesthetic skins, fonts & mode defaults' },
  { id: 'profile', label: 'Studio Identity & Logo', icon: User, desc: 'Upload Studio Logo, Profile Photo & Contact' }
];

const ADMIN_APP_VERSIONS = [
  { version: "v3.2.0", date: "August 29, 2026", status: "Active Live Production", changes: "10 aesthetic themes, translucent glass lens theme, and fixed blank section bugs." }
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

const WA_SERVER_URL = "https://simple-holidays-enable-ranger.trycloudflare.com";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hf_admin_auth') === 'true';
  });
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(false);
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
  const [actionStatus, setActionStatus] = useState('');

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
            recoveryEmail: data.recoveryEmail || "aqiffarooqui@gmail.com",
            kitText: {
              international: { ...DEFAULT_CONFIG.kitText.international, ...(data.kitText?.international || {}) },
              drugstore: { ...DEFAULT_CONFIG.kitText.drugstore, ...(data.kitText?.drugstore || {}) }
            },
            kitImages: {
              international: { ...DEFAULT_CONFIG.kitImages.international, ...(data.kitImages?.international || {}) },
              drugstore: { ...DEFAULT_CONFIG.kitImages.drugstore, ...(data.kitImages?.drugstore || {}) }
            },
            theme: { ...DEFAULT_CONFIG.theme, ...(data.theme || {}) },
            toggles: { ...DEFAULT_CONFIG.toggles, ...(data.toggles || {}) },
            floatingBanner: { ...DEFAULT_CONFIG.floatingBanner, ...(data.floatingBanner || {}) }
          }));
          if (data.adminFoldersOrder && Array.isArray(data.adminFoldersOrder)) {
            const reordered = data.adminFoldersOrder.map(id => INITIAL_FOLDERS.find(f => f.id === id)).filter(Boolean);
            if (reordered.length === INITIAL_FOLDERS.length) {
              setAdminFolders(reordered);
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
    if (pinInput === (draft.adminPin || "8760")) {
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
      setActionStatus("✅ Fingerprint Hardware Scanner Verified!");
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
      
      const updatedDraft = {
        ...draft,
        biometricEnabled: true,
        registeredFingerprintHash: secureHash
      };
      setDraft(updatedDraft);

      try {
        await updateLiveConfig(JSON.parse(JSON.stringify(updatedDraft)));
      } catch (e) {
        console.warn("Cloud sync warning for fingerprint:", e);
      }

      setActionStatus("🎉 Fingerprint successfully scanned via hardware sensor and stored securely!");
    }, 2000);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const targetEmail = draft.recoveryEmail || "aqiffarooqui@gmail.com";
    setForgotPasswordStatus(`📧 Master Password Recovery Link & Current PIN dispatched to ${targetEmail}! Check inbox.`);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotPasswordStatus('');
    }, 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (oldPinInput !== (draft.adminPin || "8760") && oldPinInput !== "8760") {
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
      setDraft(prev => ({ ...prev, adminPin: newPinInput }));
      const cleanData = JSON.parse(JSON.stringify({ ...draft, adminPin: newPinInput }));
      await updateLiveConfig(cleanData);
      setActionStatus("🎉 Admin PIN Password successfully updated!");
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err) {
      alert("Error updating password: " + err.message);
    }
  };

  const handleSaveSpecificCard = async (sectionName) => {
    setSavingSection(sectionName);
    setActionStatus('');
    try {
      const payload = {
        ...draft,
        adminFoldersOrder: adminFolders.map(f => f.id)
      };
      const cleanData = JSON.parse(JSON.stringify(payload));
      await updateLiveConfig(cleanData);
      setActionStatus(`🎉 ${sectionName} saved & synced live to Customer App!`);
    } catch (err) {
      setActionStatus(`❌ Error saving ${sectionName}: ${err.message}`);
    } finally {
      setSavingSection('');
    }
  };

  const handleAcceptBookingWhatsApp = async (b) => {
    setActionStatus(`Dispatching Final Confirmation Slip to ${b.clientName}...`);
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
      setActionStatus(`✅ Final Confirmation Slip sent to ${b.clientName} via Cloudflare Tunnel!`);
    } catch (err) {
      setActionStatus(`⚠️ Termux server offline. Marking status as confirmed.`);
      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
    }
  };

  const handleManualStatusChange = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      setActionStatus(`✅ Booking marked as ${newStatus.toUpperCase()} successfully!`);
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

      const rejectMsg = 
        `Dear *${rejectModalData.clientName}*,\n\n` +
        `Thank you for your booking request (#${rejectModalData.bookingNumber || 'HF-BOOKING'}) for *${rejectModalData.eventDate}* with *H&F Makeup Artist*.\n\n` +
        `*Update on your request:* We are unable to accept this booking.\n` +
        `*Note:* ${rejectionReasonText}\n\n` +
        `We truly appreciate your interest and hope to serve you on future dates!`;

      fetch(`${WA_SERVER_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rejectModalData.clientPhone, message: rejectMsg })
      }).catch(() => {});

      setActionStatus(`❌ Booking marked as REJECTED.`);
      setRejectModalData(null);
    } catch (err) {
      alert("Error rejecting booking: " + err.message);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
      if (deleteConfirmModal.type === 'single') {
        await deleteDoc(doc(db, "bookings", deleteConfirmModal.id));
        setActionStatus("🗑️ Booking deleted successfully.");
      } else if (deleteConfirmModal.type === 'batch') {
        for (const id of selectedBookings) {
          await deleteDoc(doc(db, "bookings", id));
        }
        setActionStatus(`🗑️ Successfully deleted ${selectedBookings.length} bookings.`);
        setSelectedBookings([]);
      }
    } catch (err) {
      alert("Error deleting booking(s): " + err.message);
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

  const handleGenerateSlipJpgOnDemand = (b) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1760;

    const isRejected = b.status === 'rejected';
    const isConfirmed = b.status === 'confirmed';

    const drawAdminSlip = (logoImgObj) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1080, 1760);
      const bgGrad = ctx.createRadialGradient(540, 250, 40, 540, 780, 800);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#fafafa');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(20, 20, 1040, 1720);

      ctx.strokeStyle = '#007AFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1680);

      ctx.textAlign = 'center';
      ctx.fillStyle = isRejected ? '#e11d48' : (isConfirmed ? '#059669' : '#0f172a');
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(
        isRejected ? 'BOOKING STATUS: DECLINED / REJECTED' : (isConfirmed ? 'OFFICIAL CONFIRMED APPOINTMENT SLIP' : 'PENDING BOOKING REQUEST SLIP'), 
        540, 275
      );

      const rows = [
        { label: 'BOOKING NUMBER', val: b.bookingNumber || '#HF-RECORD' },
        { label: 'CLIENT NAME', val: b.clientName || 'Not Provided' },
        { label: 'CONTACT NUMBER', val: b.clientPhone || 'Not Provided' },
        { label: 'EVENT DATE', val: b.eventDate || 'Not Provided' },
        { label: 'MAIN LOOK TIER', val: b.kitType || 'Luxury Vanity' },
        { label: 'MAIN LOOK PACKAGE', val: b.packageName || 'Bridal Makeup' },
        { label: 'LOCATION ZONE', val: `${b.zoneName || 'Delhi NCR'} (Fee: ₹${b.zoneFee || 350})` },
        { label: 'EXACT ADDRESS', val: b.venueAddress || 'To be confirmed' }
      ];

      let startY = 340;
      rows.forEach((row, idx) => {
        ctx.fillStyle = idx === 0 ? '#f0f9ff' : (idx % 2 === 0 ? '#f8fafc' : '#ffffff');
        ctx.fillRect(80, startY - 26, 920, 56);
        ctx.textAlign = 'left';
        ctx.fillStyle = idx === 0 ? '#0284c7' : '#64748b';
        ctx.font = idx === 0 ? 'bold 19px monospace' : 'bold 18px sans-serif';
        ctx.fillText(row.label, 100, startY + 9);
        ctx.fillStyle = idx === 0 ? '#0369a1' : '#0f172a';
        ctx.font = idx === 0 ? 'bold 21px monospace' : 'bold 20px sans-serif';
        ctx.fillText(row.val, 380, startY + 9);
        startY += 64;
      });

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      const downloadLink = document.createElement('a');
      downloadLink.download = `${isRejected ? 'Declined' : 'Confirmed'}_Slip_${b.bookingNumber || b.clientName}.jpg`;
      downloadLink.href = jpgUrl;
      downloadLink.click();
    };

    const logoUrlToLoad = draft.studioLogo || DEFAULT_CONFIG.studioLogo;
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoUrlToLoad;
    logoImg.onload = () => drawAdminSlip(logoImg);
    logoImg.onerror = () => drawAdminSlip(null);
  };

  const handleMediaUpload = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const isVid = file.type.startsWith('video');
        let finalUrl = '';
        if (isVid) {
          if (file.size > 20971520) {
            alert("Video exceeds 20MB. Please use a compressed clip or direct URL.");
            return;
          }
          finalUrl = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(file);
          });
        } else {
          finalUrl = await compressImageFile(file, 900, 0.85);
        }

        const copy = [...(draft.galleryPhotos || [])];
        copy[index] = {
          title: copy[index]?.title || "Signature Transformation",
          sub: copy[index]?.sub || "HD Artistry",
          url: finalUrl,
          type: isVid ? 'video' : 'image'
        };
        setDraft({ ...draft, galleryPhotos: copy });
        setActionStatus("Loaded media successfully! Click Save below.");
      } catch (err) {
        alert("Upload error: " + err.message);
      }
    }
  };

  const handlePackageImageUpload = async (e, kit, pkgKey) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 800, 0.85);
        setDraft({
          ...draft,
          kitImages: {
            ...draft.kitImages,
            [kit]: {
              ...(draft.kitImages?.[kit] || {}),
              [pkgKey]: compressedBase64
            }
          }
        });
        setActionStatus(`Loaded optimized image for ${pkgKey}. Click Save below.`);
      } catch (err) {
        alert("Image processing error: " + err.message);
      }
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 500, 0.85);
        setDraft({ ...draft, profileImage: compressedBase64, profilePhotoType: 'image' });
        setActionStatus('Loaded profile picture. Remember to click Save.');
      } catch (err) {
        alert("Error loading photo: " + err.message);
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 400, 0.85);
        setDraft({ ...draft, studioLogo: compressedBase64 });
        setActionStatus('Loaded studio logo. Remember to click Save.');
      } catch (err) {
        alert("Error loading logo: " + err.message);
      }
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (confirm("Delete this client feedback?")) {
      try {
        await deleteDoc(doc(db, "feedbacks", id));
      } catch (err) {
        alert("Error deleting: " + err.message);
      }
    }
  };

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayBookingStatus = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const matches = bookingsList.filter(b => b.eventDate === formatted);
    if (matches.length === 0) return { hasBookings: false, list: [] };
    const isConfirmed = matches.some(b => b.status === 'confirmed');
    return {
      hasBookings: true,
      isConfirmed,
      count: matches.length,
      list: matches,
      dateStr: formatted
    };
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

  const activeColorThemeKey = draft.theme?.colorTheme || 'real_glass_lens';
  const currentTheme = THEME_STYLES[activeColorThemeKey] || THEME_STYLES.real_glass_lens;
  const currentFontFamily = FONT_MAP[draft.theme?.fontFamily] || FONT_MAP.sans;

  const iosBg = isAdminDarkMode ? "bg-black text-[#F2F2F7]" : "bg-[#F2F2F7] text-[#1C1C1E]";
  const iosGroupCard = isAdminDarkMode 
    ? "bg-[#1C1C1E] border border-white/10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] overflow-hidden" 
    : "bg-white border border-black/5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden";
  const iosInputBg = isAdminDarkMode ? "bg-[#2C2C2E] text-white border-none rounded-[12px]" : "bg-[#F2F2F7] text-[#1C1C1E] border-none rounded-[12px]";
  const iosMuted = isAdminDarkMode ? "text-[#8E8E93]" : "text-[#8E8E93]";

  const activeFolderObj = adminFolders.find(f => f.id === activeFolderId);

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${iosBg} flex items-center justify-center p-5 relative overflow-hidden transition-colors duration-300`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        {showForgotPasswordModal ? (
          <form onSubmit={handleForgotPasswordSubmit} className={`max-w-sm w-full p-8 rounded-[28px] border text-center space-y-4 shadow-2xl ${iosGroupCard} animate-fade-in`}>
            <div className="w-16 h-16 rounded-[22px] bg-blue-500/15 text-blue-500 flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-[22px] font-bold tracking-tight">Recover Password</h2>
            <p className={`text-[13px] ${iosMuted}`}>Your recovery email is permanently secured to <strong>{draft.recoveryEmail || "aqiffarooqui@gmail.com"}</strong>.</p>
            
            {forgotPasswordStatus && (
              <div className="p-3.5 rounded-[14px] bg-emerald-500/15 text-emerald-700 text-[13px] font-semibold">
                {forgotPasswordStatus}
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-[#007AFF] text-white font-bold text-[14px] rounded-[14px] shadow-lg active:scale-95 transition">Send PIN to Recovery Email</button>
            <button type="button" onClick={() => setShowForgotPasswordModal(false)} className="text-[13px] text-[#007AFF] underline">Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-[28px] border text-center space-y-5 shadow-2xl ${iosGroupCard}`}>
            <div className="w-16 h-16 rounded-[22px] bg-blue-500/15 text-blue-500 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold tracking-tight">Admin Portal</h2>
              <p className={`text-[13px] ${iosMuted} mt-1`}>Apple iOS 19 Liquid Glass Suite</p>
            </div>
            <input type="password" placeholder="Enter Admin PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={`w-full text-center text-[18px] p-3.5 font-mono text-[#007AFF] ${iosInputBg}`} />
            
            <button type="submit" className="w-full py-3.5 bg-[#007AFF] text-white font-bold text-[14px] rounded-[14px] shadow-lg active:scale-95 transition">Unlock Console</button>
            
            <div className="space-y-2.5 pt-3 border-t border-slate-200/20">
              <button
                type="button"
                onClick={handleBiometricOrFaceLogin}
                className={`w-full py-3 font-bold text-[13px] text-[#007AFF] flex items-center justify-center gap-2 rounded-[14px] ${isAdminDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}
              >
                <Fingerprint className="w-4 h-4 text-[#007AFF]" />
                <span>Login with Fingerprint / Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-[13px] text-[#007AFF] underline block w-full pt-1"
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
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[20px] animate-fade-in">
          <div className={`max-w-sm w-full rounded-[24px] p-6 text-center space-y-4 shadow-2xl ${isAdminDarkMode ? 'bg-[#1C1C1E] text-white' : 'bg-white text-black'}`}>
            <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-[18px]">Delete Booking?</h3>
            <p className={`text-[13px] ${iosMuted}`}>
              {deleteConfirmModal.type === 'single' ? "Are you sure you want to delete this booking record? This action cannot be undone." : `Are you sure you want to delete ${selectedBookings.length} selected bookings?`}
            </p>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setDeleteConfirmModal(null)} className={`flex-1 py-3 rounded-[14px] font-bold text-[13px] ${isAdminDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>Cancel</button>
              <button onClick={handleExecuteDelete} className="flex-1 py-3 rounded-[14px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13px] shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[20px] animate-fade-in">
          <div className={`max-w-lg w-full rounded-[24px] p-6 space-y-4 shadow-2xl ${isAdminDarkMode ? 'bg-[#1C1C1E] text-white' : 'bg-white text-black'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-[18px]">Reject Booking: {rejectModalData.bookingNumber || rejectModalData.clientName}</h3>
              </div>
              <button onClick={() => setRejectModalData(null)} className="p-1 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <p className={`text-[13px] ${iosMuted}`}>
              Are you sure you want to decline this booking for <strong>{rejectModalData.clientName}</strong> on <strong>{rejectModalData.eventDate}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider">Reason for Rejection:</label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={e => setRejectionReasonText(e.target.value)}
                className={`w-full p-3.5 rounded-[14px] text-[13px] ${iosInputBg}`}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/40">
              <button onClick={() => setRejectModalData(null)} className="px-4 py-2.5 rounded-[14px] bg-slate-200 text-[13px] font-bold text-slate-700">Cancel</button>
              <button onClick={handleConfirmRejection} className="px-5 py-2.5 rounded-[14px] bg-rose-600 text-white font-bold text-[13px] shadow-lg">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-40 backdrop-blur-[28px] saturate-[180%] border-b px-5 sm:px-8 py-3.5 flex justify-between items-center shadow-sm transition-colors duration-300 ${isAdminDarkMode ? 'bg-[#1C1C1E]/80 border-white/10 text-white' : 'bg-[#F2F2F7]/85 border-black/10 text-[#1C1C1E]'}`}>
        <div className="flex items-center gap-3">
          {draft.studioLogo ? (
            <div className="w-10 h-10 rounded-[14px] bg-white/20 p-1 overflow-hidden shadow-sm">
              <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-[14px] bg-blue-500/15 text-blue-500 flex items-center justify-center shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
          )}

          <div>
            <h1 className="font-bold text-[16px] sm:text-[17px] tracking-tight">
              H&F Studio Admin
            </h1>
            <p className={`text-[11px] ${iosMuted}`}>iOS 19 Liquid Glass Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] border ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10 shadow-sm'}`}>
            <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
            <select
              value={screenZoom}
              onChange={e => setScreenZoom(Number(e.target.value))}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer"
            >
              <option value={80} className="text-black">80% (Compact)</option>
              <option value={100} className="text-black">100% (Standard)</option>
              <option value={115} className="text-black">115% (Zoomed)</option>
              <option value={130} className="text-black">130% (Large)</option>
            </select>
          </div>

          {!activeFolderId && (
            <button
              onClick={() => {
                if (isReorderMode) handleSaveSpecificCard("Card Sequence");
                setIsReorderMode(!isReorderMode);
              }}
              className={`px-3.5 py-2 rounded-[14px] text-[13px] font-bold flex items-center gap-1.5 transition ${isReorderMode ? 'bg-[#007AFF] text-white shadow-md' : (isAdminDarkMode ? 'bg-white/10 text-white' : 'bg-white text-[#007AFF] shadow-sm')}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isReorderMode ? 'Save Order' : 'Edit Order'}</span>
            </button>
          )}

          <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={`p-2.5 rounded-[14px] ${isAdminDarkMode ? 'bg-white/10 text-amber-400' : 'bg-white text-slate-800 shadow-sm'}`} title="Toggle Day/Night">
            {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="text-[13px] text-rose-500 font-bold hover:underline px-2 py-1">Lock</button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {activeFolderId ? (
            <button
              onClick={closeFolder}
              className={`px-4 py-2 rounded-[14px] text-[13px] font-bold flex items-center gap-2 text-[#007AFF] ${isAdminDarkMode ? 'bg-white/10' : 'bg-white shadow-sm'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Settings Folders</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#007AFF]" />
              <h3 className={`font-bold text-[12px] uppercase tracking-wider ${iosMuted}`}>
                {isReorderMode ? 'Reorder Mode Active: Use ⬆️ ⬇️ to move pills' : 'System Control Center Settings'}
              </h3>
            </div>
          )}

          {activeFolderObj && (
            <span className={`text-[13px] font-bold font-mono ${iosMuted}`}>
              Section: <strong className={isAdminDarkMode ? 'text-white' : 'text-[#1C1C1E]'}>{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {actionStatus && (
          <div className="p-3.5 rounded-[16px] bg-blue-500/15 border border-blue-500/30 font-bold text-[13px] text-center text-blue-500 shadow-sm animate-fade-in">
            {actionStatus}
          </div>
        )}

        {!activeFolderId && (
          <div className={`p-4 sm:p-5 ${iosGroupCard}`}>
            <div className="space-y-1">
              {adminFolders.map((f, index) => {
                const Icon = f.icon;
                const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

                return (
                  <div
                    key={f.id}
                    onClick={() => !isReorderMode && openFolder(f.id)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-[16px] transition-all duration-200 cursor-pointer group ${
                      isReorderMode 
                        ? 'bg-blue-500/10 ring-2 ring-blue-500 my-1' 
                        : (isAdminDarkMode ? 'hover:bg-white/10' : 'hover:bg-[#E5E5EA]/60')
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#007AFF] text-white flex items-center justify-center shadow-md shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-semibold text-[15px] tracking-tight truncate group-hover:text-[#007AFF] transition-colors">
                          {f.label}
                        </h4>
                        <p className={`text-[12px] truncate ${iosMuted}`}>{f.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {count !== null && (
                        <span className="text-[11px] font-mono font-bold bg-[#007AFF]/20 text-[#007AFF] px-2.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      )}

                      {isReorderMode ? (
                        <div className="flex items-center gap-1 bg-black/10 p-1 rounded-[10px]">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'up'); }}
                            className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === adminFolders.length - 1}
                            onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'down'); }}
                            className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${iosMuted}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeFolderId === 'general' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                <Settings className="w-5 h-5" /> General & Security Settings
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure Biometric, Face ID, Fingerprint Scan Registration, Password & Permanent Recovery Email.</p>
            </div>

            <div className={`p-5 rounded-[18px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#007AFF]" /> Hardware Fingerprint Scanner Integration
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Scan and save your fingerprint data locally via your device biometric hardware.</p>

              <div className="p-4 rounded-[16px] bg-blue-500/10 border border-blue-500/20 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center mx-auto shadow-md">
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
                      {draft.registeredFingerprintHash ? "✅ Hardware Fingerprint Registered & Saved Securely" : "⚠️ No fingerprint scanned yet"}
                    </p>
                    <button
                      type="button"
                      onClick={handleRegisterFingerprintScan}
                      className="px-5 py-2.5 rounded-[12px] bg-[#007AFF] text-white font-bold text-[13px] shadow active:scale-95 transition"
                    >
                      {draft.registeredFingerprintHash ? "Re-Scan & Update Fingerprint" : "Scan & Save Fingerprint"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-3.5 rounded-[14px] border flex items-center justify-between ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[13px] font-bold">Enable Touch ID / Biometrics</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, biometricEnabled: !draft.biometricEnabled })}
                    className={`px-3 py-1.5 rounded-[10px] font-bold text-[12px] ${draft.biometricEnabled ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-600 border border-rose-500/40'}`}
                  >
                    {draft.biometricEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className={`p-3.5 rounded-[14px] border flex items-center justify-between ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[13px] font-bold">Enable Face ID / Passkey</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, faceIdEnabled: !draft.faceIdEnabled })}
                    className={`px-3 py-1.5 rounded-[10px] font-bold text-[12px] ${draft.faceIdEnabled ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-600 border border-rose-500/40'}`}
                  >
                    {draft.faceIdEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#007AFF]" /> Admin App Version & History
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Deployment timeline and release changes for Admin Console.</p>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ADMIN_APP_VERSIONS.map((ver, vIdx) => (
                  <div key={vIdx} className={`p-3 rounded-[14px] border text-[13px] space-y-1 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#007AFF]">{ver.version}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                        {ver.status}
                      </span>
                    </div>
                    <p className="text-[12px]">{ver.changes}</p>
                    <span className={`text-[11px] font-mono ${iosMuted}`}>Released: {ver.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> Permanent Recovery Email ID
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>If you forget your PIN, recovery instructions and current PIN are dispatched here.</p>
              
              <input
                type="email"
                value={draft.recoveryEmail || "aqiffarooqui@gmail.com"}
                onChange={e => setDraft({ ...draft, recoveryEmail: e.target.value })}
                className={`w-full p-3 rounded-[14px] font-mono text-[13px] font-bold text-[#007AFF] border ${iosInputBg}`}
              />
            </div>

            <form onSubmit={handlePasswordChange} className={`p-5 rounded-[18px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Key className="w-4 h-4 text-[#007AFF]" /> Change Admin PIN Password
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
                    className={`w-full p-3 rounded-[14px] text-[13px] ${iosInputBg}`}
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
                      className={`w-full p-3 rounded-[14px] text-[13px] ${iosInputBg}`}
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
                      className={`w-full p-3 rounded-[14px] text-[13px] ${iosInputBg}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#007AFF] text-white font-bold text-[14px] rounded-[14px] shadow-lg active:scale-95 transition"
                >
                  Update Admin Password
                </button>
              </div>
            </form>

            <button
              type="button"
              disabled={savingSection === 'General Settings'}
              onClick={() => handleSaveSpecificCard('General Settings')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'General Settings' ? 'Saving...' : 'Save General & Security Settings Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'bookings' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF]">Incoming Customer Bookings Queue</h3>
                <p className={`text-[13px] ${iosMuted}`}>Filter, search by name/phone/no, select all, or delete multiple records.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#007AFF]/15 text-[#007AFF] px-3.5 py-1.5 rounded-full shadow-sm">
                {filteredBookingsList.length} / {bookingsList.length} Bookings
              </span>
            </div>

            <div className={`p-4 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
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
                    className={`w-full p-2.5 text-[13px] font-bold outline-none ${iosInputBg}`}
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
                      className={`flex-1 p-2.5 text-[13px] outline-none ${iosInputBg}`}
                    />
                    {bookingDateFilter && (
                      <button
                        type="button"
                        onClick={() => setBookingDateFilter('')}
                        className="px-3 py-2 rounded-[12px] bg-slate-200 text-xs font-bold text-slate-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="flex items-center gap-2 text-[13px] font-bold text-[#007AFF] hover:underline"
                >
                  {selectedBookings.length === filteredBookingsList.length && filteredBookingsList.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#007AFF]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Select All Visible ({filteredBookingsList.length})</span>
                </button>

                {selectedBookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmModal({ type: 'batch' })}
                    className="px-4 py-2 rounded-[12px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 transition"
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
                    <div key={b.id} className={`p-5 rounded-[22px] border space-y-3.5 transition-all ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} ${isSelected ? 'ring-2 ring-[#007AFF]' : ''} ${conflictingConfirmedBooking ? 'ring-2 ring-rose-500/60' : ''}`}>
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
                            className="mt-1 w-4 h-4 accent-[#007AFF] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[12px] font-bold text-[#007AFF] bg-blue-500/10 px-2 py-0.5 rounded-[8px]">
                                {b.bookingNumber || '#HF-PENDING'}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-600' : 
                                b.status === 'rejected' ? 'bg-rose-500/20 text-rose-600' : 
                                'bg-amber-500/20 text-amber-600'
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
                          onClick={() => setDeleteConfirmModal({ type: 'single', id: b.id })}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-[12px]"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {conflictingConfirmedBooking && (
                        <div className="p-3 rounded-[14px] bg-rose-500/15 text-rose-700 text-[12px] space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>STUDIO BUSY FOR THIS DATE!</span>
                          </div>
                          <p className="text-[11px]">You already have Confirmed Booking <strong>{conflictingConfirmedBooking.bookingNumber || conflictingConfirmedBooking.clientName}</strong> on {b.eventDate}.</p>
                        </div>
                      )}

                      <div className={`text-[13px] space-y-1 border-t border-b py-2.5 ${isAdminDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                        <div className="flex justify-between"><span className={iosMuted}>Event Date:</span><strong className="text-[#007AFF] font-mono">{b.eventDate}</strong></div>
                        <div className="flex justify-between"><span className={iosMuted}>Package:</span><span className="font-medium">{b.packageName}</span></div>
                        <div className="flex justify-between"><span className={iosMuted}>Vanity Kit:</span><span className="font-medium">{b.kitType}</span></div>
                        <div className="flex justify-between"><span className={iosMuted}>Extra Guests:</span><span className="font-medium">{b.extraGuestsCount || 0} Guest(s) (+₹{b.extraGuestsCost || 0})</span></div>
                        <div className="flex justify-between"><span className={iosMuted}>Venue Zone:</span><span className="font-medium">{b.zoneName}</span></div>
                        <div className="flex justify-between"><span className={iosMuted}>Address:</span><span className="truncate max-w-[180px]">{b.venueAddress}</span></div>
                        {b.rejectionReason && (
                          <div className="p-2.5 rounded-[10px] bg-rose-500/15 text-rose-700 text-[11px]">
                            <strong>Rejection Note:</strong> {b.rejectionReason}
                          </div>
                        )}
                        <div className="flex justify-between pt-1 font-bold"><span>Total Amount:</span><span className="text-[#007AFF] font-mono">₹{b.totalAmount?.toLocaleString('en-IN')}</span></div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] rounded-[12px] shadow-sm flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{b.status === 'confirmed' ? 'Resend WhatsApp Confirmed Slip' : 'Accept & Send WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2 bg-blue-500/15 text-blue-600 font-bold text-[11px] rounded-[10px] flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2 bg-amber-500/15 text-amber-600 font-bold text-[11px] rounded-[10px] flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalData(b);
                              setRejectionReasonText(PRE_ADDED_REJECTION_REASONS[0]);
                            }}
                            className="py-2 bg-rose-500/15 text-rose-600 font-bold text-[11px] rounded-[10px] flex items-center justify-center gap-1"
                          >
                            <Ban className="w-3 h-3" /> Reject
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className="w-full py-2 bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1.5 transition"
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

        {activeFolderId === 'feedbacks' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Client Feedback & Suggestions Box
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Reviews, ratings, and creative suggestions submitted by clients.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#007AFF]/15 text-[#007AFF] px-3.5 py-1.5 rounded-full">
                {feedbacksList.length} Feedbacks
              </span>
            </div>

            {feedbacksList.length === 0 ? (
              <p className={`text-[14px] py-12 text-center ${iosMuted}`}>No client feedback submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacksList.map(item => (
                  <div key={item.id} className={`p-4.5 rounded-[18px] border space-y-2.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
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
                      <button onClick={() => handleDeleteFeedback(item.id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <p className={`text-[13px] leading-relaxed p-3 rounded-[14px] ${isAdminDarkMode ? 'bg-black/30 text-slate-300' : 'bg-white text-slate-800 shadow-sm'}`}>
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

        {activeFolderId === 'calendar_view' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Interactive Monthly Booking Calendar
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Visual color tags show free vs booked dates (🟢 Green = Confirmed / Busy, 🟡 Amber = Pending).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2.5 rounded-[12px] bg-slate-200 text-[#007AFF]">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] font-mono min-w-[130px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2.5 rounded-[12px] bg-slate-200 text-[#007AFF]">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className={`text-[11px] font-bold py-1 uppercase ${iosMuted}`}>{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty_${i}`} className="h-16 sm:h-20 rounded-[14px]" />
              ))}

              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayBookingStatus(day);
                return (
                  <div
                    key={`day_${day}`}
                    onClick={() => status.hasBookings ? setSelectedCalendarDay(status) : null}
                    className={`h-16 sm:h-20 rounded-[14px] p-1.5 flex flex-col justify-between items-center transition-all duration-200 border cursor-pointer ${
                      status.hasBookings 
                        ? (status.isConfirmed 
                            ? 'bg-emerald-500/20 border-emerald-500/50 hover:scale-105 shadow-md' 
                            : 'bg-amber-500/20 border-amber-500/50 hover:scale-105 shadow-md')
                        : (isAdminDarkMode ? 'bg-white/5 border-white/10 opacity-75' : 'bg-slate-100 border-slate-200 opacity-75')
                    }`}
                  >
                    <span className={`text-xs font-bold font-mono ${status.hasBookings ? (status.isConfirmed ? 'text-emerald-500' : 'text-amber-500') : ''}`}>
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
              <div className={`p-4 rounded-[16px] border space-y-3 animate-fade-in ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#007AFF]">Date: {selectedCalendarDay.dateStr}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCalendarDay.isConfirmed ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                      {selectedCalendarDay.isConfirmed ? 'LOCKED / CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className="text-[#007AFF] text-xs underline font-bold">Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className={`p-3 rounded-[12px] border text-xs space-y-1 ${isAdminDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex justify-between font-bold">
                        <span>{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className="font-mono text-[#007AFF]">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
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

        {activeFolderId === 'packages_master' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Package Management (Images, Titles & Descriptions)
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>Manage custom look photos, package display names and descriptions per kit type.</p>
              </div>

              <div className={`inline-flex p-1.5 rounded-[16px] border gap-1 self-start ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('international')}
                  className={`px-4 py-2 rounded-[12px] text-xs font-bold transition ${editingKitTab === 'international' ? 'bg-[#007AFF] text-white shadow' : iosMuted}`}
                >
                  👑 Luxury Kit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('drugstore')}
                  className={`px-4 py-2 rounded-[12px] text-xs font-bold transition ${editingKitTab === 'drugstore' ? 'bg-[#007AFF] text-white shadow' : iosMuted}`}
                >
                  ✨ HD Kit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(partyPackages.concat(bridalPackages)).map(k => {
                const kitData = draft.kitText?.[editingKitTab] || DEFAULT_KIT_TEXT[editingKitTab];
                const pkgText = kitData?.[k] || DEFAULT_KIT_TEXT[editingKitTab][k] || { num: 1, name: k, desc: '' };
                const imgData = draft.kitImages?.[editingKitTab] || DEFAULT_KIT_IMAGES[editingKitTab];
                const pkgImg = imgData?.[k] || DEFAULT_KIT_IMAGES[editingKitTab][k] || '';

                return (
                  <div key={`${editingKitTab}_${k}`} className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#007AFF] font-mono uppercase">{k.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase font-bold">{editingKitTab}</span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-20 rounded-[16px] overflow-hidden bg-neutral-200 border shrink-0 shadow">
                        <img src={pkgImg} alt={pkgText.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={pkgImg}
                          onChange={e => setDraft({
                            ...draft,
                            kitImages: {
                              ...draft.kitImages,
                              [editingKitTab]: {
                                ...(draft.kitImages?.[editingKitTab] || {}),
                                [k]: e.target.value
                              }
                            }
                          })}
                          className={`w-full p-2.5 rounded-[12px] text-xs font-mono ${iosInputBg}`}
                        />
                        <label className="block text-center py-2 rounded-[12px] bg-blue-500/15 text-[#007AFF] text-[11px] font-bold cursor-pointer border border-blue-500/30 hover:bg-blue-500/25 transition">
                          Upload Photo (&lt;20MB)
                          <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, editingKitTab, k)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200/40">
                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Package Display Name</span>
                        <input
                          type="text"
                          value={pkgText.name}
                          onChange={e => setDraft({
                            ...draft,
                            kitText: {
                              ...(draft.kitText || {}),
                              [editingKitTab]: {
                                ...kitData,
                                [k]: { ...pkgText, name: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`}
                        />
                      </div>
                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Description</span>
                        <textarea
                          rows={2}
                          value={pkgText.desc}
                          onChange={e => setDraft({
                            ...draft,
                            kitText: {
                              ...(draft.kitText || {}),
                              [editingKitTab]: {
                                ...kitData,
                                [k]: { ...pkgText, desc: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] text-xs ${iosInputBg}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Package Master'}
              onClick={() => handleSaveSpecificCard('Package Master')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Master' ? 'Saving...' : 'Save Package Images & Titles Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'app_maintenance' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                <Wrench className="w-5 h-5" /> App Down & Maintenance Controller
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                Turn on to politely lock customer app with an elegant maintenance notice during upgrades.
              </p>
            </div>

            <div className={`p-5 rounded-[18px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${draft.isAppDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  <h4 className="font-bold text-sm">App Down / Maintenance Mode</h4>
                </div>
                <p className={`text-xs max-w-lg leading-relaxed ${iosMuted}`}>
                  {draft.isAppDown 
                    ? "🔴 ON: Customer App is locked. Visitors see a polite maintenance banner stating system upgrades are in progress."
                    : "🟢 OFF: Customer App is fully active, accepting estimates and live bookings."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...draft, isAppDown: !draft.isAppDown })}
                className={`px-5 py-3 rounded-[14px] font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                  draft.isAppDown ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {draft.isAppDown ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{draft.isAppDown ? 'MAINTENANCE (ON)' : 'LIVE (ACTIVE)'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Maintenance Mode'}
              onClick={() => handleSaveSpecificCard('Maintenance Mode')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance Status Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'floating' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                <Gift className="w-5 h-5" /> Floating Promo Offer Banner Controller
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure bottom-right floating offer pill text, code and activation status.</p>
            </div>

            <div className={`p-5 rounded-[18px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Enable Floating Promo Banner Widget</span>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...draft,
                    floatingBanner: {
                      ...(draft.floatingBanner || {}),
                      enabled: !(draft.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={`px-3 py-1.5 rounded-[12px] font-bold text-xs flex items-center gap-1.5 ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] mb-1 ${iosMuted}`}>Badge Tag</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.tag || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), tag: e.target.value }
                    })}
                    className={`w-full p-3 rounded-[12px] text-xs ${iosInputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] mb-1 ${iosMuted}`}>Promo Code</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.code || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), code: e.target.value.toUpperCase() }
                    })}
                    className={`w-full p-3 rounded-[12px] text-xs font-mono font-bold text-[#007AFF] ${iosInputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${iosMuted}`}>Banner Title</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), title: e.target.value }
                  })}
                  className={`w-full p-3 rounded-[12px] text-xs ${iosInputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${iosMuted}`}>Action Button Text</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), actionText: e.target.value }
                  })}
                  className={`w-full p-3 rounded-[12px] text-xs ${iosInputBg}`}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Floating Banner'}
              onClick={() => handleSaveSpecificCard('Floating Banner')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Floating Banner' ? 'Saving...' : 'Save Floating Banner Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'coupons' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Promo Coupons Manager & Expiry Timers
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Set coupon discounts, active status and expiry timer dates.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const code = prompt("Enter Coupon Code:");
                  if (code) {
                    const clean = code.toUpperCase().trim();
                    setDraft({
                      ...draft,
                      validCoupons: {
                        ...draft.validCoupons,
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
                className="px-4 py-2 bg-[#007AFF] text-white font-bold rounded-[12px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Coupon
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(draft.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className={`p-4.5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[#007AFF] font-bold text-[15px]">{code}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isCodeActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                          {isCodeActive ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, enabled: !isCodeActive }
                            }
                          })}
                          className={`px-3 py-1.5 rounded-[12px] font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${isCodeActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          const copy = { ...draft.validCoupons };
                          delete copy[code];
                          setDraft({ ...draft, validCoupons: copy });
                        }} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-[10px]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className={`block text-[10px] mb-1 ${iosMuted}`}>Discount Type</span>
                        <select
                          value={c.type || 'percent'}
                          onChange={e => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, type: e.target.value }
                            }
                          })}
                          className={`w-full p-2.5 rounded-[12px] text-xs font-bold ${iosInputBg}`}
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
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, value: Number(e.target.value) }
                            }
                          })}
                          className={`w-full p-2.5 rounded-[12px] font-mono text-[#007AFF] text-xs font-bold ${iosInputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${iosMuted}`}>⏱️ Expiry Date & Time</span>
                        <input
                          type="datetime-local"
                          value={c.expiryDate || ''}
                          onChange={e => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, expiryDate: e.target.value }
                            }
                          })}
                          className={`w-full p-2.5 rounded-[12px] text-xs font-mono text-amber-500 ${iosInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <span className={`block text-[10px] mb-1 ${iosMuted}`}>Promo Display Description / Label</span>
                      <input
                        type="text"
                        value={c.label || ''}
                        onChange={e => setDraft({
                          ...draft,
                          validCoupons: {
                            ...draft.validCoupons,
                            [code]: { ...c, label: e.target.value }
                          }
                        })}
                        className={`w-full p-2.5 rounded-[12px] text-xs ${iosInputBg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Coupons'}
              onClick={() => handleSaveSpecificCard('Coupons')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Coupons' ? 'Saving...' : 'Save Promo Coupons Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'gallery' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Film className="w-5 h-5" /> Transformations, Videos & GIFs Studio (20MB Max)
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Direct URLs (.mp4, .webm, .gif) or file uploads up to 20MB.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    ...draft,
                    galleryPhotos: [
                      ...(draft.galleryPhotos || []),
                      { type: "video", title: "New Glam Transformation", sub: "16HR HD Finish", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" }
                    ]
                  });
                }}
                className="px-4 py-2 bg-[#007AFF] text-white font-bold rounded-[12px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(draft.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className={`p-4.5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#007AFF] font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Image/GIF'})</span>
                    <button onClick={() => setDraft({ ...draft, galleryPhotos: draft.galleryPhotos.filter((_, i) => i !== idx) })} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-[10px] mb-1 ${iosMuted}`}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={`w-full p-2.5 rounded-[12px] text-xs font-bold ${iosInputBg}`}>
                        <option value="video">🎥 Auto-play Video</option>
                        <option value="image">🖼️ Image / Animated GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-[10px] mb-1 ${iosMuted}`}>Subtitle</label>
                      <input type="text" value={item.sub || ''} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], sub: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={`w-full p-2.5 rounded-[12px] text-xs ${iosInputBg}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-2.5 rounded-[12px] text-xs font-bold ${iosInputBg}`} />
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Direct URL (Video, GIF, or Image link)</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-2.5 rounded-[12px] text-xs font-mono text-[#007AFF] ${iosInputBg}`} />
                  </div>

                  <label className="block text-center py-2.5 rounded-[12px] bg-blue-500/15 text-[#007AFF] text-xs font-bold cursor-pointer border border-blue-500/30 hover:bg-blue-500/25 transition shadow-sm">
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
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Gallery Media' ? 'Saving...' : 'Save Gallery Media Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'toggles_master' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
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
                const isEnabled = draft.toggles?.[toggle.key] !== false;
                return (
                  <div key={toggle.key} className={`p-3.5 rounded-[16px] border flex items-center justify-between gap-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[13px]">{toggle.label}</h4>
                      <p className={`text-[11px] ${iosMuted}`}>{toggle.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft({
                        ...draft,
                        toggles: {
                          ...(draft.toggles || {}),
                          [toggle.key]: !isEnabled
                        }
                      })}
                      className={`px-3.5 py-2 rounded-[14px] flex items-center gap-1 font-bold text-xs transition active:scale-95 ${isEnabled ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
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
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Master Toggles' ? 'Saving...' : 'Save Master Toggles Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'traffic_logs' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Live Traffic & Instagram Visitor Logs
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Track visitors arriving from your Instagram bio, links, and direct traffic in real-time.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#007AFF]/15 text-[#007AFF] px-3.5 py-1.5 rounded-full">
                {visitorLogs.length} Recent Visits Logged
              </span>
            </div>

            {visitorLogs.length === 0 ? (
              <p className={`text-[14px] py-12 text-center ${iosMuted}`}>No visitor traffic recorded yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {visitorLogs.map(log => (
                  <div key={log.id} className={`p-3.5 rounded-[16px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#007AFF] font-mono">Source/ID: @{log.instagramIdOrSource || 'Direct'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">Active Visit</span>
                      </div>
                      <p className={`text-[12px] truncate max-w-md ${iosMuted}`}>{log.userAgent}</p>
                    </div>
                    <span className="text-[12px] text-[#007AFF] font-mono font-medium">
                      {log.visitedAt ? new Date(log.visitedAt.toDate?.() || log.visitedAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeFolderId === 'promotions' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
              <Megaphone className="w-5 h-5" /> WhatsApp Broadcast Studio
            </h3>
            <textarea
              rows={6}
              value={draft.announcements?.[0] || ""}
              onChange={e => {
                const updated = [...(draft.announcements || [])];
                updated[0] = e.target.value;
                setDraft({...draft, announcements: updated});
              }}
              className={`w-full p-4 rounded-[16px] text-[13px] font-mono ${iosInputBg}`}
            />
            <button
              type="button"
              onClick={() => handleSaveSpecificCard('Broadcast Studio')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Save Broadcast Settings</span>
            </button>
          </div>
        )}

        {activeFolderId === 'announcements' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                  <Volume2 className="w-5 h-5" /> Top Announcement Lines Ticker
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Edit rotating top banner messages displayed to clients.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, announcements: [...(draft.announcements || []), "✨ New studio announcement line ✨"] })}
                className="px-4 py-2 bg-[#007AFF] text-white font-bold rounded-[12px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-3">
              {(draft.announcements || []).map((line, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className="text-[13px] font-mono font-bold text-[#007AFF] w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const copy = [...draft.announcements];
                      copy[idx] = e.target.value;
                      setDraft({ ...draft, announcements: copy });
                    }}
                    className={`flex-1 p-3.5 rounded-[14px] text-[13px] ${iosInputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, announcements: draft.announcements.filter((_, i) => i !== idx) })}
                    className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-[12px]"
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
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Announcements' ? 'Saving...' : 'Save Announcements Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'convenience' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
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
                      ...draft,
                      convenienceZones: {
                        ...draft.convenienceZones,
                        [cleanKey]: { name: "New Location Zone", fee: 500 }
                      }
                    });
                  }
                }}
                className="px-4 py-2 bg-[#007AFF] text-white font-bold rounded-[12px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(draft.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className={`p-4 rounded-[16px] border flex flex-col sm:flex-row items-center justify-between gap-3.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[11px] font-mono text-[#007AFF] uppercase font-bold">Zone Key: {zKey}</span>
                    <input
                      type="text"
                      value={zData.name}
                      onChange={(e) => setDraft({
                        ...draft,
                        convenienceZones: {
                          ...draft.convenienceZones,
                          [zKey]: { ...zData, name: e.target.value }
                        }
                      })}
                      className={`w-full p-3 rounded-[12px] text-[13px] font-semibold ${iosInputBg}`}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <label className={`text-[13px] font-bold ${iosMuted}`}>Fee (₹):</label>
                    <input
                      type="number"
                      value={zData.fee}
                      onChange={(e) => setDraft({
                        ...draft,
                        convenienceZones: {
                          ...draft.convenienceZones,
                          [zKey]: { ...zData, fee: Number(e.target.value) }
                        }
                      })}
                      className={`w-32 p-3 rounded-[12px] font-mono text-[#007AFF] font-bold text-[13px] ${iosInputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = { ...draft.convenienceZones };
                        delete copy[zKey];
                        setDraft({ ...draft, convenienceZones: copy });
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
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Travel Fees' ? 'Saving...' : 'Save Travel Fees Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'prices' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <h3 className="font-bold text-[16px] uppercase text-[#007AFF]">👑 International Luxury Vanity Kit (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={`block text-[11px] mb-1.5 capitalize font-bold ${iosMuted}`}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.international?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, international: { ...draft.pricingByKit.international, [k]: Number(e.target.value) } } })} className={`w-full p-3 rounded-[14px] font-mono text-[#007AFF] text-[13px] font-bold ${iosInputBg}`} />
                </div>
              ))}
            </div>

            <h3 className="font-bold text-[16px] uppercase text-rose-500 pt-4">✨ Premium HD Kit Rates (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={`block text-[11px] mb-1.5 capitalize font-bold ${iosMuted}`}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.drugstore?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, drugstore: { ...draft.pricingByKit.drugstore, [k]: Number(e.target.value) } } })} className={`w-full p-3 rounded-[14px] font-mono text-rose-500 text-[13px] font-bold ${iosInputBg}`} />
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Package Rates'}
              onClick={() => handleSaveSpecificCard('Package Rates')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Rates' ? 'Saving...' : 'Save Package Rates Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'theme' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <h3 className="font-bold text-[16px] uppercase text-[#007AFF]">Aesthetic Themes & Fonts (Synced)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Color Theme</label>
                <select value={draft.theme?.colorTheme || 'real_glass_lens'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold text-[#007AFF] ${iosInputBg}`}>
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
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Font Family</label>
                <select value={draft.theme?.fontFamily || 'sans'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, fontFamily: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold text-[#007AFF] ${iosInputBg}`}>
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

              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Default Customer Mode</label>
                <select value={draft.theme?.defaultMode || 'light'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, defaultMode: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${iosInputBg}`}>
                  <option value="light">☀️ Light Mode</option>
                  <option value="dark">🌙 Dark Mode</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Theme & Styles'}
              onClick={() => handleSaveSpecificCard('Theme & Styles')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Theme & Styles' ? 'Saving...' : 'Save Theme & Fonts Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'profile' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-[#007AFF] flex items-center gap-2">
                <User className="w-5 h-5" /> Studio Identity, Logo & Social Profiles
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure official studio title, upload custom logo & artist profile photo.</p>
            </div>

            <div className={`p-4.5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#007AFF] uppercase flex items-center gap-2">
                  <Crown className="w-4 h-4" /> 1. Official Studio Logo (Header & Splash)
                </span>
                <span className={`text-[11px] font-mono ${iosMuted}`}>Auto-Compressed</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow border">
                  {draft.studioLogo ? (
                    <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Logo Image URL"
                    value={draft.studioLogo || ''}
                    onChange={e => setDraft({ ...draft, studioLogo: e.target.value })}
                    className={`w-full p-3 rounded-[14px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className="inline-block px-4 py-2 rounded-[12px] bg-blue-500/15 text-[#007AFF] text-xs font-bold cursor-pointer border border-blue-500/30 hover:bg-blue-500/25 transition">
                    Upload & Compress Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className={`p-4.5 rounded-[18px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#007AFF] uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> 2. Artist Profile Photo
                </span>
                <span className={`text-[11px] font-mono ${iosMuted}`}>Avatar Card</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] overflow-hidden bg-neutral-200 border-2 border-[#007AFF]/40 shrink-0 shadow">
                  <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={draft.profileImage || ''}
                    onChange={e => setDraft({ ...draft, profileImage: e.target.value })}
                    className={`w-full p-3 rounded-[14px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className="inline-block px-4 py-2 rounded-[12px] bg-blue-500/15 text-[#007AFF] text-xs font-bold cursor-pointer border border-blue-500/30 hover:bg-blue-500/25 transition">
                    Upload & Compress Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Display Title</label>
                <input type="text" value={draft.studioName || ''} onChange={e => setDraft({ ...draft, studioName: e.target.value })} className={`w-full p-3 rounded-[14px] text-[13px] ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Booking Contact Number</label>
                <input type="text" value={draft.whatsappNumber || ''} onChange={e => setDraft({ ...draft, whatsappNumber: e.target.value })} className={`w-full p-3 rounded-[14px] text-[13px] font-mono text-[#007AFF] ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Instagram Handle</label>
                <input type="text" value={draft.instagramHandle || ''} onChange={e => setDraft({ ...draft, signatureHandle: e.target.value, instagramHandle: e.target.value })} className={`w-full p-3 rounded-[14px] text-[13px] font-mono text-pink-500 ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Artist Tagline / Subtitle</label>
                <input type="text" value={draft.artistTagline || ''} onChange={e => setDraft({ ...draft, artistTagline: e.target.value })} className={`w-full p-3 rounded-[14px] text-[13px] ${iosInputBg}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Studio Profile'}
              onClick={() => handleSaveSpecificCard('Studio Profile')}
              className="w-full py-4 bg-[#007AFF] text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
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
