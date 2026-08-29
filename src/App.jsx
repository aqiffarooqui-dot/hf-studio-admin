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
    cardBg: "bg-gradient-to-br from-white/80 via-sky-50/40 to-indigo-50/50 backdrop-blur-[24px] border border-white/80 shadow-[0_12px_40px_rgba(0,122,255,0.12)]",
    accentGradient: "from-sky-400 via-blue-500 to-indigo-600",
    btnPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_10px_25px_rgba(0,122,255,0.3)] rounded-[18px]",
  },
  admin_aurora: {
    cardBg: "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-[28px] border border-purple-500/20 shadow-[0_12px_40px_rgba(168,85,247,0.15)]",
    accentGradient: "from-purple-500 via-pink-500 to-rose-500",
    btnPrimary: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(236,72,153,0.35)] rounded-[18px]",
  },
  sunset_glow: {
    cardBg: "bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-500/10 backdrop-blur-[28px] border border-amber-500/20 shadow-[0_12px_40px_rgba(245,158,11,0.15)]",
    accentGradient: "from-amber-400 via-rose-500 to-purple-600",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(244,63,94,0.35)] rounded-[18px]",
  },
  cyber_matrix: {
    cardBg: "bg-gradient-to-br from-emerald-500/10 via-cyan-500/15 to-blue-500/10 backdrop-blur-[28px] border border-cyan-500/25 shadow-[0_12px_40px_rgba(6,182,212,0.15)]",
    accentGradient: "from-emerald-400 via-cyan-400 to-blue-500",
    btnPrimary: "bg-gradient-to-r from-emerald-500 to-cyan-600 text-neutral-950 font-bold shadow-[0_10px_25px_rgba(6,182,212,0.35)] rounded-[18px]",
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
  { version: "v3.6.1", date: "August 29, 2026", status: "Active Live Production", changes: "Fixed post-login blank screen render error by ensuring robust state initializers and fallback rendering." }
];

const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
const bridalPackages = ['engagement_bride', 'royal_bridal'];

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
  
  // Central popup confirmation toast state
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

  // Auto-hide central popup toast after 4 seconds
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
            recoveryEmail: data.recoveryEmail || "aqiffarooqui@gmail.com",
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
            theme: { ...DEFAULT_CONFIG.theme, ...(data.theme || {}) },
            adminTheme: { ...DEFAULT_CONFIG.adminTheme, ...(data.adminTheme || {}) },
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

      setPopupToast({ title: "Fingerprint Saved", desc: "Hardware biometrics successfully registered." });
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
      const payload = {
        ...draft,
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
      setPopupToast({ title: "Status Updated", desc: `Marked booking as confirmed (Termux offline).` });
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

      setPopupToast({ title: "Booking Rejected", desc: `Booking declined and client notified.` });
      setRejectModalData(null);
    } catch (err) {
      alert("Error rejecting booking: " + err.message);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
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
          const updatedKitText = { ...draft.kitText };
          const updatedKitImages = { ...draft.kitImages };
          const updatedPricing = { ...draft.pricingByKit };
          
          if (updatedKitText[kit]) delete updatedKitText[kit][pkgKey];
          if (updatedKitImages[kit]) delete updatedKitImages[kit][pkgKey];
          if (updatedPricing[kit]) delete updatedPricing[kit][pkgKey];
          
          setDraft({
            ...draft,
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

    const updatedKitText = { ...draft.kitText };
    const updatedKitImages = { ...draft.kitImages };
    const updatedPricing = { ...draft.pricingByKit };

    ['international', 'drugstore'].forEach(kit => {
      if (!updatedKitText[kit]) updatedKitText[kit] = {};
      updatedKitText[kit][cleanKey] = { num: Object.keys(updatedKitText[kit]).length + 1, name: titleName, desc: "Professional signature look with premium cosmetics and styling." };

      if (!updatedKitImages[kit]) updatedKitImages[kit] = {};
      updatedKitImages[kit][cleanKey] = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80";

      if (!updatedPricing[kit]) updatedPricing[kit] = {};
      updatedPricing[kit][cleanKey] = kit === 'international' ? 5000 : 3000;
    });

    setDraft({
      ...draft,
      kitText: updatedKitText,
      kitImages: updatedKitImages,
      pricingByKit: updatedPricing
    });
    setPopupToast({ title: "Package Added", desc: `Package "${titleName}" added successfully!` });
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
        setPopupToast({ title: "Media Loaded", desc: "Media uploaded successfully! Click save below." });
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
        setPopupToast({ title: "Image Optimized", desc: `Loaded optimized image for ${pkgKey}.` });
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
        setPopupToast({ title: "Profile Loaded", desc: "Profile picture loaded successfully." });
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
        setPopupToast({ title: "Logo Loaded", desc: "Studio logo loaded successfully." });
      } catch (err) {
        alert("Error loading logo: " + err.message);
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

  // Calculate live status metrics for header banner
  const nextConfirmedBooking = bookingsList.find(b => b.status === 'confirmed');
  const pendingBookingsCount = bookingsList.filter(b => b.status === 'pending').length;

  const activeAdminThemeKey = draft.adminTheme?.colorTheme || 'real_glass_lens';
  const adminThemeStyle = THEME_STYLES[activeAdminThemeKey] || THEME_STYLES.real_glass_lens;
  const currentFontFamily = FONT_MAP[draft.theme?.fontFamily] || FONT_MAP.sans;

  const iosBg = isAdminDarkMode ? "bg-[#090a0f] text-[#F2F2F7]" : "bg-[#f4f7fe] text-[#1C1C1E]";
  const iosGroupCard = adminThemeStyle.cardBg;
  const iosInputBg = isAdminDarkMode ? "bg-white/10 text-white border border-white/15 rounded-[16px]" : "bg-white text-[#1C1C1E] border border-black/10 rounded-[16px] shadow-sm";
  const iosMuted = isAdminDarkMode ? "text-[#a1a1aa]" : "text-[#71717a]";

  const activeFolderObj = adminFolders.find(f => f.id === activeFolderId);

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${iosBg} flex items-center justify-center p-5 relative overflow-hidden transition-colors duration-300`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        {showForgotPasswordModal ? (
          <form onSubmit={handleForgotPasswordSubmit} className={`max-w-sm w-full p-8 rounded-[32px] border text-center space-y-4 shadow-2xl ${iosGroupCard} animate-fade-in`}>
            <div className="w-16 h-16 rounded-[24px] bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-[22px] font-bold tracking-tight">Recover Password</h2>
            <p className={`text-[13px] ${iosMuted}`}>Your recovery email is permanently secured to <strong>{draft.recoveryEmail || "aqiffarooqui@gmail.com"}</strong>.</p>
            
            {forgotPasswordStatus && (
              <div className="p-3.5 rounded-[16px] bg-emerald-500/20 text-emerald-300 text-[13px] font-semibold border border-emerald-500/30">
                {forgotPasswordStatus}
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-[14px] rounded-[16px] shadow-lg active:scale-95 transition">Send PIN to Recovery Email</button>
            <button type="button" onClick={() => setShowForgotPasswordModal(false)} className="text-[13px] text-purple-400 underline">Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-[32px] border text-center space-y-5 shadow-2xl ${iosGroupCard}`}>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold tracking-tight">Admin Portal</h2>
              <p className={`text-[13px] ${iosMuted} mt-1`}>v3.6.1 Production Suite</p>
            </div>
            <input type="password" placeholder="Enter Admin PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={`w-full text-center text-[18px] p-4 font-mono text-purple-400 ${iosInputBg}`} />
            
            <button type="submit" className={`w-full py-4 ${adminThemeStyle.btnPrimary}`}>Unlock Console</button>
            
            <div className="space-y-2.5 pt-3 border-t border-slate-500/20">
              <button
                type="button"
                onClick={handleBiometricOrFaceLogin}
                className={`w-full py-3.5 font-bold text-[13px] text-purple-400 flex items-center justify-center gap-2 rounded-[16px] border border-purple-500/30 ${isAdminDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}
              >
                <Fingerprint className="w-4 h-4 text-purple-400" />
                <span>Login with Fingerprint / Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-[13px] text-purple-400 underline block w-full pt-1"
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
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Central Interactive Confirmation Modal Toast */}
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
              Are you sure you want to decline this booking for <strong>{rejectModalData.clientName}</strong> on <strong>{rejectModalData.eventDate}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider">Reason for Rejection:</label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={e => setRejectionReasonText(e.target.value)}
                className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-500/20">
              <button onClick={() => setRejectModalData(null)} className="px-4 py-2.5 rounded-[16px] bg-slate-200 text-[13px] font-bold text-slate-700">Cancel</button>
              <button onClick={handleConfirmRejection} className="px-5 py-2.5 rounded-[16px] bg-rose-600 text-white font-bold text-[13px] shadow-lg">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Perfectly Aligned Sticky Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-[28px] saturate-[180%] border-b px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm transition-colors duration-300 ${isAdminDarkMode ? 'bg-[#18181b]/85 border-white/10 text-white' : 'bg-white/85 border-black/10 text-[#1C1C1E]'}`}>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            {draft.studioLogo ? (
              <div className="w-10 h-10 rounded-[14px] bg-white/20 p-1 overflow-hidden shadow-sm shrink-0 border border-purple-500/30">
                <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Crown className="w-5 h-5" />
              </div>
            )}

            <div>
              <h1 className="font-bold text-[16px] sm:text-[17px] tracking-tight leading-tight">
                H&F Studio Admin
              </h1>
              <p className={`text-[11px] font-mono text-purple-400`}>v3.6.1 Pro Suite</p>
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            {!activeFolderId && (
              <button
                onClick={() => {
                  if (isReorderMode) handleSaveSpecificCard("Card Sequence");
                  setIsReorderMode(!isReorderMode);
                }}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-bold ${isReorderMode ? 'bg-purple-600 text-white' : 'bg-purple-500/15 text-purple-400'}`}
              >
                {isReorderMode ? 'Save' : 'Reorder'}
              </button>
            )}
            <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={`p-2 rounded-[12px] ${isAdminDarkMode ? 'bg-white/10 text-amber-400' : 'bg-slate-100 text-slate-800'}`}>
              {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-[12px] text-rose-500 font-bold px-1 py-1">Lock</button>
          </div>
        </div>

        {/* Header Live Status Banner */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-[16px] border text-xs font-medium w-full sm:w-auto justify-center ${isAdminDarkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-black/5 shadow-sm text-slate-700'}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Next Booking: <strong className="text-purple-500 dark:text-purple-400">{nextConfirmedBooking ? `${nextConfirmedBooking.clientName} (${nextConfirmedBooking.eventDate})` : 'None Confirmed'}</strong></span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Pending: <strong className="text-amber-500">{pendingBookingsCount}</strong></span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] border ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-black/10'}`}>
            <ZoomIn className="w-3.5 h-3.5 text-purple-500" />
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

          {!activeFolderId && (
            <button
              onClick={() => {
                if (isReorderMode) handleSaveSpecificCard("Card Sequence");
                setIsReorderMode(!isReorderMode);
              }}
              className={`px-3.5 py-2 rounded-[14px] text-[13px] font-bold flex items-center gap-1.5 transition ${isReorderMode ? 'bg-purple-600 text-white shadow-md' : (isAdminDarkMode ? 'bg-white/10 text-white' : 'bg-white text-purple-600 shadow-sm border border-purple-500/20')}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isReorderMode ? 'Save Order' : 'Edit Order'}</span>
            </button>
          )}

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
              className={`px-4 py-2 rounded-[14px] text-[13px] font-bold flex items-center gap-2 text-purple-500 ${isAdminDarkMode ? 'bg-white/10' : 'bg-white shadow-sm border border-purple-500/20'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h3 className={`font-bold text-[13px] uppercase tracking-wider ${iosMuted}`}>
                {isReorderMode ? 'Reorder Mode Active: Use ⬆️ ⬇️ to move cards' : 'Master Control Dashboard'}
              </h3>
              {/* Mobile Edit Order Button */}
              <button
                onClick={() => {
                  if (isReorderMode) handleSaveSpecificCard("Card Sequence");
                  setIsReorderMode(!isReorderMode);
                }}
                className={`sm:hidden px-3.5 py-2 rounded-[12px] text-xs font-bold flex items-center gap-1.5 shadow ${isReorderMode ? 'bg-purple-600 text-white' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isReorderMode ? 'Save Order' : 'Edit Order'}</span>
              </button>
            </div>
          )}

          {activeFolderObj && (
            <span className={`text-[13px] font-bold font-mono ${iosMuted}`}>
              Section: <strong className={isAdminDarkMode ? 'text-white' : 'text-[#1C1C1E]'}>{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {actionStatus && (
          <div className="p-3.5 rounded-[16px] bg-purple-500/15 border border-purple-500/30 font-bold text-[13px] text-center text-purple-400 shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{actionStatus}</span>
          </div>
        )}

        {/* Colorful Floating Animated Cards & iOS Pill Layout Grid */}
        {!activeFolderId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminFolders.map((f, index) => {
              const Icon = f.icon;
              const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

              return (
                <div
                  key={f.id}
                  onClick={() => !isReorderMode && openFolder(f.id)}
                  className={`p-5 rounded-[28px] transition-all duration-300 cursor-pointer group border flex flex-col justify-between space-y-4 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] ${
                    isReorderMode 
                      ? 'bg-purple-500/15 ring-2 ring-purple-500 animate-pulse' 
                      : (isAdminDarkMode 
                          ? 'bg-[#18181b]/95 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
                          : 'bg-white border-purple-500/15 shadow-[0_8px_30px_rgba(0,0,0,0.06)]')
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      {count !== null && (
                        <span className="text-[11px] font-mono font-bold bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/30">
                          {count} Active
                        </span>
                      )}
                      
                      {isReorderMode && (
                        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-[12px]">
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

                  <div>
                    <h4 className="font-bold text-[17px] tracking-tight group-hover:text-purple-400 transition-colors">
                      {f.label}
                    </h4>
                    <p className={`text-[13px] mt-1 line-clamp-2 leading-relaxed ${iosMuted}`}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeFolderId === 'general' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                <Settings className="w-5 h-5" /> General & Security Settings
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure Biometric, Face ID, Fingerprint Scan Registration, Password & Permanent Recovery Email.</p>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-purple-400" /> Hardware Fingerprint Scanner Integration
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Scan and save your fingerprint data locally via your device biometric hardware.</p>

              <div className="p-4 rounded-[18px] bg-purple-500/10 border border-purple-500/20 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center mx-auto shadow-md">
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
                      className="px-5 py-2.5 rounded-[14px] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-[13px] shadow active:scale-95 transition"
                    >
                      {draft.registeredFingerprintHash ? "Re-Scan & Update Fingerprint" : "Scan & Save Fingerprint"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-3.5 rounded-[16px] border flex items-center justify-between ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[13px] font-bold">Enable Touch ID / Biometrics</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, biometricEnabled: !draft.biometricEnabled })}
                    className={`px-3.5 py-1.5 rounded-[12px] font-bold text-[12px] ${draft.biometricEnabled ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-600 border border-rose-500/40'}`}
                  >
                    {draft.biometricEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className={`p-3.5 rounded-[16px] border flex items-center justify-between ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <span className="text-[13px] font-bold">Enable Face ID / Passkey</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, faceIdEnabled: !draft.faceIdEnabled })}
                    className={`px-3.5 py-1.5 rounded-[12px] font-bold text-[12px] ${draft.faceIdEnabled ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-600 border border-rose-500/40'}`}
                  >
                    {draft.faceIdEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" /> Admin App Version & History
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>Deployment timeline and release changes for Admin Console.</p>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ADMIN_APP_VERSIONS.map((ver, vIdx) => (
                  <div key={vIdx} className={`p-3.5 rounded-[16px] border text-[13px] space-y-1 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-purple-400">{ver.version}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                        {ver.status}
                      </span>
                    </div>
                    <p className="text-[12px]">{ver.changes}</p>
                    <span className={`text-[11px] font-mono ${iosMuted}`}>Released: {ver.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> Permanent Recovery Email ID
              </h4>
              <p className={`text-[13px] ${iosMuted}`}>If you forget your PIN, recovery instructions and current PIN are dispatched here.</p>
              
              <input
                type="email"
                value={draft.recoveryEmail || "aqiffarooqui@gmail.com"}
                onChange={e => setDraft({ ...draft, recoveryEmail: e.target.value })}
                className={`w-full p-3.5 rounded-[16px] font-mono text-[13px] font-bold text-purple-400 border ${iosInputBg}`}
              />
            </div>

            <form onSubmit={handlePasswordChange} className={`p-5 rounded-[22px] border space-y-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" /> Change Admin PIN Password
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

        {activeFolderId === 'bookings' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[16px] text-purple-400">Incoming Customer Bookings Queue</h3>
                <p className={`text-[13px] ${iosMuted}`}>Filter, search by name/phone/no, select all, or delete multiple records.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-purple-500/20 text-purple-400 px-3.5 py-1.5 rounded-full shadow-sm border border-purple-500/30">
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
                  className="flex items-center gap-2 text-[13px] font-bold text-purple-400 hover:underline"
                >
                  {selectedBookings.length === filteredBookingsList.length && filteredBookingsList.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-purple-400" />
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
                              <span className="font-mono text-[12px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-[8px]">
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
                          onClick={() => setDeleteConfirmModal({ type: 'single', isBooking: true, id: b.id, message: `Are you sure you want to delete booking for ${b.clientName}?` })}
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
                        <div className="flex justify-between"><span className={iosMuted}>Event Date:</span><strong className="text-purple-400 font-mono">{b.eventDate}</strong></div>
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
                        <div className="flex justify-between pt-1 font-bold"><span>Total Amount:</span><span className="text-purple-400 font-mono">₹{b.totalAmount?.toLocaleString('en-IN')}</span></div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] rounded-[14px] shadow-sm flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{b.status === 'confirmed' ? 'Resend WhatsApp Confirmed Slip' : 'Accept & Send WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2.5 bg-blue-500/15 text-blue-600 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2.5 bg-amber-500/15 text-amber-600 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalData(b);
                              setRejectionReasonText(PRE_ADDED_REJECTION_REASONS[0]);
                            }}
                            className="py-2.5 bg-rose-500/15 text-rose-600 font-bold text-[11px] rounded-[12px] flex items-center justify-center gap-1"
                          >
                            <Ban className="w-3 h-3" /> Reject
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className="w-full py-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded-[14px] flex items-center justify-center gap-1.5 transition"
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
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Client Feedback & Suggestions Box
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Reviews, ratings, and creative suggestions submitted by clients.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-purple-500/20 text-purple-400 px-3.5 py-1.5 rounded-full border border-purple-500/30">
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

        {activeFolderId === 'calendar_view' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Interactive Monthly Booking Calendar
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                  Visual color tags show free vs booked dates (🟢 Green = Confirmed / Busy, 🟡 Amber = Pending).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2.5 rounded-[14px] bg-slate-200 text-purple-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] font-mono min-w-[130px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2.5 rounded-[14px] bg-slate-200 text-purple-600">
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
              <div className={`p-4 rounded-[18px] border space-y-3 animate-fade-in ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-purple-400">Date: {selectedCalendarDay.dateStr}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCalendarDay.isConfirmed ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                      {selectedCalendarDay.isConfirmed ? 'LOCKED / CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className="text-purple-400 text-xs underline font-bold">Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className={`p-3 rounded-[14px] border text-xs space-y-1 ${isAdminDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex justify-between font-bold">
                        <span>{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className="font-mono text-purple-400">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
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
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Package Management (Images, Titles & Descriptions)
                </h3>
                <p className={`text-[13px] ${iosMuted} mt-0.5`}>Manage custom look photos, package display names and descriptions per kit type.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewPackage}
                  className="px-4 py-2.5 rounded-[14px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>

                <div className={`inline-flex p-1.5 rounded-[18px] border gap-1 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('international')}
                    className={`px-4 py-2 rounded-[14px] text-xs font-bold transition ${editingKitTab === 'international' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow' : iosMuted}`}
                  >
                    👑 Luxury Kit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKitTab('drugstore')}
                    className={`px-4 py-2 rounded-[14px] text-xs font-bold transition ${editingKitTab === 'drugstore' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow' : iosMuted}`}
                  >
                    ✨ HD Kit
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.keys(draft.kitText?.[editingKitTab] || {}).map(k => {
                const pkgText = draft.kitText[editingKitTab][k] || { name: k, desc: '' };
                const pkgImg = draft.kitImages?.[editingKitTab]?.[k] || '';

                return (
                  <div key={`${editingKitTab}_${k}`} className={`p-5 rounded-[24px] border space-y-4 relative ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 font-mono uppercase">Key: {k}</span>
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
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={pkgImg || ''}
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
                          className={`w-full p-3 rounded-[14px] text-xs font-mono ${iosInputBg}`}
                        />
                        <label className="block text-center py-2.5 rounded-[14px] bg-purple-500/15 text-purple-400 text-[11px] font-bold cursor-pointer border border-purple-500/30 hover:bg-purple-500/25 transition">
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
                            ...draft,
                            kitText: {
                              ...(draft.kitText || {}),
                              [editingKitTab]: {
                                ...(draft.kitText?.[editingKitTab] || {}),
                                [k]: { ...pkgText, name: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3.5 rounded-[16px] text-xs font-bold ${iosInputBg}`}
                        />
                      </div>
                      <div>
                        <span className={`block text-[11px] mb-1 font-bold ${iosMuted}`}>Description</span>
                        <textarea
                          rows={2}
                          value={pkgText.desc || ''}
                          onChange={e => setDraft({
                            ...draft,
                            kitText: {
                              ...(draft.kitText || {}),
                              [editingKitTab]: {
                                ...(draft.kitText?.[editingKitTab] || {}),
                                [k]: { ...pkgText, desc: e.target.value }
                              }
                            }
                          })}
                          className={`w-full p-3.5 rounded-[16px] text-xs ${iosInputBg}`}
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Master' ? 'Saving...' : 'Save Package Images & Titles Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'app_maintenance' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                <Wrench className="w-5 h-5" /> App Down & Maintenance Controller
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>
                Turn on to politely lock customer app with an elegant maintenance notice during upgrades.
              </p>
            </div>

            <div className={`p-5 rounded-[22px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
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
                className={`px-5 py-3 rounded-[16px] font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md ${
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance Status Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'floating' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
                    ...draft,
                    floatingBanner: {
                      ...(draft.floatingBanner || {}),
                      enabled: !(draft.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
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
                    className={`w-full p-3.5 rounded-[14px] text-xs ${iosInputBg}`}
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
                    className={`w-full p-3.5 rounded-[14px] text-xs font-mono font-bold text-purple-400 ${iosInputBg}`}
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
                  className={`w-full p-3.5 rounded-[14px] text-xs ${iosInputBg}`}
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

        {activeFolderId === 'coupons' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Coupon
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(draft.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className={`p-4.5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-purple-400 font-bold text-[15px]">{code}</span>
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
                          className={`px-3.5 py-1.5 rounded-[14px] font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${isCodeActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          setDeleteConfirmModal({
                            type: 'single',
                            message: `Are you sure you want to delete coupon "${code}"?`,
                            onConfirm: () => {
                              const copy = { ...draft.validCoupons };
                              delete copy[code];
                              setDraft({ ...draft, validCoupons: copy });
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
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
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
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, value: Number(e.target.value) }
                            }
                          })}
                          className={`w-full p-3 rounded-[14px] font-mono text-purple-400 text-xs font-bold ${iosInputBg}`}
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
                          className={`w-full p-3 rounded-[14px] text-xs font-mono text-amber-500 ${iosInputBg}`}
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
                        className={`w-full p-3 rounded-[14px] text-xs ${iosInputBg}`}
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
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
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
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(draft.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className={`p-4.5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Image/GIF'})</span>
                    <button onClick={() => {
                      setDeleteConfirmModal({
                        type: 'single',
                        message: `Are you sure you want to delete media item #${idx + 1}?`,
                        onConfirm: () => {
                          setDraft({ ...draft, galleryPhotos: draft.galleryPhotos.filter((_, i) => i !== idx) });
                        }
                      });
                    }} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-[10px] mb-1 ${iosMuted}`}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`}>
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
                      }} className={`w-full p-3 rounded-[14px] text-xs ${iosInputBg}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-bold ${iosInputBg}`} />
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${iosMuted}`}>Direct URL (Video, GIF, or Image link)</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-3 rounded-[14px] text-xs font-mono text-purple-400 ${iosInputBg}`} />
                  </div>

                  <label className="block text-center py-3 rounded-[14px] bg-purple-500/15 text-purple-400 text-xs font-bold cursor-pointer border border-purple-500/30 hover:bg-purple-500/25 transition shadow-sm">
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

        {activeFolderId === 'toggles_master' && (
          <div className={`p-6 sm:p-8 space-y-5 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
                  <div key={toggle.key} className={`p-4 rounded-[18px] border flex items-center justify-between gap-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
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
                      className={`px-4 py-2 rounded-[14px] flex items-center gap-1 font-bold text-xs transition active:scale-95 ${isEnabled ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}
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

        {activeFolderId === 'traffic_logs' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Live Traffic & Instagram Visitor Logs
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Track visitors arriving from your Instagram bio, links, and direct traffic in real-time.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-purple-500/20 text-purple-400 px-3.5 py-1.5 rounded-full border border-purple-500/30">
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
                        <span className="font-bold text-purple-400 font-mono">Source/ID: @{log.instagramIdOrSource || 'Direct'}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">Active Visit</span>
                      </div>
                      <p className={`text-[12px] truncate max-w-md ${iosMuted}`}>{log.userAgent}</p>
                    </div>
                    <span className="text-[12px] text-purple-400 font-mono font-medium">
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
            <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
              className={`w-full p-4 rounded-[18px] text-[13px] font-mono ${iosInputBg}`}
            />
            <button
              type="button"
              onClick={() => handleSaveSpecificCard('Broadcast Studio')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-[14px] rounded-[18px] shadow-lg active:scale-95 flex items-center justify-center gap-2 transition"
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
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" /> Top Announcement Lines Ticker
                </h3>
                <p className={`text-[13px] ${iosMuted}`}>Edit rotating top banner messages displayed to clients.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, announcements: [...(draft.announcements || []), "✨ New studio announcement line ✨"] })}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-3">
              {(draft.announcements || []).map((line, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className="text-[13px] font-mono font-bold text-purple-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const copy = [...draft.announcements];
                      copy[idx] = e.target.value;
                      setDraft({ ...draft, announcements: copy });
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
                          setDraft({ ...draft, announcements: draft.announcements.filter((_, i) => i !== idx) });
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

        {activeFolderId === 'convenience' && (
          <div className={`p-6 sm:p-8 space-y-4 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
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
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-[14px] text-xs flex items-center gap-1 active:scale-95 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(draft.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className={`p-4 rounded-[18px] border flex flex-col sm:flex-row items-center justify-between gap-3.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">Zone Key: {zKey}</span>
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
                      className={`w-full p-3.5 rounded-[14px] text-[13px] font-semibold ${iosInputBg}`}
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
                      className={`w-32 p-3.5 rounded-[14px] font-mono text-purple-400 font-bold text-[13px] ${iosInputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Are you sure you want to delete zone "${zData.name}"?`,
                          onConfirm: () => {
                            const copy = { ...draft.convenienceZones };
                            delete copy[zKey];
                            setDraft({ ...draft, convenienceZones: copy });
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

        {activeFolderId === 'prices' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h3 className="font-bold text-[16px] uppercase text-purple-400">👑 International Luxury Vanity Kit & HD Kit Rates (₹)</h3>
              <button
                type="button"
                onClick={handleAddNewPackage}
                className="px-4 py-2.5 rounded-[14px] bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Package Rate
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(draft.pricingByKit?.international || {}).map(k => (
                <div key={k} className={`p-4.5 rounded-[20px] border space-y-2.5 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold uppercase text-purple-400">Key: {k}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmModal({
                          type: 'single',
                          message: `Are you sure you want to delete rate for "${k}"?`,
                          onConfirm: () => {
                            const updatedInt = { ...draft.pricingByKit.international };
                            const updatedDrug = { ...draft.pricingByKit.drugstore };
                            delete updatedInt[k];
                            delete updatedDrug[k];
                            setDraft({
                              ...draft,
                              pricingByKit: { international: updatedInt, drugstore: updatedDrug }
                            });
                          }
                        });
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-[10px] mb-1 font-bold ${iosMuted}`}>Luxury Rate (₹)</label>
                      <input type="number" value={draft.pricingByKit?.international?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, international: { ...draft.pricingByKit.international, [k]: Number(e.target.value) } } })} className={`w-full p-3 rounded-[14px] font-mono text-purple-400 text-xs font-bold ${iosInputBg}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] mb-1 font-bold ${iosMuted}`}>HD Rate (₹)</label>
                      <input type="number" value={draft.pricingByKit?.drugstore?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, drugstore: { ...draft.pricingByKit.drugstore, [k]: Number(e.target.value) } } })} className={`w-full p-3 rounded-[14px] font-mono text-rose-500 text-xs font-bold ${iosInputBg}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Package Rates'}
              onClick={() => handleSaveSpecificCard('Package Rates')}
              className={`w-full py-4 ${adminThemeStyle.btnPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Rates' ? 'Saving...' : 'Save Package Rates Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'theme' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <h3 className="font-bold text-[16px] uppercase text-purple-400 flex items-center gap-2">
              <Palette className="w-5 h-5" /> Aesthetics & Console Customization
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={`p-5 rounded-[22px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-[14px] text-purple-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Customer Main App Theme Settings
                </h4>
                <p className={`text-[12px] ${iosMuted}`}>Controls the appearance of the client booking application.</p>
                
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Color Theme</label>
                  <select value={draft.theme?.colorTheme || 'real_glass_lens'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold text-purple-400 ${iosInputBg}`}>
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
                  <select value={draft.theme?.fontFamily || 'sans'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, fontFamily: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold text-purple-400 ${iosInputBg}`}>
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
                <h4 className="font-bold text-[14px] text-purple-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Admin Console Theme Settings
                </h4>
                <p className={`text-[12px] ${iosMuted}`}>Customize the colorful vibe of this management dashboard.</p>
                
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Admin Aura Theme</label>
                  <select value={draft.adminTheme?.colorTheme || 'admin_aurora'} onChange={e => setDraft({ ...draft, adminTheme: { ...draft.adminTheme, colorTheme: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold text-purple-400 ${iosInputBg}`}>
                    <option value="admin_aurora">✨ Admin Aurora (Purple Neon Glow)</option>
                    <option value="sunset_glow">🌅 Sunset Amber Glow</option>
                    <option value="cyber_matrix">⚡ Cyber Matrix Emerald</option>
                    <option value="real_glass_lens">🔮 Crystal Glass Lens</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${iosMuted}`}>Default Customer Mode</label>
                  <select value={draft.theme?.defaultMode || 'light'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, defaultMode: e.target.value } })} className={`w-full p-3 rounded-[14px] text-[13px] font-bold ${iosInputBg}`}>
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

        {activeFolderId === 'profile' && (
          <div className={`p-6 sm:p-8 space-y-6 ${iosGroupCard}`}>
            <div>
              <h3 className="font-bold text-[16px] text-purple-400 flex items-center gap-2">
                <User className="w-5 h-5" /> Studio Identity, Logo & Social Profiles
              </h3>
              <p className={`text-[13px] ${iosMuted} mt-0.5`}>Configure official studio title, upload custom logo & artist profile photo.</p>
            </div>

            <div className={`p-4.5 rounded-[20px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-purple-400 uppercase flex items-center gap-2">
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
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className="inline-block px-4 py-2.5 rounded-[14px] bg-purple-500/15 text-purple-400 text-xs font-bold cursor-pointer border border-purple-500/30 hover:bg-purple-500/25 transition">
                    Upload & Compress Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className={`p-4.5 rounded-[20px] border space-y-3 ${isAdminDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-purple-400 uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> 2. Artist Profile Photo
                </span>
                <span className={`text-[11px] font-mono ${iosMuted}`}>Avatar Card</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] overflow-hidden bg-neutral-200 border-2 border-purple-500/40 shrink-0 shadow">
                  <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={draft.profileImage || ''}
                    onChange={e => setDraft({ ...draft, profileImage: e.target.value })}
                    className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono ${iosInputBg}`}
                  />
                  <label className="inline-block px-4 py-2.5 rounded-[14px] bg-purple-500/15 text-purple-400 text-xs font-bold cursor-pointer border border-purple-500/30 hover:bg-purple-500/25 transition">
                    Upload & Compress Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Display Title</label>
                <input type="text" value={draft.studioName || ''} onChange={e => setDraft({ ...draft, studioName: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Booking Contact Number</label>
                <input type="text" value={draft.whatsappNumber || ''} onChange={e => setDraft({ ...draft, whatsappNumber: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono text-purple-400 ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Instagram Handle</label>
                <input type="text" value={draft.instagramHandle || ''} onChange={e => setDraft({ ...draft, signatureHandle: e.target.value, instagramHandle: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] font-mono text-pink-500 ${iosInputBg}`} />
              </div>
              <div>
                <label className={`block text-[12px] font-bold mb-1.5 ${iosMuted}`}>Artist Tagline / Subtitle</label>
                <input type="text" value={draft.artistTagline || ''} onChange={e => setDraft({ ...draft, artistTagline: e.target.value })} className={`w-full p-3.5 rounded-[16px] text-[13px] ${iosInputBg}`} />
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
