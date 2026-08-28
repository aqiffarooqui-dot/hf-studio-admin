import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight, 
  Sliders, Palette, MapPin, Eye, ChevronDown, ChevronRight, ChevronLeft, 
  ListFilter, Car, Volume2, Activity, SlidersHorizontal, CheckCircle2, 
  XCircle, Clock, Gift, AlertCircle, Calendar, Download, FileCheck, 
  Hash, AlertTriangle, Wrench, X, MessageSquare, RotateCcw, Ban, 
  Folder, FolderOpen, ArrowLeft, Star
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig, db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';

const DEFAULT_CONFIG = {
  adminPin: "8760",
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
    colorTheme: "liquid_glass",
    defaultMode: "dark"
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
  liquid_glass: {
    accentGradient: "from-cyan-400 via-sky-300 to-indigo-400",
    btnPrimary: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-bold shadow-xl shadow-cyan-500/25 border border-white/40",
    accentText: "text-cyan-500 dark:text-cyan-400",
    accentBorder: "border-cyan-500/40 dark:border-cyan-400/30",
    glow: "shadow-cyan-500/30"
  },
  one_ui_9: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md shadow-amber-500/25 border border-amber-300/40",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/30",
    glow: "shadow-amber-500/20"
  },
  gold_rose: {
    accentGradient: "from-amber-400 via-rose-400 to-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-bold shadow-md",
    accentText: "text-rose-600 dark:text-rose-400",
    accentBorder: "border-rose-500/30",
    glow: "shadow-rose-500/20"
  },
  google_minimal: {
    accentGradient: "from-blue-500 via-teal-400 to-emerald-400",
    btnPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/30",
    glow: "shadow-blue-500/20"
  },
  champagne: {
    accentGradient: "from-amber-200 via-yellow-400 to-amber-500",
    btnPrimary: "bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow-lg shadow-amber-400/20",
    accentText: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-400/30",
    glow: "shadow-amber-400/20"
  },
  emerald: {
    accentGradient: "from-emerald-400 via-teal-300 to-emerald-500",
    btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20",
    accentText: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30",
    glow: "shadow-emerald-500/20"
  },
  violet: {
    accentGradient: "from-purple-400 via-pink-400 to-rose-400",
    btnPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/25",
    accentText: "text-purple-600 dark:text-purple-400",
    accentBorder: "border-purple-500/30",
    glow: "shadow-purple-500/20"
  }
};

const PRE_ADDED_REJECTION_REASONS = [
  "Thank you for reaching out! We are unfortunately already fully booked for this date. Please consider selecting another date.",
  "Our senior makeup artists are scheduled for another event on this requested date. We would love to accommodate you on an alternate date.",
  "Due to prior studio commitments in another city/location, we cannot take further appointments for this date.",
  "Your requested time slot is unavailable. Please visit our app and choose an alternative available date.",
  "We are currently experiencing peak seasonal bookings and this date has reached full capacity. We apologize for the inconvenience.",
  "Thank you for your interest! Unfortunately, we are not operational at the requested venue location on this date."
];

const DEFAULT_TEMPLATES = [
  { title: "Special Wedding Promo", text: "✨ Special Wedding Offer from H&F Makeup Artist! Use code BRIDE2026 for flat discount on your bridal look. Book now!" }
];

const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
const bridalPackages = ['engagement_bride', 'royal_bridal'];

const ADMIN_FOLDERS = [
  { id: 'bookings', label: 'Live Bookings Queue', icon: CalendarCheck, desc: 'Review, accept, hold, reject & generate slips', countKey: 'bookings' },
  { id: 'feedbacks', label: 'Client Feedback & Suggestions', icon: MessageSquare, desc: 'View client reviews, ratings & feedback', countKey: 'feedbacks' },
  { id: 'calendar_view', label: 'Availability Calendar', icon: Calendar, desc: 'Color-coded monthly schedule matrix' },
  { id: 'packages_master', label: 'Package Management (Images & Titles)', icon: Layers, desc: 'Manage package photos, names and descriptions per kit' },
  { id: 'gallery', label: 'Transformations & Media', icon: Film, desc: 'Upload client video reels, GIFs & photos' },
  { id: 'app_maintenance', label: 'Maintenance Mode', icon: Wrench, desc: 'Politely lock customer app during upgrades' },
  { id: 'floating', label: 'Floating Promo Banner', icon: Gift, desc: 'Edit bottom offer pill & auto-hide rules' },
  { id: 'coupons', label: 'Promo Coupons & Timers', icon: Tag, desc: 'Manage discount codes, timers & active status' },
  { id: 'toggles_master', label: 'Master Feature Toggles', icon: SlidersHorizontal, desc: 'Enable/disable logo, profile & features' },
  { id: 'traffic_logs', label: 'Visitor Logs & Traffic', icon: Activity, desc: 'Track real-time Instagram bio & link visits' },
  { id: 'promotions', label: 'WhatsApp Broadcast Studio', icon: Megaphone, desc: 'Send bulk promo alerts via Baileys gateway' },
  { id: 'announcements', label: 'Top Announcements Ticker', icon: Volume2, desc: 'Configure top rotating ticker announcements' },
  { id: 'convenience', label: 'Travel Fees & Zones', icon: Car, desc: 'Edit venue travel charges per area' },
  { id: 'prices', label: 'Package Rates Manager', icon: Percent, desc: 'Adjust rates for Luxury vs HD kit looks' },
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

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
   
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [editingKitTab, setEditingKitTab] = useState('international');
   
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [bookingsList, setBookingsList] = useState([]);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [promoTemplates, setPromoTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplateText, setSelectedTemplateText] = useState(DEFAULT_TEMPLATES[0].text);
  const [customNumbersInput, setCustomNumbersInput] = useState('');
  const [sendingPromo, setSendingPromo] = useState(false);
  const [savingSection, setSavingSection] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const [rejectModalData, setRejectModalData] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState(PRE_ADDED_REJECTION_REASONS[0]);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const canvasRef = useRef(null);
  const BAILEYS_URL = "http://localhost:3005";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLiveConfig(DEFAULT_CONFIG);
        if (data) {
          setDraft(prev => ({
            ...DEFAULT_CONFIG,
            ...data,
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === "8760" || pinInput === (draft.adminPin || "8760")) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect PIN.");
    }
  };

  const handleSaveSpecificCard = async (sectionName) => {
    setSavingSection(sectionName);
    setActionStatus('');
    try {
      const cleanData = JSON.parse(JSON.stringify(draft));
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

      await fetch(`${BAILEYS_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: b.clientPhone, message: confirmSlipMessage })
      });

      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
      setActionStatus(`✅ Final Confirmation Slip sent to ${b.clientName} on WhatsApp!`);
    } catch (err) {
      setActionStatus(`⚠️ Baileys Gateway offline or error: ${err.message}. You can use Manual Accept below.`);
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

      fetch(`${BAILEYS_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rejectModalData.clientPhone, message: rejectMsg })
      }).catch(() => {});

      setActionStatus(`❌ Booking ${rejectModalData.bookingNumber || rejectModalData.clientName} marked as REJECTED.`);
      setRejectModalData(null);
    } catch (err) {
      alert("Error rejecting booking: " + err.message);
    }
  };

  const handleGenerateSlipJpgOnDemand = (b) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1760;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1760);

    const bgGrad = ctx.createRadialGradient(540, 250, 40, 540, 780, 800);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#fafafa');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(20, 20, 1040, 1720);

    const isRejected = b.status === 'rejected';
    const isConfirmed = b.status === 'confirmed';

    ctx.strokeStyle = isRejected ? '#e11d48' : (isConfirmed ? '#059669' : '#b48a3c');
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1680);

    // 🖼️ Render Official Studio Logo on Download Slip Top Center
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = draft.studioLogo || DEFAULT_STUDIO_LOGO;
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 490, 60, 100, 100);
      drawSlipContent(ctx, b, isRejected, isConfirmed);
    };
    logoImg.onerror = () => {
      drawSlipContent(ctx, b, isRejected, isConfirmed);
    };
  };

  const drawSlipContent = (ctx, b, isRejected, isConfirmed) => {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 42px serif';
    ctx.fillText('H&F MAKEUP ARTIST', 540, 195);

    ctx.fillStyle = '#b48a3c';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Beauty, Styled Your Way', 540, 230);

    ctx.strokeStyle = 'rgba(180, 138, 60, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 255);
    ctx.lineTo(900, 255);
    ctx.stroke();

    ctx.fillStyle = isRejected ? '#e11d48' : (isConfirmed ? '#059669' : '#0f172a');
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(
      isRejected 
        ? 'BOOKING STATUS: DECLINED / REJECTED' 
        : (isConfirmed ? 'OFFICIAL CONFIRMED APPOINTMENT SLIP' : 'PENDING BOOKING REQUEST SLIP'), 
      540, 
      300
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

    let startY = 370;
    rows.forEach((row, idx) => {
      ctx.fillStyle = idx === 0 
        ? (isRejected ? '#fff1f2' : (isConfirmed ? '#f0fdf4' : '#f0f9ff')) 
        : (idx % 2 === 0 ? '#f8fafc' : '#ffffff');
      ctx.fillRect(80, startY - 26, 920, 56);

      ctx.textAlign = 'left';
      ctx.fillStyle = idx === 0 ? (isRejected ? '#e11d48' : (isConfirmed ? '#047857' : '#0284c7')) : '#64748b';
      ctx.font = idx === 0 ? 'bold 19px monospace' : 'bold 18px sans-serif';
      ctx.fillText(row.label, 100, startY + 9);

      ctx.fillStyle = idx === 0 ? (isRejected ? '#be123c' : (isConfirmed ? '#065f46' : '#0369a1')) : '#0f172a';
      ctx.font = idx === 0 ? 'bold 21px monospace' : 'bold 20px sans-serif';

      let displayVal = row.val;
      while (ctx.measureText(displayVal).width > 560 && displayVal.length > 4) {
        displayVal = displayVal.substring(0, displayVal.length - 4) + '...';
      }
      ctx.fillText(displayVal, 380, startY + 9);
      startY += 64;
    });

    if (b.extraGuestsList && b.extraGuestsList.length > 0) {
      startY += 10;
      ctx.fillStyle = '#fdf4ff';
      ctx.fillRect(80, startY - 26, 920, 48);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#9333ea';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`EXTRA FAMILY GUESTS (${b.extraGuestsList.length} PERSONS)`, 100, startY + 6);

      ctx.textAlign = 'right';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`+₹${(b.extraGuestsCost || 0).toLocaleString('en-IN')}`, 980, startY + 6);
      startY += 54;

      b.extraGuestsList.slice(0, 4).forEach((g, gIdx) => {
        const raw = draft.pricingByKit[g.kit]?.[g.packageKey] || 2500;
        const finalP = draft.guestDiscount?.enabled !== false ? Math.round(raw * (1 - (draft.guestDiscount?.discountPercent ?? 15) / 100)) : raw;
        const kitLabel = g.kit === 'international' ? 'Luxury' : 'HD Kit';
        const pkgName = draft.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(80, startY - 20, 920, 40);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#475569';
        ctx.font = '16px sans-serif';
        ctx.fillText(`• Guest #${gIdx + 1} (${kitLabel}): ${pkgName}`, 120, startY + 6);

        ctx.textAlign = 'right';
        ctx.font = '17px monospace';
        ctx.fillText(`₹${finalP.toLocaleString('en-IN')}`, 980, startY + 6);
        startY += 44;
      });
    }

    if (b.appliedCoupon && b.appliedCoupon !== 'None') {
      startY += 6;
      ctx.fillStyle = '#ecfdf5';
      ctx.fillRect(80, startY - 24, 920, 48);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`APPLIED PROMO: ${b.appliedCoupon}`, 100, startY + 7);

      ctx.textAlign = 'right';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`-₹${(b.discountAmount || 0).toLocaleString('en-IN')}`, 980, startY + 7);
      startY += 58;
    }

    startY += 10;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(80, startY, 920, 140);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, startY, 920, 140);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('TOTAL AMOUNT', 540, startY + 45);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 56px serif';
    ctx.fillText(`₹${b.totalAmount?.toLocaleString('en-IN')}`, 540, startY + 110);

    if (isRejected) {
      startY += 160;
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(80, startY, 920, 130);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(80, startY, 920, 130);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 19px sans-serif';
      ctx.fillText('REJECTION REASON / REMARKS:', 540, startY + 32);

      ctx.fillStyle = '#475569';
      ctx.font = 'italic 16px sans-serif';
       
      const fullReason = b.rejectionReason || "Slot unavailable for requested date. Please connect with studio.";
      const words = fullReason.split(' ');
      let line1 = '';
      let line2 = '';
      let line3 = '';
       
      for (let n = 0; n < words.length; n++) {
        const testLine = line1 + words[n] + ' ';
        if (ctx.measureText(testLine).width < 820 && !line2) {
          line1 = testLine;
        } else if ((line2 + words[n] + ' ').length < 90 && !line3) {
          line2 += words[n] + ' ';
        } else {
          line3 += words[n] + ' ';
        }
      }

      ctx.fillText(line1.trim(), 540, startY + 62);
      if (line2) ctx.fillText(line2.trim(), 540, startY + 86);
      if (line3) ctx.fillText(line3.trim(), 540, startY + 110);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '17px sans-serif';
    ctx.fillText(`Base Location: ${draft.baseLocation} • Instagram: @${draft.instagramHandle || 'husna_farooqui_makeup'}`, 540, 1670);

    ctx.fillStyle = '#b48a3c';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('Beauty, Styled Your Way', 540, 1700);

    const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
    const downloadLink = document.createElement('a');
    downloadLink.download = `${isRejected ? 'Declined' : 'Confirmed'}_Slip_${b.bookingNumber || b.clientName}.jpg`;
    downloadLink.href = jpgUrl;
    downloadLink.click();
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
        setActionStatus(`Loaded media successfully! Click Save below.`);
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

  const handleSendBroadcast = async () => {
    let numbers = bookingsList.map(b => b.clientPhone);
    if (customNumbersInput.trim()) {
      const extra = customNumbersInput.split(',').map(n => n.trim()).filter(Boolean);
      numbers = [...new Set([...numbers, ...extra])];
    }
    if (numbers.length === 0) {
      alert("No client phone numbers found to broadcast.");
      return;
    }
    setSendingPromo(true);
    setActionStatus(`Starting broadcast to ${numbers.length} clients...`);
    try {
      await fetch(`${BAILEYS_URL}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients: numbers, templateText: selectedTemplateText })
      });
      setActionStatus(`🎉 Broadcast started in background for ${numbers.length} clients!`);
    } catch (err) {
      setActionStatus(`⚠️ Failed to connect to WhatsApp Gateway: ${err.message}`);
    } finally {
      setSendingPromo(false);
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

  const activeColorThemeKey = draft.theme?.colorTheme || 'liquid_glass';
  const currentTheme = THEME_STYLES[activeColorThemeKey] || THEME_STYLES.liquid_glass;

  const adminBgClass = isAdminDarkMode ? "bg-[#030712] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]";
  const cardBgClass = isAdminDarkMode ? "bg-white/[0.04] backdrop-blur-3xl border border-white/[0.12] shadow-2xl text-[#f8fafc]" : "bg-white border border-slate-200 shadow-xl text-[#0f172a]";
  const adminInnerCard = isAdminDarkMode ? "bg-black/40 border border-white/10 text-[#f8fafc]" : "bg-slate-50 border border-slate-200 text-[#0f172a]";
  const adminInputBg = isAdminDarkMode ? "bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400" : "bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500";
  const adminMuted = isAdminDarkMode ? "text-slate-400" : "text-slate-600";

  const activeFolderObj = ADMIN_FOLDERS.find(f => f.id === activeFolderId);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${adminBgClass} flex items-center justify-center p-4 relative overflow-hidden font-sans`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-3xl border text-center space-y-4 shadow-2xl ${cardBgClass}`}>
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <p className={`text-xs ${adminMuted}`}>Master Studio Management Console</p>
          <input type="password" placeholder="Enter Admin PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={`w-full text-center text-lg p-3 rounded-2xl font-mono text-cyan-400 ${adminInputBg}`} />
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold text-xs rounded-2xl shadow-lg active:scale-95 transition">Unlock Console</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${adminBgClass} font-sans pb-28 transition-colors duration-300 relative overflow-x-hidden`}>
       
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Rejection Modal */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`max-w-lg w-full rounded-3xl p-6 border shadow-2xl space-y-4 ${isAdminDarkMode ? 'bg-[#0f1424] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-base">Reject Booking: {rejectModalData.bookingNumber || rejectModalData.clientName}</h3>
              </div>
              <button onClick={() => setRejectModalData(null)} className="p-1 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className={`text-xs ${adminMuted}`}>
              Are you sure you want to decline this booking for <strong>{rejectModalData.clientName}</strong> on <strong>{rejectModalData.eventDate}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Reason for Rejection (Added to Slip & Alert):</label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={e => setRejectionReasonText(e.target.value)}
                className={`w-full p-3 rounded-2xl text-xs border ${adminInputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Pre-Added Reason Template:</span>
              <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto pr-1">
                {PRE_ADDED_REJECTION_REASONS.map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReasonText(reason)}
                    className={`text-left p-2 rounded-xl text-[11px] border transition ${rejectionReasonText === reason ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                  >
                    • {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg active:scale-95"
              >
                Confirm Rejection & Update Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💎 Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-3xl border-b px-4 sm:px-8 py-3.5 flex justify-between items-center ${isAdminDarkMode ? 'bg-[#080d1e]/80 border-white/10' : 'bg-white/85 border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-2.5">
          {draft.studioLogo ? (
            <div className="w-10 h-10 rounded-2xl bg-white/10 p-1 border border-white/20 overflow-hidden shadow-md">
              <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
          )}

          <div>
            <h1 className={`font-bold text-sm sm:text-base bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>
              H&F Makeup Artist Console
            </h1>
            <p className={`text-[11px] ${adminMuted}`}>Master Directory & Configuration Center</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={`p-2 rounded-xl border ${isAdminDarkMode ? 'bg-white/10 border-white/20 text-amber-400' : 'bg-white border-slate-300 text-slate-800'}`}>
            {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-rose-500 font-bold hover:underline">Lock</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
         
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {activeFolderId ? (
            <button
              onClick={() => setActiveFolderId(null)}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-xs font-bold flex items-center gap-2 text-cyan-400 border border-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Folders</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Master Control Cards Directory</h3>
            </div>
          )}

          {activeFolderObj && (
            <span className="text-xs font-bold text-slate-400 font-mono">
              Folder: <strong className="text-white">{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {actionStatus && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs text-center animate-fade-in shadow-lg">
            {actionStatus}
          </div>
        )}

        {/* 📁 VIEW 1: FOLDER CARDS DIRECTORY GRID */}
        {!activeFolderId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {ADMIN_FOLDERS.map(f => {
              const Icon = f.icon;
              const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFolderId(f.id)}
                  className={`${cardBgClass} rounded-3xl p-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {count !== null && (
                      <span className="text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                        {count} Active
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm sm:text-base group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{f.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className={`text-xs mt-1 leading-relaxed ${adminMuted}`}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🗂️ VIEW 2: INSIDE SPECIFIC FOLDER CARD */}

        {/* TAB: BOOKINGS */}
        {activeFolderId === 'bookings' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400">Incoming Customer Bookings Queue</h3>
                <p className={`text-xs ${adminMuted}`}>Accept, hold as pending, or reject bookings with custom reason templates.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-xl">
                {bookingsList.length} Total Bookings
              </span>
            </div>

            {bookingsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No bookings received yet. Submissions will appear here instantly!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingsList.map(b => {
                  const conflictingConfirmedBooking = b.status === 'pending' 
                    ? bookingsList.find(other => other.id !== b.id && other.eventDate === b.eventDate && other.status === 'confirmed')
                    : null;

                  return (
                    <div key={b.id} className={`p-5 rounded-3xl border space-y-3 ${adminInnerCard} ${conflictingConfirmedBooking ? 'ring-2 ring-rose-500/50' : ''}`}>
                       
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                              {b.bookingNumber || '#HF-PENDING'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 
                              b.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 
                              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}>
                              {b.status === 'confirmed' ? '✅ Confirmed' : b.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Review'}
                            </span>
                          </div>
                           
                          <h4 className="font-bold text-base mt-2">{b.clientName}</h4>
                          <p className="text-xs text-slate-400 font-mono">📞 {b.clientPhone}</p>
                        </div>
                        <button onClick={() => deleteDoc(doc(db, "bookings", b.id))} className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>

                      {conflictingConfirmedBooking && (
                        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs space-y-1 animate-pulse">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>STUDIO BUSY FOR THIS DATE!</span>
                          </div>
                          <p className="text-[11px] text-rose-200">
                            You already have Confirmed Booking <strong>{conflictingConfirmedBooking.bookingNumber || conflictingConfirmedBooking.clientName}</strong> on {b.eventDate}.
                          </p>
                        </div>
                      )}

                      <div className="text-xs space-y-1 border-t border-b border-white/10 py-2">
                        <div className="flex justify-between"><span className={adminMuted}>Event Date:</span><strong className="text-amber-400 font-mono">{b.eventDate}</strong></div>
                        <div className="flex justify-between"><span className={adminMuted}>Package:</span><span>{b.packageName}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Vanity Kit:</span><span>{b.kitType}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Extra Guests:</span><span>{b.extraGuestsCount || 0} Custom Guest(s) (+₹{b.extraGuestsCost || 0})</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Venue Location:</span><span>{b.zoneName}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Address:</span><span className="truncate max-w-[200px]">{b.venueAddress}</span></div>
                        {b.rejectionReason && (
                          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                            <strong>Rejection Note:</strong> {b.rejectionReason}
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-white/5"><span className="font-bold">Total Amount:</span><strong className="text-cyan-400 font-mono text-sm">₹{b.totalAmount?.toLocaleString('en-IN')}</strong></div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{b.status === 'confirmed' ? 'Resend WhatsApp Confirmed Slip' : 'Accept & Send WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalData(b);
                              setRejectionReasonText(PRE_ADDED_REJECTION_REASONS[0]);
                            }}
                            className="py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className="w-full py-2 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Generate & Download Status Slip (.JPG)</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: FEEDBACKS */}
        {activeFolderId === 'feedbacks' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Client Feedback & Suggestions Box
                </h3>
                <p className={`text-xs ${adminMuted}`}>Reviews, ratings, and creative suggestions submitted by clients.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-xl">
                {feedbacksList.length} Feedbacks
              </span>
            </div>

            {feedbacksList.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No client feedback submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacksList.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border space-y-2.5 ${adminInnerCard}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1">{item.clientName}</h4>
                        {item.clientPhone && item.clientPhone !== 'Not Provided' && (
                          <p className="text-[11px] text-slate-400 font-mono">📞 {item.clientPhone}</p>
                        )}
                      </div>
                      <button onClick={() => handleDeleteFeedback(item.id)} className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                      "{item.message}"
                    </p>

                    <div className="flex justify-end">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.submittedAt ? new Date(item.submittedAt.toDate?.() || item.submittedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CALENDAR */}
        {activeFolderId === 'calendar_view' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${cardBgClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Interactive Monthly Booking Calendar
                </h3>
                <p className={`text-xs ${adminMuted} mt-0.5`}>
                  Visual color tags show free vs booked dates (🟢 Green = Confirmed / Busy, 🟡 Amber = Pending).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition">
                  <ChevronLeft className="w-4 h-4 text-cyan-400" />
                </button>
                <span className="font-bold text-xs sm:text-sm font-mono min-w-[130px] text-center text-white">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className="text-[11px] font-bold text-slate-400 py-1 uppercase">{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty_${i}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
              ))}

              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayBookingStatus(day);
                return (
                  <div
                    key={`day_${day}`}
                    onClick={() => status.hasBookings ? setSelectedCalendarDay(status) : null}
                    className={`h-16 sm:h-20 rounded-2xl p-1.5 flex flex-col justify-between items-center transition-all duration-200 border cursor-pointer ${
                      status.hasBookings 
                        ? (status.isConfirmed 
                            ? 'bg-emerald-500/15 border-emerald-500/40 hover:scale-105 shadow-md shadow-emerald-500/10' 
                            : 'bg-amber-500/15 border-amber-500/40 hover:scale-105 shadow-md shadow-amber-500/10')
                        : `${adminInnerCard} hover:border-white/20 opacity-75`
                    }`}
                  >
                    <span className={`text-xs font-bold font-mono ${status.hasBookings ? (status.isConfirmed ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-300'}`}>
                      {day}
                    </span>

                    {status.hasBookings && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${status.isConfirmed ? 'bg-emerald-500 text-neutral-950' : 'bg-amber-500 text-neutral-950'}`}>
                        {status.count} Booked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCalendarDay && (
              <div className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${adminInnerCard}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-cyan-400">Date: {selectedCalendarDay.dateStr}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCalendarDay.isConfirmed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {selectedCalendarDay.isConfirmed ? 'LOCKED / CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className="text-slate-400 hover:text-white text-xs underline">Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className="font-mono text-cyan-400">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className={adminMuted}>Look: {b.packageName} ({b.kitType})</p>
                      <p className="text-[11px] text-slate-400 truncate">📍 {b.venueAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: MERGED PACKAGE MANAGEMENT (IMAGES + TITLES & DESCRIPTIONS) */}
        {activeFolderId === 'packages_master' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${cardBgClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Package Management (Images, Titles & Descriptions)
                </h3>
                <p className={`text-xs ${adminMuted} mt-0.5`}>Manage custom look photos, package display names and descriptions per kit type.</p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-black/50 border border-white/10 gap-1 self-start">
                <button
                  type="button"
                  onClick={() => setEditingKitTab('international')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editingKitTab === 'international' ? 'bg-cyan-500 text-neutral-950 shadow' : 'text-slate-400'}`}
                >
                  👑 Luxury Kit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('drugstore')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editingKitTab === 'drugstore' ? 'bg-cyan-500 text-neutral-950 shadow' : 'text-slate-400'}`}
                >
                  ✨ HD Kit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partyPackages.concat(bridalPackages).map(k => {
                const pkgText = draft.kitText?.[editingKitTab]?.[k] || DEFAULT_CONFIG.kitText[editingKitTab][k];
                const pkgImg = draft.kitImages?.[editingKitTab]?.[k] || DEFAULT_CONFIG.kitImages[editingKitTab][k];

                return (
                  <div key={`${editingKitTab}_${k}`} className={`p-5 rounded-3xl border space-y-4 ${adminInnerCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 font-mono uppercase">{k.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase">{editingKitTab}</span>
                    </div>

                    {/* Image Preview & Upload */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-800 border border-white/20 shrink-0 shadow">
                        <img src={pkgImg} alt={pkgText.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5">
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
                          className={`w-full p-2 rounded-xl text-xs font-mono border ${adminInputBg}`}
                        />
                        <label className="block text-center py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 text-[11px] font-bold cursor-pointer border border-cyan-500/30 hover:bg-cyan-500/25">
                          Upload Photo (&lt;20MB)
                          <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, editingKitTab, k)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Package Name & Desc */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div>
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>Package Display Name</span>
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
                          className={`w-full p-2.5 rounded-xl text-xs font-bold border ${adminInputBg}`}
                        />
                      </div>
                      <div>
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>Description</span>
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
                          className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`}
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Master' ? 'Saving...' : 'Save Package Images & Titles Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: MAINTENANCE MODE */}
        {activeFolderId === 'app_maintenance' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${cardBgClass}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> App Down & Maintenance Controller
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>
                Turn on to politely lock customer app with an elegant maintenance notice during upgrades.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${adminInnerCard}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${draft.isAppDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  <h4 className="font-bold text-sm text-white">App Down / Maintenance Mode</h4>
                </div>
                <p className={`text-xs ${adminMuted} max-w-lg leading-relaxed`}>
                  {draft.isAppDown 
                    ? "🔴 ON: Customer App is locked. Visitors see a polite glassmorphism maintenance banner stating system upgrades are in progress."
                    : "🟢 OFF: Customer App is fully active, accepting estimates and live bookings."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...draft, isAppDown: !draft.isAppDown })}
                className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all duration-200 active:scale-95 ${
                  draft.isAppDown 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                }`}
              >
                {draft.isAppDown ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{draft.isAppDown ? 'MAINTENANCE MODE (ON)' : 'APP IS LIVE (ACTIVE)'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Maintenance Mode'}
              onClick={() => handleSaveSpecificCard('Maintenance Mode')}
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance Status Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: FLOATING PROMO BANNER (FIXED BLANK ISSUE) */}
        {activeFolderId === 'floating' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${cardBgClass}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4" /> Floating Promo Offer Banner Controller
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>Configure bottom-right floating offer pill text, code and activation status.</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-4 ${adminInnerCard}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Enable Floating Promo Banner Widget</span>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...draft,
                    floatingBanner: {
                      ...(draft.floatingBanner || {}),
                      enabled: !(draft.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] mb-1 ${adminMuted}`}>Badge Tag</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.tag || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), tag: e.target.value }
                    })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] mb-1 ${adminMuted}`}>Promo Code</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.code || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), code: e.target.value.toUpperCase() }
                    })}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono text-cyan-400 border ${adminInputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${adminMuted}`}>Banner Title</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), title: e.target.value }
                  })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] mb-1 ${adminMuted}`}>Action Button Text</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), actionText: e.target.value }
                  })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Floating Banner'}
              onClick={() => handleSaveSpecificCard('Floating Banner')}
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Floating Banner' ? 'Saving...' : 'Save Floating Banner Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: PROMO COUPONS */}
        {activeFolderId === 'coupons' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Promo Coupons Manager & Expiry Timers
                </h3>
                <p className={`text-xs ${adminMuted}`}>Set coupon discounts, active status and expiry timer dates.</p>
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
                className="px-3.5 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Coupon
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(draft.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold text-base">{code}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isCodeActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
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
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${isCodeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          const copy = { ...draft.validCoupons };
                          delete copy[code];
                          setDraft({ ...draft, validCoupons: copy });
                        }} className="text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>Discount Type</span>
                        <select
                          value={c.type || 'percent'}
                          onChange={e => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, type: e.target.value }
                            }
                          })}
                          className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}
                        >
                          <option value="percent">% Percent Off</option>
                          <option value="flat">₹ Flat Discount</option>
                        </select>
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>Value ({c.type === 'percent' ? '%' : '₹'})</span>
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
                          className={`w-full p-2 rounded-xl font-mono text-cyan-400 text-xs font-bold border ${adminInputBg}`}
                        />
                      </div>

                      <div>
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>⏱️ Expiry Date & Time</span>
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
                          className={`w-full p-2 rounded-xl text-xs font-mono text-amber-400 border ${adminInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <span className={`block text-[10px] mb-1 ${adminMuted}`}>Promo Display Description / Label</span>
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
                        className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`}
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Coupons' ? 'Saving...' : 'Save Promo Coupons Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: TRANSFORMATIONS */}
        {activeFolderId === 'gallery' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> Transformations, Videos & GIFs Studio (20MB Max)
                </h3>
                <p className={`text-xs ${adminMuted}`}>Direct URLs (.mp4, .webm, .gif) or file uploads up to 20MB.</p>
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
                className="px-3.5 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(draft.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Image/GIF'})</span>
                    <button onClick={() => setDraft({ ...draft, galleryPhotos: draft.galleryPhotos.filter((_, i) => i !== idx) })} className="text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-[10px] mb-1 ${adminMuted}`}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}>
                        <option value="video">🎥 Auto-play Video</option>
                        <option value="image">🖼️ Image / Animated GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-[10px] mb-1 ${adminMuted}`}>Subtitle</label>
                      <input type="text" value={item.sub || ''} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], sub: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${adminMuted}`}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`} />
                  </div>

                  <div>
                    <label className={`block text-[10px] mb-1 ${adminMuted}`}>Direct URL (Video, GIF, or Image link)</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-2 rounded-xl text-xs font-mono text-cyan-400 border ${adminInputBg}`} />
                  </div>

                  <label className="block text-center py-2 rounded-xl bg-cyan-500/15 text-cyan-400 text-xs font-bold cursor-pointer border border-cyan-500/30 hover:bg-cyan-500/25 transition">
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Gallery Media' ? 'Saving...' : 'Save Gallery Media Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: MASTER FEATURE TOGGLES */}
        {activeFolderId === 'toggles_master' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${cardBgClass}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" /> Master Feature & Section Toggles
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>Enable or disable any section, widget or logo on the customer app.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div key={toggle.key} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${adminInnerCard}`}>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-white">{toggle.label}</h4>
                      <p className={`text-[11px] ${adminMuted}`}>{toggle.desc}</p>
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
                      className={`p-2 rounded-xl flex items-center gap-1.5 font-bold text-xs transition active:scale-95 ${isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                    >
                      {isEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Master Toggles' ? 'Saving...' : 'Save Master Toggles Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: VISITOR TRAFFIC LOGS */}
        {activeFolderId === 'traffic_logs' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Live Traffic & Instagram Visitor Logs
                </h3>
                <p className={`text-xs ${adminMuted}`}>Track visitors arriving from your Instagram bio, links, and direct traffic in real-time.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-xl">
                {visitorLogs.length} Recent Visits Logged
              </span>
            </div>

            {visitorLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No visitor traffic recorded yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {visitorLogs.map(log => (
                  <div key={log.id} className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${adminInnerCard}`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400 font-mono">Source/ID: @{log.instagramIdOrSource || 'Direct'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Active Visit</span>
                      </div>
                      <p className={`text-[11px] truncate max-w-md ${adminMuted}`}>{log.userAgent}</p>
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {log.visitedAt ? new Date(log.visitedAt.toDate?.() || log.visitedAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PROMOTIONS */}
        {activeFolderId === 'promotions' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4" /> WhatsApp Broadcast Studio
            </h3>
            <textarea
              rows={6}
              value={selectedTemplateText}
              onChange={e => setSelectedTemplateText(e.target.value)}
              className={`w-full p-3.5 rounded-2xl text-xs font-mono text-cyan-300 border ${adminInputBg}`}
            />
            <button
              type="button"
              disabled={sendingPromo}
              onClick={handleSendBroadcast}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{sendingPromo ? 'Broadcasting...' : 'Broadcast WhatsApp Campaign'}</span>
            </button>
          </div>
        )}

        {/* TAB: TOP ANNOUNCEMENTS */}
        {activeFolderId === 'announcements' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" /> Top Announcement Lines Ticker
                </h3>
                <p className={`text-xs ${adminMuted}`}>Edit rotating top banner messages displayed to clients.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, announcements: [...(draft.announcements || []), "✨ New studio announcement line ✨"] })}
                className="px-3.5 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-3">
              {(draft.announcements || []).map((line, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-mono font-bold text-cyan-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const copy = [...draft.announcements];
                      copy[idx] = e.target.value;
                      setDraft({ ...draft, announcements: copy });
                    }}
                    className={`flex-1 p-3 rounded-2xl text-xs border ${adminInputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, announcements: draft.announcements.filter((_, i) => i !== idx) })}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Announcements' ? 'Saving...' : 'Save Announcements Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: TRAVEL FEES */}
        {activeFolderId === 'convenience' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Car className="w-4 h-4" /> Travel Fees & Convenience Zones
                </h3>
                <p className={`text-xs ${adminMuted}`}>Manage venue travel charges for customer locations.</p>
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
                className="px-3.5 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(draft.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${adminInnerCard}`}>
                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Zone Key: {zKey}</span>
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
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold border ${adminInputBg}`}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-xs font-bold text-slate-400">Fee (₹):</label>
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
                      className={`w-28 p-2.5 rounded-xl font-mono text-cyan-400 font-bold text-xs border ${adminInputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = { ...draft.convenienceZones };
                        delete copy[zKey];
                        setDraft({ ...draft, convenienceZones: copy });
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
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
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Travel Fees' ? 'Saving...' : 'Save Travel Fees Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: RATES */}
        {activeFolderId === 'prices' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">👑 International Luxury Vanity Kit (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={`block text-[10px] mb-1 capitalize ${adminMuted}`}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.international?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, international: { ...draft.pricingByKit.international, [k]: Number(e.target.value) } } })} className={`w-full p-2.5 rounded-xl font-mono text-cyan-400 text-xs border ${adminInputBg}`} />
                </div>
              ))}
            </div>

            <h3 className="font-bold text-xs uppercase text-rose-400 pt-4">✨ Premium HD Kit Rates (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={`block text-[10px] mb-1 capitalize ${adminMuted}`}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.drugstore?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, drugstore: { ...draft.pricingByKit.drugstore, [k]: Number(e.target.value) } } })} className={`w-full p-2.5 rounded-xl font-mono text-rose-400 text-xs border ${adminInputBg}`} />
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Package Rates'}
              onClick={() => handleSaveSpecificCard('Package Rates')}
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Rates' ? 'Saving...' : 'Save Package Rates Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: THEMES */}
        {activeFolderId === 'theme' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">Aesthetic Themes & Fonts (Synced)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Color Theme</label>
                <select value={draft.theme?.colorTheme || 'liquid_glass'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold text-cyan-400 border ${adminInputBg}`}>
                  <option value="liquid_glass">💎 Liquid Glass iOS</option>
                  <option value="one_ui_9">✨ Samsung One UI 9</option>
                  <option value="gold_rose">👑 Royal Gold Rose</option>
                  <option value="champagne">🥂 Champagne Gold</option>
                  <option value="emerald">💚 Emerald Luxe</option>
                  <option value="violet">🔮 Midnight Orchid Violet</option>
                  <option value="google_minimal">🔵 Google Minimal</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Font Family</label>
                <select value={draft.theme?.fontFamily || 'sans'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, fontFamily: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold text-amber-400 border ${adminInputBg}`}>
                  <option value="sans">Plus Jakarta Sans</option>
                  <option value="outfit">Outfit (iOS Glass Minimal)</option>
                  <option value="serif">Playfair Display (Royal)</option>
                  <option value="cormorant">Cormorant Garamond</option>
                  <option value="cinzel">Cinzel</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Default Customer Mode</label>
                <select value={draft.theme?.defaultMode || 'dark'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, defaultMode: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold border ${adminInputBg}`}>
                  <option value="dark">🌙 Dark Mode</option>
                  <option value="light">☀️ Light Mode</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Theme & Styles'}
              onClick={() => handleSaveSpecificCard('Theme & Styles')}
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Theme & Styles' ? 'Saving...' : 'Save Theme & Fonts Live'}</span>
            </button>
          </div>
        )}

        {/* TAB: PROFILE & LOGO UPLOAD */}
        {activeFolderId === 'profile' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${cardBgClass}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <User className="w-4 h-4" /> Studio Identity, Logo & Social Profiles
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>Configure official studio title, upload custom logo & artist profile photo.</p>
            </div>

            {/* 1. Studio Logo Upload Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <Crown className="w-4 h-4" /> 1. Official Studio Logo (Appears in Header & Splash)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Auto-Compressed</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  {draft.studioLogo ? (
                    <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Logo Image URL"
                    value={draft.studioLogo || ''}
                    onChange={e => setDraft({ ...draft, studioLogo: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono border ${adminInputBg}`}
                  />
                  <label className="inline-block px-3.5 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 text-xs font-bold cursor-pointer border border-cyan-500/30 hover:bg-cyan-500/25 transition">
                    Upload & Compress Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Artist Profile Photo Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> 2. Artist Profile Photo
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Avatar Card</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-amber-400/40 shrink-0 shadow-md">
                  <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={draft.profileImage || ''}
                    onChange={e => setDraft({ ...draft, profileImage: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono border ${adminInputBg}`}
                  />
                  <label className="inline-block px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 text-xs font-bold cursor-pointer border border-amber-500/30 hover:bg-amber-500/25 transition">
                    Upload & Compress Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Display Title</label>
                <input type="text" value={draft.studioName || ''} onChange={e => setDraft({ ...draft, studioName: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Booking Contact Number</label>
                <input type="text" value={draft.whatsappNumber || ''} onChange={e => setDraft({ ...draft, whatsappNumber: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs font-mono text-cyan-400 border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Instagram Handle</label>
                <input type="text" value={draft.instagramHandle || ''} onChange={e => setDraft({ ...draft, instagramHandle: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs font-mono text-pink-400 border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Artist Tagline / Subtitle</label>
                <input type="text" value={draft.artistTagline || ''} onChange={e => setDraft({ ...draft, artistTagline: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Studio Profile'}
              onClick={() => handleSaveSpecificCard('Studio Profile')}
              className={`w-full py-3.5 ${currentTheme.btnPrimary} text-xs rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
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
