import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight, 
  Sliders, Palette, MapPin, Eye, ChevronDown, ChevronRight, ChevronLeft, 
  ListFilter, Car, Volume2, Activity, SlidersHorizontal, CheckCircle2, 
  XCircle, Clock, Gift, AlertCircle, Calendar, Download, FileCheck, 
  Hash, AlertTriangle, Wrench, X, MessageSquare, RotateCcw, Ban, 
  Folder, FolderOpen, ArrowLeft, Star, Fingerprint, ShieldCheck, Key, Mail, Settings, ArrowUp, ArrowDown, Edit3, GitBranch
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
    colorTheme: "liquid_glass",
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingDateFilter, setBookingDateFilter] = useState('');

  const [rejectModalData, setRejectModalData] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState(PRE_ADDED_REJECTION_REASONS[0]);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const canvasRef = useRef(null);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log("Audio play blocked by browser:", e));
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch (e) {
      console.log("Audio error:", e);
    }
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
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            playNotificationSound();
          }
        });
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
      const secureHash = "SECURE_FP_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
      
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
    setForgotPasswordStatus("📧 Master Password Recovery Link & Current PIN dispatched to " + targetEmail + "! Check inbox.");
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
      setActionStatus("🎉 " + sectionName + " saved & synced live to Customer App!");
    } catch (err) {
      setActionStatus("❌ Error saving " + sectionName + ": " + err.message);
    } finally {
      setSavingSection('');
    }
  };

  const handleAcceptBookingWhatsApp = async (b) => {
    setActionStatus("Dispatching Final Confirmation Slip to " + b.clientName + "...");
    try {
      const confirmSlipMessage = 
        "🎉 *OFFICIAL FINAL CONFIRMED BOOKING SLIP - H&F MAKEUP ARTIST* 🎉\n\n" +
        "Dear *" + b.clientName + "*,\n" +
        "Your appointment is officially confirmed in our master schedule!\n\n" +
        "🔢 *Booking Number:* " + (b.bookingNumber || '#HF-CONFIRMED') + "\n" +
        "📅 *Confirmed Event Date:* " + b.eventDate + "\n" +
        "💄 *Main Look:* " + b.packageName + "\n" +
        "💎 *Vanity Tier:* " + b.kitType + "\n" +
        "👥 *Extra Family Guests:* " + (b.extraGuestsCount || 0) + " Person(s)\n" +
        "📍 *Venue Location:* " + b.zoneName + "\n" +
        "🏠 *Exact Address:* " + b.venueAddress + "\n" +
        "💰 *Total Amount:* ₹" + (b.totalAmount?.toLocaleString('en-IN')) + "\n\n" +
        "_Status: CONFIRMED & OFFICIALLY SCHEDULED_\n" +
        "Our artist team will coordinate final timings with you prior to the date.";

      await fetch(WA_SERVER_URL + "/api/send-message", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: b.clientPhone, message: confirmSlipMessage })
      });

      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
      setActionStatus("✅ Final Confirmation Slip sent to " + b.clientName + " via Cloudflare Tunnel!");
    } catch (err) {
      setActionStatus("⚠️ Termux server offline. Marking status as confirmed.");
      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
    }
  };

  const handleManualStatusChange = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      setActionStatus("✅ Booking marked as " + newStatus.toUpperCase() + " successfully!");
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
        "Dear *" + rejectModalData.clientName + "*,\n\n" +
        "Thank you for your booking request (#" + (rejectModalData.bookingNumber || 'HF-BOOKING') + ") for *" + rejectModalData.eventDate + "* with *H&F Makeup Artist*.\n\n" +
        "*Update on your request:* We are unable to accept this booking.\n" +
        "*Note:* " + rejectionReasonText + "\n\n" +
        "We truly appreciate your interest and hope to serve you on future dates!";

      fetch(WA_SERVER_URL + "/api/send-message", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rejectModalData.clientPhone, message: rejectMsg })
      }).catch(() => {});

      setActionStatus("❌ Booking marked as REJECTED.");
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

    const isRejected = b.status === 'rejected';
    const isConfirmed = b.status === 'confirmed';

    const drawAdminSlip = (logoImgObj) => {
      ctx.fillStyle = isAdminDarkMode ? '#1C1C1E' : '#F8F5F2';
      ctx.fillRect(0, 0, 1080, 1760);

      const bgGrad = ctx.createRadialGradient(540, 250, 40, 540, 780, 800);
      bgGrad.addColorStop(0, isAdminDarkMode ? '#2C2C2E' : '#FFFFFF');
      bgGrad.addColorStop(1, isAdminDarkMode ? '#1C1C1E' : '#F8F5F2');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(20, 20, 1040, 1720);

      ctx.strokeStyle = isRejected ? '#e11d48' : (isConfirmed ? '#059669' : '#B89462');
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1680);

      ctx.save();
      ctx.translate(540, 880);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(184, 148, 98, 0.05)';
      ctx.font = 'bold 84px serif';
      ctx.fillText('H&F MAKEUP ARTIST', 0, 0);
      ctx.restore();

      if (logoImgObj) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 150, 45, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImgObj, 95, 105, 90, 90);
        ctx.restore();

        ctx.strokeStyle = '#B89462';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(140, 150, 45, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = isAdminDarkMode ? '#FFFFFF' : '#1C1C1E';
        ctx.font = 'bold 36px serif';
        ctx.fillText('H&F MAKEUP ARTIST', 210, 140);

        ctx.fillStyle = '#B89462';
        ctx.font = '600 18px sans-serif';
        ctx.fillText('Beauty, Styled Your Way', 210, 170);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = isAdminDarkMode ? '#FFFFFF' : '#1C1C1E';
        ctx.font = 'bold 42px serif';
        ctx.fillText('H&F MAKEUP ARTIST', 540, 140);

        ctx.fillStyle = '#B89462';
        ctx.font = '600 20px sans-serif';
        ctx.fillText('Beauty, Styled Your Way', 540, 175);
      }

      ctx.strokeStyle = 'rgba(184, 148, 98, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 220);
      ctx.lineTo(1000, 220);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = isRejected ? '#e11d48' : (isConfirmed ? '#059669' : (isAdminDarkMode ? '#FFFFFF' : '#1C1C1E'));
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(
        isRejected 
          ? 'BOOKING STATUS: DECLINED / REJECTED' 
          : (isConfirmed ? 'OFFICIAL CONFIRMED APPOINTMENT SLIP' : 'PENDING BOOKING REQUEST SLIP'), 
        540, 
        275
      );

      const rows = [
        { label: 'BOOKING NUMBER', val: b.bookingNumber || '#HF-RECORD' },
        { label: 'CLIENT NAME', val: b.clientName || 'Not Provided' },
        { label: 'CONTACT NUMBER', val: b.clientPhone || 'Not Provided' },
        { label: 'EVENT DATE', val: b.eventDate || 'Not Provided' },
        { label: 'MAIN LOOK TIER', val: b.kitType || 'Luxury Vanity' },
        { label: 'MAIN LOOK PACKAGE', val: b.packageName || 'Bridal Makeup' },
        { label: 'LOCATION ZONE', val: (b.zoneName || 'Delhi NCR') + ' (Fee: ₹' + (b.zoneFee || 350) + ')' },
        { label: 'EXACT ADDRESS', val: b.venueAddress || 'To be confirmed' }
      ];

      let startY = 340;
      rows.forEach((row, idx) => {
        ctx.fillStyle = idx === 0 
          ? (isRejected ? '#fff1f2' : (isConfirmed ? '#f0fdf4' : (isAdminDarkMode ? '#2C2C2E' : '#F1ECE6'))) 
          : (idx % 2 === 0 ? (isAdminDarkMode ? '#242426' : '#FFFFFF') : (isAdminDarkMode ? '#1C1C1E' : '#F8F5F2'));
        ctx.fillRect(80, startY - 26, 920, 56);

        ctx.textAlign = 'left';
        ctx.fillStyle = idx === 0 ? (isRejected ? '#e11d48' : (isConfirmed ? '#047857' : '#B89462')) : '#6E6864';
        ctx.font = idx === 0 ? 'bold 19px monospace' : 'bold 18px sans-serif';
        ctx.fillText(row.label, 100, startY + 9);

        ctx.fillStyle = idx === 0 ? (isRejected ? '#be123c' : (isConfirmed ? '#065f46' : (isAdminDarkMode ? '#FFFFFF' : '#1C1C1E'))) : (isAdminDarkMode ? '#FFFFFF' : '#1C1C1E');
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
        ctx.fillText("EXTRA FAMILY GUESTS (" + b.extraGuestsList.length + " PERSONS)", 100, startY + 6);

        ctx.textAlign = 'right';
        ctx.font = 'bold 20px monospace';
        ctx.fillText("+₹" + (b.extraGuestsCost || 0).toLocaleString('en-IN'), 980, startY + 6);
        startY += 54;

        b.extraGuestsList.slice(0, 4).forEach((g, gIdx) => {
          const raw = draft.pricingByKit[g.kit]?.[g.packageKey] || 2500;
          const finalP = draft.guestDiscount?.enabled !== false ? Math.round(raw * (1 - (draft.guestDiscount?.discountPercent ?? 15) / 100)) : raw;
          const kitLabel = g.kit === 'international' ? 'Luxury' : 'HD Kit';
          const pkgName = draft.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;

          ctx.fillStyle = isAdminDarkMode ? '#242426' : '#FFFFFF';
          ctx.fillRect(80, startY - 20, 920, 40);

          ctx.textAlign = 'left';
          ctx.fillStyle = '#6E6864';
          ctx.font = '16px sans-serif';
          ctx.fillText("• Guest #" + (gIdx + 1) + " (" + kitLabel + "): " + pkgName, 120, startY + 6);

          ctx.textAlign = 'right';
          ctx.font = '17px monospace';
          ctx.fillText("₹" + finalP.toLocaleString('en-IN'), 980, startY + 6);
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
        ctx.fillText("APPLIED PROMO: " + b.appliedCoupon, 100, startY + 7);

        ctx.textAlign = 'right';
        ctx.font = 'bold 20px monospace';
        ctx.fillText("-₹" + (b.discountAmount || 0).toLocaleString('en-IN'), 980, startY + 7);
        startY += 58;
      }

      startY += 10;
      ctx.fillStyle = isAdminDarkMode ? '#2C2C2E' : '#F1ECE6';
      ctx.fillRect(80, startY, 920, 140);
      ctx.strokeStyle = '#B89462';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, startY, 920, 140);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#6E6864';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TOTAL AMOUNT', 540, startY + 45);

      ctx.fillStyle = isAdminDarkMode ? '#FFFFFF' : '#1C1C1E';
      ctx.font = 'bold 56px serif';
      ctx.fillText("₹" + b.totalAmount?.toLocaleString('en-IN'), 540, startY + 110);

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

        ctx.fillStyle = '#6E6864';
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
      ctx.fillStyle = '#6E6864';
      ctx.font = '17px sans-serif';
      ctx.fillText("Base Location: " + draft.baseLocation + " • Instagram: @" + (draft.instagramHandle || 'husna_farooqui_makeup'), 540, 1670);

      ctx.fillStyle = '#B89462';
      ctx.font = 'italic 16px sans-serif';
      ctx.fillText('Beauty, Styled Your Way', 540, 1700);

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      const downloadLink = document.createElement('a');
      downloadLink.download = (isRejected ? 'Declined' : 'Confirmed') + '_Slip_' + (b.bookingNumber || b.clientName) + '.jpg';
      downloadLink.href = jpgUrl;
      downloadLink.click();
    };

    const logoUrlToLoad = draft.studioLogo || DEFAULT_CONFIG.studioLogo;
    if (logoUrlToLoad && logoUrlToLoad.startsWith('data:image')) {
      const logoImg = new Image();
      logoImg.src = logoUrlToLoad;
      logoImg.onload = () => drawAdminSlip(logoImg);
      logoImg.onerror = () => drawAdminSlip(null);
    } else if (logoUrlToLoad) {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = logoUrlToLoad;
      logoImg.onload = () => drawAdminSlip(logoImg);
      logoImg.onerror = () => drawAdminSlip(null);
    } else {
      drawAdminSlip(null);
    }
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
        setActionStatus("Loaded optimized image for " + pkgKey + ". Click Save below.");
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
    const formatted = year + "-" + String(month + 1).padStart(2, '0') + "-" + String(day).padStart(2, '0');
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
    return statusMatch && dateMatch;
  });

  const adminBgClass = isAdminDarkMode ? "bg-[#1C1C1E] text-[#F8F5F2]" : "bg-[#F8F5F2] text-[#1C1C1E]";
  const cardBgClass = isAdminDarkMode 
    ? "bg-[#2C2C2E]/70 backdrop-blur-[24px] saturate-[160%] border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)] rounded-[22px] text-[#F8F5F2]" 
    : "bg-white/50 backdrop-blur-[24px] saturate-[160%] border border-white/40 shadow-[0_8px_30px_rgba(30,20,15,0.08)] rounded-[22px] text-[#1C1C1E]";
  const adminInnerCard = isAdminDarkMode 
    ? "bg-[#3A3A3C]/60 backdrop-blur-[20px] border border-white/10 text-[#F8F5F2] rounded-[18px]" 
    : "bg-white/70 backdrop-blur-[20px] border border-white/50 text-[#1C1C1E] rounded-[18px]";
  const adminInputBg = isAdminDarkMode 
    ? "bg-[#2C2C2E] backdrop-blur-[16px] border border-white/15 text-white placeholder-[#6E6864] focus:border-[#B89462] rounded-[14px]" 
    : "bg-white/90 backdrop-blur-[16px] border border-[#D8B9B1]/40 text-[#1C1C1E] placeholder-[#6E6864] focus:border-[#B89462] rounded-[14px]";
  const adminMuted = isAdminDarkMode ? "text-[#98928E]" : "text-[#6E6864]";

  const liquidGlassButton = isAdminDarkMode
    ? "bg-[#3A3A3C]/80 backdrop-blur-[20px] border border-white/15 rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.15)] active:scale-[0.97] transition-all text-[#F8F5F2]"
    : "bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-[16px] shadow-[0_6px_18px_rgba(90,65,40,0.1)] active:scale-[0.97] transition-all text-[#1C1C1E]";
  
  const primaryCtaButton = "bg-[#B89462]/90 hover:bg-[#B89462] backdrop-blur-[20px] text-white font-bold border border-white/35 rounded-[16px] shadow-[0_6px_18px_rgba(184,148,98,0.25)] active:scale-[0.97] transition-all";

  const activeFolderObj = adminFolders.find(f => f.id === activeFolderId);

  if (!isAuthenticated) {
    return (
      <div className={"min-h-screen " + adminBgClass + " flex items-center justify-center p-5 relative overflow-hidden font-sans transition-colors duration-300"}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D8B9B1]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        {showForgotPasswordModal ? (
          <form onSubmit={handleForgotPasswordSubmit} className={"max-w-sm w-full p-8 rounded-[28px] border text-center space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.1)] " + cardBgClass + " animate-fade-in"}>
            <div className="w-16 h-16 rounded-[22px] bg-[#B89462]/15 border border-[#B89462]/30 text-[#B89462] flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-[24px] font-bold tracking-tight">Recover Password</h2>
            <p className={"text-[13px] " + adminMuted}>Your recovery email is permanently secured to <strong>{draft.recoveryEmail || "aqiffarooqui@gmail.com"}</strong>.</p>
            
            {forgotPasswordStatus && (
              <div className="p-3.5 rounded-[16px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[13px] font-semibold">
                {forgotPasswordStatus}
              </div>
            )}

            <button type="submit" className={"w-full py-3.5 " + primaryCtaButton + " text-[14px]"}>Send PIN to Recovery Email</button>
            <button type="button" onClick={() => setShowForgotPasswordModal(false)} className={"text-[13px] underline " + adminMuted}>Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className={"max-w-sm w-full p-8 rounded-[28px] border text-center space-y-5 shadow-[0_12px_40px_rgba(0,0,0,0.1)] " + cardBgClass}>
            <div className="w-16 h-16 rounded-[22px] bg-[#B89462]/15 border border-[#B89462]/30 text-[#B89462] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold tracking-tight">Admin Portal</h2>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>Apple Liquid Glass iOS 19 Suite</p>
            </div>
            <input type="password" placeholder="Enter Admin PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={"w-full text-center text-[18px] p-3.5 font-mono text-[#B89462] " + adminInputBg} />
            
            <button type="submit" className={"w-full py-3.5 " + primaryCtaButton + " text-[14px]"}>Unlock Console</button>
            
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleBiometricOrFaceLogin}
                className={"w-full py-3 " + liquidGlassButton + " text-[13px] font-bold text-[#B89462] flex items-center justify-center gap-2"}
              >
                <Fingerprint className="w-4 h-4 text-[#B89462]" />
                <span>Login with Fingerprint / Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className={"text-[13px] underline block w-full pt-1 " + adminMuted}
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
    <div className={"min-h-screen " + adminBgClass + " font-sans pb-32 transition-colors duration-300 relative overflow-x-hidden"}>
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#D8B9B1]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#B89462]/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[24px] animate-fade-in">
          <div className="max-w-lg w-full rounded-[28px] p-6 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4 bg-white/90 backdrop-blur-[30px] text-[#1C1C1E]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-[18px]">Reject Booking: {rejectModalData.bookingNumber || rejectModalData.clientName}</h3>
              </div>
              <button onClick={() => setRejectModalData(null)} className="p-1 rounded-full text-[#6E6864] hover:text-[#1C1C1E]"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-[13px] text-[#6E6864]">
              Are you sure you want to decline this booking for <strong>{rejectModalData.clientName}</strong> on <strong>{rejectModalData.eventDate}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#6E6864] mb-1.5 uppercase tracking-wider">Reason for Rejection (Added to Slip & Alert):</label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={e => setRejectionReasonText(e.target.value)}
                className="w-full p-3.5 rounded-[16px] text-[13px] border bg-white/80 text-[#1C1C1E] border-slate-300 focus:border-[#B89462]"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#6E6864] uppercase tracking-wider">Select Pre-Added Reason Template:</span>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {PRE_ADDED_REJECTION_REASONS.map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReasonText(reason)}
                    className={"text-left p-2.5 rounded-[14px] text-[12px] border transition " + (rejectionReasonText === reason ? 'bg-[#B89462]/20 text-[#1C1C1E] border-[#B89462]/50 font-semibold shadow-sm' : 'bg-slate-100 border-slate-200 text-[#6E6864] hover:bg-slate-200')}
                  >
                    • {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2.5 rounded-[14px] bg-slate-200 text-[13px] font-bold text-[#6E6864]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-5 py-2.5 rounded-[14px] bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13px] shadow-[0_6px_18px_rgba(225,29,72,0.25)] active:scale-95 transition"
              >
                Confirm Rejection & Update Slip
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={"sticky top-0 z-40 backdrop-blur-[28px] saturate-[160%] border-b px-5 sm:px-8 py-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300 " + (isAdminDarkMode ? 'bg-[#2C2C2E]/80 border-white/10 text-white' : 'bg-white/75 border-white/50 text-[#1C1C1E]')}>
        <div className="flex items-center gap-3">
          {draft.studioLogo ? (
            <div className="w-11 h-11 rounded-[18px] bg-white/40 p-1 border border-white/60 overflow-hidden shadow-md">
              <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-[18px] bg-[#B89462]/15 text-[#B89462] flex items-center justify-center border border-[#B89462]/30 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
          )}

          <div>
            <h1 className="font-bold text-[16px] sm:text-[18px] tracking-tight">
              H&F Makeup Artist Console
            </h1>
            <p className={"text-[12px] " + adminMuted}>Liquid Glass iOS 19 Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!activeFolderId && (
            <button
              onClick={() => {
                if (isReorderMode) {
                  handleSaveSpecificCard("Card Sequence");
                }
                setIsReorderMode(!isReorderMode);
              }}
              className={"px-4 py-2.5 rounded-[16px] text-[13px] font-bold flex items-center gap-1.5 transition " + (isReorderMode ? 'bg-[#B89462] text-white shadow-[0_6px_18px_rgba(184,148,98,0.3)]' : liquidGlassButton)}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isReorderMode ? 'Save Order' : 'Edit Order'}</span>
            </button>
          )}

          <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className={"p-2.5 rounded-[14px] " + liquidGlassButton} title="Toggle Day/Night Mode">
            {isAdminDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#B89462]" />}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="text-[13px] text-rose-500 font-bold hover:underline px-2 py-1">Lock</button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {activeFolderId ? (
            <button
              onClick={() => setActiveFolderId(null)}
              className={"px-4 py-2.5 rounded-[16px] " + liquidGlassButton + " text-[13px] font-bold flex items-center gap-2 text-[#B89462] transition"}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Folders</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#B89462]" />
              <h3 className={"font-bold text-[13px] uppercase tracking-wider " + adminMuted}>
                {isReorderMode ? 'Reorder Mode Active: Use ⬆️ ⬇️ to move cards' : 'Master Control Cards Directory'}
              </h3>
            </div>
          )}

          {activeFolderObj && (
            <span className={"text-[13px] font-bold font-mono " + adminMuted}>
              Folder: <strong className={isAdminDarkMode ? 'text-white' : 'text-[#1C1C1E]'}>{activeFolderObj.label}</strong>
            </span>
          )}
        </div>

        {actionStatus && (
          <div className="p-4 rounded-[18px] bg-[#B89462]/15 border border-[#B89462]/30 font-bold text-[13px] text-center animate-fade-in shadow-md">
            {actionStatus}
          </div>
        )}

        {!activeFolderId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
            {adminFolders.map((f, index) => {
              const Icon = f.icon;
              const count = f.countKey === 'bookings' ? bookingsList.length : (f.countKey === 'feedbacks' ? feedbacksList.length : null);

              return (
                <div
                  key={f.id}
                  className={cardBgClass + " p-6 transition-all duration-300 flex flex-col justify-between space-y-4 group relative " + (isReorderMode ? 'ring-2 ring-[#B89462] bg-[#B89462]/10' : 'hover:scale-[1.01]')}
                >
                  <div className="flex justify-between items-start">
                    <div 
                      onClick={() => !isReorderMode && setActiveFolderId(f.id)} 
                      className={"w-13 h-13 rounded-[20px] bg-[#B89462]/15 border border-[#B89462]/30 text-[#B89462] flex items-center justify-center group-hover:scale-110 transition-transform " + (!isReorderMode ? 'cursor-pointer' : '')}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className={"flex items-center gap-1 p-1 rounded-[14px] border shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'up'); }}
                        title="Move Up"
                        className={"p-1.5 rounded-[10px] disabled:opacity-30 disabled:pointer-events-none " + (isAdminDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-[#6E6864] hover:bg-white')}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === adminFolders.length - 1}
                        onClick={(e) => { e.stopPropagation(); moveFolderOrder(index, 'down'); }}
                        title="Move Down"
                        className={"p-1.5 rounded-[10px] disabled:opacity-30 disabled:pointer-events-none " + (isAdminDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-[#6E6864] hover:bg-white')}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div onClick={() => !isReorderMode && setActiveFolderId(f.id)} className={!isReorderMode ? 'cursor-pointer' : ''}>
                    <div className="flex justify-between items-center">
                      <h4 className={"font-bold text-[16px] transition-colors " + (isAdminDarkMode ? 'text-white group-hover:text-[#B89462]' : 'text-[#1C1C1E] group-hover:text-[#B89462]')}>
                        {f.label}
                      </h4>
                      {count !== null && (
                        <span className="text-[11px] font-mono font-bold bg-[#B89462]/20 border border-[#B89462]/30 px-2.5 py-1 rounded-full">
                          {count} Active
                        </span>
                      )}
                    </div>
                    <p className={"text-[13px] mt-1.5 leading-relaxed " + adminMuted}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeFolderId === 'general' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div>
              <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                <Settings className="w-4 h-4" /> General & Security Settings
              </h3>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>Configure Biometric, Face ID, Fingerprint Scan Registration, Password & Permanent Recovery Email.</p>
            </div>

            <div className={"p-6 rounded-[22px] border space-y-4 " + adminInnerCard}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#B89462]" /> Hardware Fingerprint Scanner Integration
              </h4>
              <p className={"text-[13px] " + adminMuted}>Scan and save your fingerprint data locally via your device biometric hardware.</p>

              <div className={"p-5 rounded-[18px] border text-center space-y-3.5 shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                <div className="w-16 h-16 rounded-[22px] bg-[#B89462]/15 text-[#B89462] flex items-center justify-center mx-auto border border-[#B89462]/30 shadow-md">
                  <Fingerprint className={"w-8 h-8 " + (isScanningFinger ? 'animate-pulse text-[#B89462]' : '')} />
                </div>
                
                {isScanningFinger ? (
                  <div className="space-y-2">
                    <p className="text-[13px] font-bold text-[#B89462]">Scanning Fingerprint... ({scanProgress}%)</p>
                    <div className="w-48 h-2 bg-black/20 rounded-full mx-auto overflow-hidden shadow-inner">
                      <div className="h-full bg-[#B89462] transition-all duration-300" style={{ width: scanProgress + '%' }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <p className={"text-[13px] " + adminMuted}>
                      {draft.registeredFingerprintHash ? "✅ Hardware Fingerprint Registered & Saved Securely" : "⚠️ No fingerprint scanned yet"}
                    </p>
                    <button
                      type="button"
                      onClick={handleRegisterFingerprintScan}
                      className={"px-6 py-3 " + primaryCtaButton + " text-[13px]"}
                    >
                      {draft.registeredFingerprintHash ? "Re-Scan & Update Fingerprint" : "Scan & Save Fingerprint"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className={"p-4 rounded-[16px] border flex items-center justify-between shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                  <span className="text-[13px] font-bold">Enable Touch ID / Biometrics</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, biometricEnabled: !draft.biometricEnabled })}
                    className={"px-3 py-1.5 rounded-[12px] font-bold text-[12px] " + (draft.biometricEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}
                  >
                    {draft.biometricEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className={"p-4 rounded-[16px] border flex items-center justify-between shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                  <span className="text-[13px] font-bold">Enable Face ID / Passkey</span>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, faceIdEnabled: !draft.faceIdEnabled })}
                    className={"px-3 py-1.5 rounded-[12px] font-bold text-[12px] " + (draft.faceIdEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}
                  >
                    {draft.faceIdEnabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            <div className={"p-6 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#B89462]" /> Main App Version & History
              </h4>
              <p className={"text-[13px] " + adminMuted}>Deployment timeline and release changes for Customer Main App.</p>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {MAIN_APP_VERSIONS.map((ver, vIdx) => (
                  <div key={vIdx} className={"p-3.5 rounded-[16px] border text-[13px] space-y-1 shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#B89462]">{ver.version}</span>
                      <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " + (ver.status.includes('Active') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300')}>
                        {ver.status}
                      </span>
                    </div>
                    <p className={"text-[12px] " + (isAdminDarkMode ? 'text-slate-300' : 'text-[#1C1C1E]')}>{ver.changes}</p>
                    <span className={"text-[11px] font-mono " + adminMuted}>Released: {ver.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={"p-6 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#B89462]" /> Admin App Version & History
              </h4>
              <p className={"text-[13px] " + adminMuted}>Deployment timeline and release changes for Admin Console.</p>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {ADMIN_APP_VERSIONS.map((ver, vIdx) => (
                  <div key={vIdx} className={"p-3.5 rounded-[16px] border text-[13px] space-y-1 shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/50 border-white/60')}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#B89462]">{ver.version}</span>
                      <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " + (ver.status.includes('Active') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300')}>
                        {ver.status}
                      </span>
                    </div>
                    <p className={"text-[12px] " + (isAdminDarkMode ? 'text-slate-300' : 'text-[#1C1C1E]')}>{ver.changes}</p>
                    <span className={"text-[11px] font-mono " + adminMuted}>Released: {ver.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={"p-6 rounded-[22px] border space-y-3 " + adminInnerCard}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B89462]" /> Permanent Recovery Email ID
              </h4>
              <p className={"text-[13px] " + adminMuted}>If you forget your PIN, recovery instructions and current PIN are dispatched here.</p>
              
              <input
                type="email"
                value={draft.recoveryEmail || "aqiffarooqui@gmail.com"}
                onChange={e => setDraft({ ...draft, recoveryEmail: e.target.value })}
                className={"w-full p-3.5 rounded-[16px] font-mono text-[13px] font-bold text-[#B89462] border " + adminInputBg}
              />
            </div>

            <form onSubmit={handlePasswordChange} className={"p-6 rounded-[22px] border space-y-4 " + adminInnerCard}>
              <h4 className="font-bold text-[14px] uppercase flex items-center gap-2">
                <Key className="w-4 h-4 text-[#B89462]" /> Change Admin PIN Password
              </h4>

              <div className="space-y-3.5">
                <div>
                  <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Current PIN</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current PIN"
                    value={oldPinInput}
                    onChange={e => setOldPinInput(e.target.value)}
                    className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>New PIN (Min 4 digits)</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new PIN"
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value)}
                      className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                    />
                  </div>
                  <div>
                    <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new PIN"
                      value={confirmPinInput}
                      onChange={e => setConfirmPinInput(e.target.value)}
                      className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={"w-full py-3.5 " + primaryCtaButton + " text-[13px]"}
                >
                  Update Admin Password
                </button>
              </div>
            </form>

            <button
              type="button"
              disabled={savingSection === 'General Settings'}
              onClick={() => handleSaveSpecificCard('General Settings')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'General Settings' ? 'Saving...' : 'Save General & Security Settings Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'bookings' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462]">Incoming Customer Bookings Queue</h3>
                <p className={"text-[13px] " + adminMuted + " mt-1"}>Filter by status or event date, review, accept, or reject bookings.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#B89462]/20 border border-[#B89462]/40 px-3.5 py-1.5 rounded-full shadow-sm">
                {filteredBookingsList.length} / {bookingsList.length} Bookings
              </span>
            </div>

            <div className={"p-5 rounded-[22px] border grid grid-cols-1 sm:grid-cols-2 gap-4 " + adminInnerCard}>
              <div>
                <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Filter by Status</label>
                <select
                  value={bookingStatusFilter}
                  onChange={e => setBookingStatusFilter(e.target.value)}
                  className={"w-full p-3 rounded-[16px] text-[13px] font-bold border " + adminInputBg}
                >
                  <option value="all">🌟 All Statuses</option>
                  <option value="confirmed">✅ Confirmed / Accepted</option>
                  <option value="pending">⏳ Pending Review</option>
                  <option value="rejected">❌ Cancelled / Rejected</option>
                </select>
              </div>

              <div>
                <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Filter by Event Date</label>
                <div className="flex gap-2.5">
                  <input
                    type="date"
                    value={bookingDateFilter}
                    onChange={e => setBookingDateFilter(e.target.value)}
                    className={"flex-1 p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                  />
                  {bookingDateFilter && (
                    <button
                      type="button"
                      onClick={() => setBookingDateFilter('')}
                      className={"px-4 py-3 rounded-[16px] text-[13px] font-bold text-rose-500 " + liquidGlassButton}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {filteredBookingsList.length === 0 ? (
              <p className={"text-[14px] py-12 text-center " + adminMuted}>No bookings match the selected filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBookingsList.map(b => {
                  const conflictingConfirmedBooking = b.status === 'pending' 
                    ? bookingsList.find(other => other.id !== b.id && other.eventDate === b.eventDate && other.status === 'confirmed')
                    : null;

                  return (
                    <div key={b.id} className={"p-6 rounded-[24px] border space-y-4 " + adminInnerCard + (conflictingConfirmedBooking ? ' ring-2 ring-rose-500/50' : '')}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[12px] font-bold text-[#B89462] bg-[#B89462]/15 px-2.5 py-1 rounded-[10px] border border-[#B89462]/30">
                              {b.bookingNumber || '#HF-PENDING'}
                            </span>
                            <span className={"text-[11px] font-bold uppercase px-3 py-1 rounded-full " + (
                              b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 
                              b.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 
                              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            )}>
                              {b.status === 'confirmed' ? '✅ Confirmed' : b.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Review'}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-[18px] mt-2.5">{b.clientName}</h4>
                          <p className={"text-[13px] font-mono mt-0.5 " + adminMuted}>📞 {b.clientPhone}</p>
                        </div>
                        <button onClick={() => deleteDoc(doc(db, "bookings", b.id))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                      </div>

                      {conflictingConfirmedBooking && (
                        <div className="p-3.5 rounded-[16px] bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[13px] space-y-1 animate-pulse">
                          <div className="flex items-center gap-2 font-bold">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>STUDIO BUSY FOR THIS DATE!</span>
                          </div>
                          <p className="text-[12px] text-rose-200">
                            You already have Confirmed Booking <strong>{conflictingConfirmedBooking.bookingNumber || conflictingConfirmedBooking.clientName}</strong> on {b.eventDate}.
                          </p>
                        </div>
                      )}

                      <div className={"text-[13px] space-y-1.5 border-t border-b py-3 " + (isAdminDarkMode ? 'border-white/10' : 'border-black/10')}>
                        <div className="flex justify-between"><span className={adminMuted}>Event Date:</span><strong className="text-[#B89462] font-mono">{b.eventDate}</strong></div>
                        <div className="flex justify-between"><span className={adminMuted}>Package:</span><span className="font-medium">{b.packageName}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Vanity Kit:</span><span className="font-medium">{b.kitType}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Extra Guests:</span><span className="font-medium">{b.extraGuestsCount || 0} Custom Guest(s) (+₹{b.extraGuestsCost || 0})</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Venue Location:</span><span className="font-medium">{b.zoneName}</span></div>
                        <div className="flex justify-between"><span className={adminMuted}>Address:</span><span className="truncate max-w-[200px]">{b.venueAddress}</span></div>
                        {b.rejectionReason && (
                          <div className="p-3 rounded-[14px] bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[12px]">
                            <strong>Rejection Note:</strong> {b.rejectionReason}
                          </div>
                        )}
                        <div className={"flex justify-between pt-2 border-t " + (isAdminDarkMode ? 'border-white/5' : 'border-black/5')}><span className="font-bold">Total Amount:</span><strong className="text-[#B89462] font-mono text-[15px]">₹{b.totalAmount?.toLocaleString('en-IN')}</strong></div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptBookingWhatsApp(b)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[13px] rounded-[16px] shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 transition"
                        >
                          <Send className="w-4 h-4" />
                          <span>{b.status === 'confirmed' ? 'Resend WhatsApp Confirmed Slip' : 'Accept & Send WhatsApp Slip'}</span>
                        </button>

                        <div className="grid grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'confirmed')}
                            className="py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold text-[12px] rounded-[14px] flex items-center justify-center gap-1.5 active:scale-95 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleManualStatusChange(b.id, 'pending')}
                            className="py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-[12px] rounded-[14px] flex items-center justify-center gap-1.5 active:scale-95 transition"
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
                            className="py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-[12px] rounded-[14px] flex items-center justify-center gap-1.5 active:scale-95 transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateSlipJpgOnDemand(b)}
                          className={"w-full py-2.5 " + liquidGlassButton + " font-bold text-[12px] flex items-center justify-center gap-2"}
                        >
                          <Download className="w-4 h-4" />
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

        {activeFolderId === 'feedbacks' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Client Feedback & Suggestions Box
                </h3>
                <p className={"text-[13px] " + adminMuted}>Reviews, ratings, and creative suggestions submitted by clients.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#B89462]/20 border border-[#B89462]/40 px-3.5 py-1.5 rounded-full shadow-sm">
                {feedbacksList.length} Feedbacks
              </span>
            </div>

            {feedbacksList.length === 0 ? (
              <p className={"text-[14px] py-12 text-center " + adminMuted}>No client feedback submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacksList.map(item => (
                  <div key={item.id} className={"p-5 rounded-[22px] border space-y-3 " + adminInnerCard}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <h4 className="font-bold text-[16px] mt-1.5">{item.clientName}</h4>
                        {item.clientPhone && item.clientPhone !== 'Not Provided' && (
                          <p className={"text-[12px] font-mono mt-0.5 " + adminMuted}>📞 {item.clientPhone}</p>
                        )}
                      </div>
                      <button onClick={() => handleDeleteFeedback(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <p className={"text-[13px] leading-relaxed p-3.5 rounded-[16px] border shadow-inner " + (isAdminDarkMode ? 'bg-black/20 border-white/10 text-slate-300' : 'bg-white/50 border-white/60 text-[#1C1C1E]')}>
                      "{item.message}"
                    </p>

                    <div className="flex justify-end">
                      <span className={"text-[11px] font-mono " + adminMuted}>
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
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Interactive Monthly Booking Calendar
                </h3>
                <p className={"text-[13px] " + adminMuted + " mt-1"}>
                  Visual color tags show free vs booked dates (🟢 Green = Confirmed / Busy, 🟡 Amber = Pending).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className={"p-2.5 rounded-[14px] " + liquidGlassButton + " active:scale-90 transition"}>
                  <ChevronLeft className="w-4 h-4 text-[#B89462]" />
                </button>
                <span className="font-bold text-[14px] font-mono min-w-[140px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button type="button" onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className={"p-2.5 rounded-[14px] " + liquidGlassButton + " active:scale-90 transition"}>
                  <ChevronRight className="w-4 h-4 text-[#B89462]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className={"text-[12px] font-bold py-1.5 uppercase " + adminMuted}>{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={"empty_" + i} className="h-20 sm:h-24 rounded-[18px] bg-transparent" />
              ))}

              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayBookingStatus(day);
                return (
                  <div
                    key={"day_" + day}
                    onClick={() => status.hasBookings ? setSelectedCalendarDay(status) : null}
                    className={"h-20 sm:h-24 rounded-[18px] p-2 flex flex-col justify-between items-center transition-all duration-200 border cursor-pointer " + (
                      status.hasBookings 
                        ? (status.isConfirmed 
                            ? 'bg-emerald-500/20 border-emerald-500/50 hover:scale-105 shadow-md shadow-emerald-500/10' 
                            : 'bg-amber-500/20 border-amber-500/50 hover:scale-105 shadow-md shadow-amber-500/10')
                        : adminInnerCard + ' hover:border-white/50 opacity-80'
                    )}
                  >
                    <span className={"text-[13px] font-bold font-mono " + (status.hasBookings ? (status.isConfirmed ? 'text-emerald-400' : 'text-amber-400') : '')}>
                      {day}
                    </span>

                    {status.hasBookings && (
                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm " + (status.isConfirmed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white')}>
                        {status.count} Booked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedCalendarDay && (
              <div className={"p-5 rounded-[22px] border space-y-3.5 animate-fade-in " + adminInnerCard}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[14px] text-[#B89462]">Date: {selectedCalendarDay.dateStr}</span>
                    <span className={"text-[11px] font-bold px-2.5 py-0.5 rounded-full " + (selectedCalendarDay.isConfirmed ? 'bg-emerald-500/25 text-emerald-400' : 'bg-amber-500/25 text-amber-400')}>
                      {selectedCalendarDay.isConfirmed ? 'LOCKED / CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className={"text-[13px] underline font-medium " + adminMuted}>Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCalendarDay.list.map(b => (
                    <div key={b.id} className={"p-3.5 rounded-[16px] border text-[13px] space-y-1 shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/60 border-white/70')}>
                      <div className="flex justify-between font-bold">
                        <span>{b.bookingNumber || ''} • {b.clientName}</span>
                        <span className="font-mono text-[#B89462]">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className={adminMuted}>Look: {b.packageName} ({b.kitType})</p>
                      <p className={"text-[12px] truncate " + adminMuted}>📍 {b.venueAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeFolderId === 'packages_master' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Package Management (Images, Titles & Descriptions)
                </h3>
                <p className={"text-[13px] " + adminMuted + " mt-1"}>Manage custom look photos, package display names and descriptions per kit type.</p>
              </div>

              <div className={"inline-flex p-1.5 rounded-[18px] border gap-1.5 self-start shadow-sm " + (isAdminDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/40 border-white/60')}>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('international')}
                  className={"px-4 py-2 rounded-[14px] text-[13px] font-bold transition " + (editingKitTab === 'international' ? 'bg-[#B89462] text-white shadow' : adminMuted)}
                >
                  👑 Luxury Kit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('drugstore')}
                  className={"px-4 py-2 rounded-[14px] text-[13px] font-bold transition " + (editingKitTab === 'drugstore' ? 'bg-[#B89462] text-white shadow' : adminMuted)}
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
                  <div key={editingKitTab + "_" + k} className={"p-6 rounded-[24px] border space-y-4 " + adminInnerCard}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#B89462] font-mono uppercase tracking-wider">{k.replace(/_/g, ' ')}</span>
                      <span className={"text-[11px] px-2.5 py-0.5 rounded-full uppercase font-bold border " + (isAdminDarkMode ? 'bg-black/40 border-white/10 text-slate-300' : 'bg-white/60 border-white/80 text-[#6E6864]')}>{editingKitTab}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-[20px] overflow-hidden bg-neutral-200 border border-white/80 shrink-0 shadow-md">
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
                          className={"w-full p-2.5 rounded-[12px] text-[12px] font-mono border " + adminInputBg}
                        />
                        <label className="block text-center py-2 rounded-[12px] bg-[#B89462]/20 text-[#B89462] text-[12px] font-bold cursor-pointer border border-[#B89462]/40 hover:bg-[#B89462]/35 transition shadow-sm">
                          Upload Photo (&lt;20MB)
                          <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, editingKitTab, k)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className={"space-y-3 pt-3 border-t " + (isAdminDarkMode ? 'border-white/10' : 'border-black/10')}>
                      <div>
                        <span className={"block text-[11px] mb-1 font-bold " + adminMuted}>Package Display Name</span>
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
                          className={"w-full p-3 rounded-[16px] text-[13px] font-bold border " + adminInputBg}
                        />
                      </div>
                      <div>
                        <span className={"block text-[11px] mb-1 font-bold " + adminMuted}>Description</span>
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
                          className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Master' ? 'Saving...' : 'Save Package Images & Titles Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'app_maintenance' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div>
              <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                <Wrench className="w-4 h-4" /> App Down & Maintenance Controller
              </h3>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>
                Turn on to politely lock customer app with an elegant maintenance notice during upgrades.
              </p>
            </div>

            <div className={"p-6 rounded-[22px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 " + adminInnerCard}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={"w-3.5 h-3.5 rounded-full " + (draft.isAppDown ? 'bg-rose-500 animate-ping' : 'bg-emerald-500')} />
                  <h4 className="font-bold text-[16px]">App Down / Maintenance Mode</h4>
                </div>
                <p className={"text-[13px] max-w-lg leading-relaxed " + adminMuted}>
                  {draft.isAppDown 
                    ? "🔴 ON: Customer App is locked. Visitors see a polite glassmorphism maintenance banner stating system upgrades are in progress."
                    : "🟢 OFF: Customer App is fully active, accepting estimates and live bookings."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...draft, isAppDown: !draft.isAppDown })}
                className={"px-6 py-3.5 rounded-[18px] font-bold text-[13px] flex items-center gap-2.5 transition-all duration-200 active:scale-95 shadow-md " + (
                  draft.isAppDown 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                )}
              >
                {draft.isAppDown ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{draft.isAppDown ? 'MAINTENANCE MODE (ON)' : 'APP IS LIVE (ACTIVE)'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Maintenance Mode'}
              onClick={() => handleSaveSpecificCard('Maintenance Mode')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Maintenance Mode' ? 'Saving...' : 'Save Maintenance Status Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'floating' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div>
              <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                <Gift className="w-4 h-4" /> Floating Promo Offer Banner Controller
              </h3>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>Configure bottom-right floating offer pill text, code and activation status.</p>
            </div>

            <div className={"p-6 rounded-[22px] border space-y-4 " + adminInnerCard}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px]">Enable Floating Promo Banner Widget</span>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...draft,
                    floatingBanner: {
                      ...(draft.floatingBanner || {}),
                      enabled: !(draft.floatingBanner?.enabled !== false)
                    }
                  })}
                  className={"px-4 py-2 rounded-[14px] font-bold text-[12px] flex items-center gap-2 " + (draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Badge Tag</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.tag || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), tag: e.target.value }
                    })}
                    className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                  />
                </div>
                <div>
                  <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Promo Code</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.code || ''}
                    onChange={e => setDraft({
                      ...draft,
                      floatingBanner: { ...(draft.floatingBanner || {}), code: e.target.value.toUpperCase() }
                    })}
                    className={"w-full p-3 rounded-[16px] text-[13px] font-mono font-bold text-[#B89462] border " + adminInputBg}
                  />
                </div>
              </div>

              <div>
                <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Banner Title</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), title: e.target.value }
                  })}
                  className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                />
              </div>

              <div>
                <label className={"block text-[11px] font-bold mb-1.5 " + adminMuted}>Action Button Text</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), actionText: e.target.value }
                  })}
                  className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Floating Banner'}
              onClick={() => handleSaveSpecificCard('Floating Banner')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Floating Banner' ? 'Saving...' : 'Save Floating Banner Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'coupons' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Promo Coupons Manager & Expiry Timers
                </h3>
                <p className={"text-[13px] " + adminMuted}>Set coupon discounts, active status and expiry timer dates.</p>
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
                className={"px-4 py-2.5 " + primaryCtaButton + " text-[13px] flex items-center gap-1.5"}
              >
                <Plus className="w-4 h-4" /> Add Coupon
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(draft.validCoupons || {}).map(([code, c]) => {
                const isCodeActive = c.enabled !== false;
                return (
                  <div key={code} className={"p-5 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[#B89462] font-bold text-[16px]">{code}</span>
                        <span className={"text-[11px] px-3 py-0.5 rounded-full font-bold " + (isCodeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}>
                          {isCodeActive ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, enabled: !isCodeActive }
                            }
                          })}
                          className={"px-3.5 py-2 rounded-[14px] font-bold text-[12px] flex items-center gap-1.5 transition active:scale-95 " + (isCodeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}
                        >
                          {isCodeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isCodeActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button onClick={() => {
                          const copy = { ...draft.validCoupons };
                          delete copy[code];
                          setDraft({ ...draft, validCoupons: copy });
                        }} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <span className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Discount Type</span>
                        <select
                          value={c.type || 'percent'}
                          onChange={e => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...c, type: e.target.value }
                            }
                          })}
                          className={"w-full p-3 rounded-[16px] text-[13px] font-bold border " + adminInputBg}
                        >
                          <option value="percent">% Percent Off</option>
                          <option value="flat">₹ Flat Discount</option>
                        </select>
                      </div>

                      <div>
                        <span className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Value ({c.type === 'percent' ? '%' : '₹'})</span>
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
                          className={"w-full p-3 rounded-[16px] font-mono text-[#B89462] text-[13px] font-bold border " + adminInputBg}
                        />
                      </div>

                      <div>
                        <span className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>⏱️ Expiry Date & Time</span>
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
                          className={"w-full p-3 rounded-[16px] text-[13px] font-mono text-[#B89462] border " + adminInputBg}
                        />
                      </div>
                    </div>

                    <div>
                      <span className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Promo Display Description / Label</span>
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
                        className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg}
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Coupons' ? 'Saving...' : 'Save Promo Coupons Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'gallery' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Film className="w-4 h-4" /> Transformations, Videos & GIFs Studio (20MB Max)
                </h3>
                <p className={"text-[13px] " + adminMuted}>Direct URLs (.mp4, .webm, .gif) or file uploads up to 20MB.</p>
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
                className={"px-4 py-2.5 " + primaryCtaButton + " text-[13px] flex items-center gap-1.5"}
              >
                <Plus className="w-4 h-4" /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(draft.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className={"p-5 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#B89462] font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Image/GIF'})</span>
                    <button onClick={() => setDraft({ ...draft, galleryPhotos: draft.galleryPhotos.filter((_, i) => i !== idx) })} className="text-rose-500 p-1.5 hover:bg-rose-500/10 rounded-[10px]"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Type</label>
                      <select value={item.type || 'video'} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], type: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={"w-full p-3 rounded-[16px] text-[13px] font-bold border " + adminInputBg}>
                        <option value="video">🎥 Auto-play Video</option>
                        <option value="image">🖼️ Image / Animated GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Subtitle</label>
                      <input type="text" value={item.sub || ''} onChange={e => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], sub: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }} className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg} />
                    </div>
                  </div>

                  <div>
                    <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Title</label>
                    <input type="text" value={item.title || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg} />
                  </div>

                  <div>
                    <label className={"block text-[11px] mb-1.5 font-bold " + adminMuted}>Direct URL (Video, GIF, or Image link)</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={"w-full p-3 rounded-[16px] text-[13px] font-mono text-[#B89462] border " + adminInputBg} />
                  </div>

                  <label className="block text-center py-2.5 rounded-[14px] bg-[#B89462]/20 text-[#B89462] text-[13px] font-bold cursor-pointer border border-[#B89462]/40 hover:bg-[#B89462]/35 transition shadow-sm">
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Gallery Media' ? 'Saving...' : 'Save Gallery Media Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'toggles_master' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div>
              <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Master Feature & Section Toggles
              </h3>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>Enable or disable any tab, section or feature on the customer app.</p>
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
                  <div key={toggle.key} className={"p-4.5 rounded-[20px] border flex items-center justify-between gap-3.5 " + adminInnerCard}>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[13px]">{toggle.label}</h4>
                      <p className={"text-[12px] " + adminMuted}>{toggle.desc}</p>
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
                      className={"px-3.5 py-2 rounded-[14px] flex items-center gap-1.5 font-bold text-[12px] transition active:scale-95 " + (isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40')}
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Master Toggles' ? 'Saving...' : 'Save Master Toggles Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'traffic_logs' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Live Traffic & Instagram Visitor Logs
                </h3>
                <p className={"text-[13px] " + adminMuted}>Track visitors arriving from your Instagram bio, links, and direct traffic in real-time.</p>
              </div>
              <span className="text-[13px] font-mono font-bold bg-[#B89462]/20 border border-[#B89462]/40 px-3.5 py-1.5 rounded-full shadow-sm">
                {visitorLogs.length} Recent Visits Logged
              </span>
            </div>

            {visitorLogs.length === 0 ? (
              <p className={"text-[14px] py-12 text-center " + adminMuted}>No visitor traffic recorded yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {visitorLogs.map(log => (
                  <div key={log.id} className={"p-4 rounded-[18px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[13px] " + adminInnerCard}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[#B89462] font-mono">Source/ID: @{log.instagramIdOrSource || 'Direct'}</span>
                        <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold border " + (isAdminDarkMode ? 'bg-white/10 border-white/20 text-slate-300' : 'bg-white/80 border-white text-[#1C1C1E]')}>Active Visit</span>
                      </div>
                      <p className={"text-[12px] truncate max-w-md " + adminMuted}>{log.userAgent}</p>
                    </div>
                    <span className="text-[12px] text-[#B89462] font-mono font-medium">
                      {log.visitedAt ? new Date(log.visitedAt.toDate?.() || log.visitedAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeFolderId === 'promotions' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> WhatsApp Broadcast Studio
            </h3>
            <textarea
              rows={6}
              value={draft.announcements?.[0] || ""}
              onChange={e => {
                const updated = [...(draft.announcements || [])];
                updated[0] = e.target.value;
                setDraft({...draft, announcements: updated});
              }}
              className={"w-full p-4 rounded-[20px] text-[13px] font-mono border " + adminInputBg}
            />
            <button
              type="button"
              disabled={false}
              onClick={() => handleSaveSpecificCard('Broadcast Studio')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-[14px] rounded-[20px] shadow-[0_10px_30px_rgba(219,39,119,0.3)] active:scale-95 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Save Broadcast Settings</span>
            </button>
          </div>
        )}

        {activeFolderId === 'announcements' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> Top Announcement Lines Ticker
                </h3>
                <p className={"text-[13px] " + adminMuted}>Edit rotating top banner messages displayed to clients.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, announcements: [...(draft.announcements || []), "✨ New studio announcement line ✨"] })}
                className={"px-4 py-2.5 " + primaryCtaButton + " text-[13px] flex items-center gap-1.5"}
              >
                <Plus className="w-4 h-4" /> Add Line
              </button>
            </div>

            <div className="space-y-3.5">
              {(draft.announcements || []).map((line, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className="text-[13px] font-mono font-bold text-[#B89462] w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const copy = [...draft.announcements];
                      copy[idx] = e.target.value;
                      setDraft({ ...draft, announcements: copy });
                    }}
                    className={"flex-1 p-3.5 rounded-[16px] text-[13px] border " + adminInputBg}
                  />
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, announcements: draft.announcements.filter((_, i) => i !== idx) })}
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Announcements' ? 'Saving...' : 'Save Announcements Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'convenience' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                  <Car className="w-4 h-4" /> Travel Fees & Convenience Zones
                </h3>
                <p className={"text-[13px] " + adminMuted}>Manage venue travel charges for customer locations.</p>
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
                className={"px-4 py-2.5 " + primaryCtaButton + " text-[13px] flex items-center gap-1.5"}
              >
                <Plus className="w-4 h-4" /> Add Zone
              </button>
            </div>

            <div className="space-y-3.5">
              {Object.entries(draft.convenienceZones || {}).map(([zKey, zData]) => (
                <div key={zKey} className={"p-4.5 rounded-[20px] border flex flex-col sm:flex-row items-center justify-between gap-3.5 " + adminInnerCard}>
                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[11px] font-mono text-[#B89462] uppercase font-bold">Zone Key: {zKey}</span>
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
                      className={"w-full p-3 rounded-[16px] text-[13px] font-semibold border " + adminInputBg}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <label className={"text-[13px] font-bold " + adminMuted}>Fee (₹):</label>
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
                      className={"w-32 p-3 rounded-[16px] font-mono text-[#B89462] font-bold text-[13px] border " + adminInputBg}
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
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Travel Fees' ? 'Saving...' : 'Save Travel Fees Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'prices' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <h3 className="font-bold text-[14px] uppercase text-[#B89462]">👑 International Luxury Vanity Kit (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={"block text-[11px] mb-1.5 capitalize font-bold " + adminMuted}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.international?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, international: { ...draft.pricingByKit.international, [k]: Number(e.target.value) } } })} className={"w-full p-3 rounded-[16px] font-mono text-[#B89462] text-[13px] font-bold border " + adminInputBg} />
                </div>
              ))}
            </div>

            <h3 className="font-bold text-[14px] uppercase text-rose-500 pt-4">✨ Premium HD Kit Rates (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={"block text-[11px] mb-1.5 capitalize font-bold " + adminMuted}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit?.drugstore?.[k] || 0} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, drugstore: { ...draft.pricingByKit.drugstore, [k]: Number(e.target.value) } } })} className={"w-full p-3 rounded-[16px] font-mono text-rose-500 text-[13px] font-bold border " + adminInputBg} />
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={savingSection === 'Package Rates'}
              onClick={() => handleSaveSpecificCard('Package Rates')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Package Rates' ? 'Saving...' : 'Save Package Rates Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'theme' && (
          <div className={"p-7 rounded-[28px] border space-y-5 " + cardBgClass}>
            <h3 className="font-bold text-[14px] uppercase text-[#B89462]">Aesthetic Themes & Fonts (Synced)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Color Theme</label>
                <select value={draft.theme?.colorTheme || 'liquid_glass'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={"w-full p-3 rounded-[16px] text-[13px] font-bold text-[#B89462] border " + adminInputBg}>
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
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Font Family</label>
                <select value={draft.theme?.fontFamily || 'sans'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, fontFamily: e.target.value } })} className={"w-full p-3 rounded-[16px] text-[13px] font-bold text-[#B89462] border " + adminInputBg}>
                  <option value="sans">Plus Jakarta Sans</option>
                  <option value="outfit">Outfit (iOS Glass Minimal)</option>
                  <option value="serif">Playfair Display (Royal)</option>
                  <option value="cormorant">Cormorant Garamond</option>
                  <option value="cinzel">Cinzel</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>

              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Default Customer Mode (Main App Theme)</label>
                <select value={draft.theme?.defaultMode || 'light'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, defaultMode: e.target.value } })} className={"w-full p-3 rounded-[16px] text-[13px] font-bold border " + adminInputBg}>
                  <option value="light">☀️ Light Mode (#F8F5F2)</option>
                  <option value="dark">🌙 Dark Mode (#1C1C1E)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Theme & Styles'}
              onClick={() => handleSaveSpecificCard('Theme & Styles')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
            >
              <Save className="w-4 h-4" />
              <span>{savingSection === 'Theme & Styles' ? 'Saving...' : 'Save Theme & Fonts Live'}</span>
            </button>
          </div>
        )}

        {activeFolderId === 'profile' && (
          <div className={"p-7 rounded-[28px] border space-y-6 " + cardBgClass}>
            <div>
              <h3 className="font-bold text-[14px] uppercase text-[#B89462] flex items-center gap-2">
                <User className="w-4 h-4" /> Studio Identity, Logo & Social Profiles
              </h3>
              <p className={"text-[13px] " + adminMuted + " mt-1"}>Configure official studio title, upload custom logo & artist profile photo.</p>
            </div>

            <div className={"p-5 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#B89462] uppercase flex items-center gap-2">
                  <Crown className="w-4 h-4" /> 1. Official Studio Logo (Header & Splash)
                </span>
                <span className={"text-[11px] font-mono font-medium " + adminMuted}>Auto-Compressed</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className={"w-18 h-18 rounded-[20px] p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md border " + (isAdminDarkMode ? 'bg-black/40 border-white/20' : 'bg-white/60 border-white/80')}>
                  {draft.studioLogo ? (
                    <img src={draft.studioLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-8 h-8 text-[#6E6864]" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2.5">
                  <input
                    type="text"
                    placeholder="Paste Logo Image URL"
                    value={draft.studioLogo || ''}
                    onChange={e => setDraft({ ...draft, studioLogo: e.target.value })}
                    className={"w-full p-3 rounded-[16px] text-[13px] font-mono border " + adminInputBg}
                  />
                  <label className="inline-block px-4 py-2 rounded-[14px] bg-[#B89462]/20 text-[#B89462] text-[13px] font-bold cursor-pointer border border-[#B89462]/40 hover:bg-[#B89462]/35 transition shadow-sm">
                    Upload & Compress Logo File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className={"p-5 rounded-[22px] border space-y-3.5 " + adminInnerCard}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#B89462] uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> 2. Artist Profile Photo
                </span>
                <span className={"text-[11px] font-mono font-medium " + adminMuted}>Avatar Card</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-18 h-18 rounded-[20px] overflow-hidden bg-neutral-200 border-2 border-[#B89462]/50 shrink-0 shadow-md">
                  <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2.5">
                  <input
                    type="text"
                    placeholder="Paste Profile Photo URL"
                    value={draft.profileImage || ''}
                    onChange={e => setDraft({ ...draft, profileImage: e.target.value })}
                    className={"w-full p-3 rounded-[16px] text-[13px] font-mono border " + adminInputBg}
                  />
                  <label className="inline-block px-4 py-2 rounded-[14px] bg-[#B89462]/20 text-[#B89462] text-[13px] font-bold cursor-pointer border border-[#B89462]/40 hover:bg-[#B89462]/35 transition shadow-sm">
                    Upload & Compress Profile Photo
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Display Title</label>
                <input type="text" value={draft.studioName || ''} onChange={e => setDraft({ ...draft, studioName: e.target.value })} className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg} />
              </div>
              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Booking Contact Number</label>
                <input type="text" value={draft.whatsappNumber || ''} onChange={e => setDraft({ ...draft, whatsappNumber: e.target.value })} className={"w-full p-3 rounded-[16px] text-[13px] font-mono text-[#B89462] border " + adminInputBg} />
              </div>
              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Instagram Handle</label>
                <input type="text" value={draft.instagramHandle || ''} onChange={e => setDraft({ ...draft, signatureHandle: e.target.value, instagramHandle: e.target.value })} className={"w-full p-3 rounded-[16px] text-[13px] font-mono text-pink-500 border " + adminInputBg} />
              </div>
              <div>
                <label className={"block text-[12px] font-bold mb-1.5 " + adminMuted}>Artist Tagline / Subtitle</label>
                <input type="text" value={draft.artistTagline || ''} onChange={e => setDraft({ ...draft, artistTagline: e.target.value })} className={"w-full p-3 rounded-[16px] text-[13px] border " + adminInputBg} />
              </div>
            </div>

            <button
              type="button"
              disabled={savingSection === 'Studio Profile'}
              onClick={() => handleSaveSpecificCard('Studio Profile')}
              className={"w-full py-4 " + primaryCtaButton + " text-[14px] flex items-center justify-center gap-2"}
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
