import React, { useState, useEffect } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight,
  Sliders, Palette, MapPin, Eye, ChevronDown, ListFilter, Car, Volume2, Activity,
  SlidersHorizontal, CheckCircle2, XCircle, Clock, Gift, AlertCircle
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig, db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';

const DEFAULT_CONFIG = {
  adminPin: "8760",
  studioName: "HUSNA FAROOQUI",
  artistTagline: "Celebrity & Bridal Makeup Artist",
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

  // 🎛️ Master Feature Toggles
  toggles: {
    enableAnnouncements: true,
    enableCoupons: true,
    enableGuestDiscount: true,
    enableFloatingBanner: true,
    enableGallery: true,
    enableBrands: true,
    enableEstimator: true
  },

  // 🎈 Floating Offer Banner Controls
  floatingBanner: {
    enabled: true,
    autoHideOnExpire: false, // true: Hides on expire | false: Shows "Code Expired"
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

const DEFAULT_TEMPLATES = [
  { id: 1, title: "Wedding Season 15% OFF", text: "✨ *Special Wedding Season Offer - Husna Farooqui Studio* ✨\n\nBook your Signature Bridal Look this week and get *Flat 15% OFF* + complimentary lash extension!\n\nUse Code: *WEDDING15*\nBook Online: https://your-domain.com" },
  { id: 2, title: "Weekend Party Glam Flash Offer", text: "💄 *Flash Weekend Glam Offer!* 💄\n\nBook Super HD Party Makeup for 2 or more family members and get 1 Party Look at *50% OFF*!\n\nContact: +919997210876" }
];

const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
const bridalPackages = ['engagement_bride', 'royal_bridal'];

// 📋 Admin Glass Tab List
const ADMIN_TABS = [
  { id: 'bookings', label: '📋 Live Bookings' },
  { id: 'floating', label: '🎈 Floating Banner' },
  { id: 'coupons', label: '🏷️ Promo Coupons' },
  { id: 'toggles_master', label: '🎛️ Master Toggles' },
  { id: 'packages_text', label: '✏️ Package Titles' },
  { id: 'kit_images', label: '🖼️ Package Images' },
  { id: 'traffic_logs', label: '📊 Visitor Logs' },
  { id: 'gallery', label: '📸 Videos & GIFs' },
  { id: 'promotions', label: '📢 WhatsApp Studio' },
  { id: 'announcements', label: '📢 Announcements' },
  { id: 'convenience', label: '🚗 Travel Fees' },
  { id: 'prices', label: '💄 Package Rates' },
  { id: 'theme', label: '🎨 Themes & Fonts' },
  { id: 'profile', label: '📱 Profile' }
];

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [editingKitTab, setEditingKitTab] = useState('international');
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [bookingsList, setBookingsList] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [promoTemplates, setPromoTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplateText, setSelectedTemplateText] = useState(DEFAULT_TEMPLATES[0].text);
  const [customNumbersInput, setCustomNumbersInput] = useState('');
  const [sendingPromo, setSendingPromo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionStatus, setActionStatus] = useState('');

  const BAILEYS_URL = "http://localhost:3005";

  useEffect(() => {
    async function load() {
      const data = await fetchLiveConfig(DEFAULT_CONFIG);
      setDraft(data);
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
    if (pinInput === (draft.adminPin || "8760")) setIsAuthenticated(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setActionStatus('');
    try {
      const cleanData = JSON.parse(JSON.stringify(draft));
      await updateLiveConfig(cleanData);
      setActionStatus('🎉 All settings, floating banner rules, images & rates pushed live!');
    } catch (err) {
      setActionStatus('❌ Error saving: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptBooking = async (b) => {
    setActionStatus(`Sending confirmation to ${b.clientName}...`);
    try {
      const confirmMessage = 
        `🎉 *APPOINTMENT CONFIRMED - HUSNA FAROOQUI MAKEUP STUDIO* 🎉\n\n` +
        `Dear *${b.clientName}*,\n` +
        `Your appointment has been officially confirmed!\n\n` +
        `📅 *Date:* ${b.eventDate}\n` +
        `💄 *Package:* ${b.packageName}\n` +
        `💎 *Vanity Kit:* ${b.kitType}\n` +
        `📍 *Location:* ${b.zoneName}\n` +
        `🏠 *Venue:* ${b.venueAddress}\n` +
        `💰 *Estimated Total:* ₹${b.totalAmount?.toLocaleString('en-IN')}\n\n` +
        `We look forward to creating your flawless signature look!`;

      await fetch(`${BAILEYS_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: b.clientPhone, message: confirmMessage })
      });

      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed" });
      setActionStatus(`✅ Delivered WhatsApp confirmation to ${b.clientName}!`);
    } catch (err) {
      setActionStatus(`⚠️ Baileys Gateway offline or error: ${err.message}`);
    }
  };

  const handleMediaUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2500000) {
        alert("File size is larger than 2.5MB. For smooth performance, please paste a direct video link or use a compressed clip/GIF.");
        return;
      }
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onloadend = () => {
        const copy = [...(draft.galleryPhotos || [])];
        copy[index] = {
          title: copy[index]?.title || "Signature Transformation",
          sub: copy[index]?.sub || "HD Artistry",
          url: String(reader.result),
          type: isVid ? 'video' : 'image'
        };
        setDraft({ ...draft, galleryPhotos: copy });
        setActionStatus(`Loaded ${isVid ? 'Video' : 'Image/GIF'} file. Click 'Save All Changes' to publish.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePackageImageUpload = (e, kit, pkgKey) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2500000) {
        alert("Image size is larger than 2.5MB. Please choose a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({
          ...draft,
          kitImages: {
            ...draft.kitImages,
            [kit]: {
              ...(draft.kitImages?.[kit] || {}),
              [pkgKey]: String(reader.result)
            }
          }
        });
        setActionStatus(`Loaded new image for ${pkgKey}. Click 'Save All Changes' to publish.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({ ...draft, profileImage: reader.result, profilePhotoType: 'image' });
      };
      reader.readAsDataURL(file);
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

  const adminBgClass = isAdminDarkMode ? "bg-[#030712] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]";
  const adminCardBg = isAdminDarkMode ? "bg-white/[0.04] backdrop-blur-3xl border border-white/10 shadow-2xl text-[#f8fafc]" : "bg-white border border-slate-200 shadow-lg text-[#0f172a]";
  const adminInnerCard = isAdminDarkMode ? "bg-black/40 border border-white/10 text-[#f8fafc]" : "bg-slate-50 border border-slate-200 text-[#0f172a]";
  const adminInputBg = isAdminDarkMode ? "bg-black/40 border border-white/20 text-white placeholder-slate-400" : "bg-white border border-slate-300 text-slate-900 placeholder-slate-500";
  const adminMuted = isAdminDarkMode ? "text-slate-400" : "text-slate-600";

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${adminBgClass} flex items-center justify-center p-4`}>
        <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-3xl border text-center space-y-4 shadow-2xl ${adminCardBg}`}>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
            <Lock className="w-7 h-7 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <p className={`text-xs ${adminMuted}`}>Master Studio Management Console</p>
          <input type="password" placeholder="PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className={`w-full text-center text-lg p-3 rounded-2xl font-mono text-cyan-400 ${adminInputBg}`} />
          <button type="submit" className="w-full py-3 bg-cyan-500 text-neutral-950 font-bold text-xs rounded-2xl shadow-lg active:scale-95">Unlock Console</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${adminBgClass} font-sans pb-28 transition-colors duration-300`}>
      
      {/* 💎 Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-3xl border-b px-4 sm:px-8 py-3.5 flex justify-between items-center ${isAdminDarkMode ? 'bg-[#080d1e]/80 border-white/10' : 'bg-white/85 border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm">{draft.studioName || "HUSNA FAROOQUI"} Console</h1>
            <p className={`text-[11px] ${adminMuted}`}>Live Firebase Synced Admin Console</p>
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
        
        {/* 🚀 Sleek Horizontal Scrollable Tabs Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200/40 dark:border-white/10 scrollbar-thin">
          {ADMIN_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 shadow-lg shadow-cyan-500/25 border border-white/30' 
                    : `${adminMuted} hover:text-cyan-400 bg-white/[0.04] border border-white/5`
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {actionStatus && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs text-center animate-fade-in shadow-lg">
            {actionStatus}
          </div>
        )}

        {/* TAB 1: INCOMING BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">Incoming Customer Bookings</h3>
            {bookingsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No bookings received yet. Submissions will appear here instantly!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingsList.map(b => (
                  <div key={b.id} className={`p-5 rounded-3xl border space-y-3 ${adminInnerCard}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {b.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                        </span>
                        <h4 className="font-bold text-base mt-2">{b.clientName}</h4>
                        <p className="text-xs text-slate-400 font-mono">📞 {b.clientPhone}</p>
                      </div>
                      <button onClick={() => deleteDoc(doc(db, "bookings", b.id))} className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="text-xs space-y-1 border-t border-b border-white/10 py-2">
                      <div className="flex justify-between"><span className={adminMuted}>Date:</span><strong className="text-amber-400">{b.eventDate}</strong></div>
                      <div className="flex justify-between"><span className={adminMuted}>Package:</span><span>{b.packageName}</span></div>
                      <div className="flex justify-between"><span className={adminMuted}>Total:</span><strong className="text-cyan-400 font-mono">₹{b.totalAmount?.toLocaleString('en-IN')}</strong></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAcceptBooking(b)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{b.status === 'confirmed' ? 'Resend WhatsApp Alert' : 'Accept & Send WhatsApp Alert'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FLOATING BANNER CONTROLS (EXPIRY & AUTO-HIDE LOGIC) */}
        {activeTab === 'floating' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${adminCardBg}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Gift className="w-4 h-4" /> Bottom Floating Offer Banner Controls
                </h3>
                <p className={`text-xs ${adminMuted} mt-0.5`}>
                  Edit floating banner text, linked promo code, and choose whether to auto-hide or show "Code Expired".
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({
                  ...draft,
                  floatingBanner: {
                    ...(draft.floatingBanner || {}),
                    enabled: draft.floatingBanner?.enabled === false ? true : false
                  }
                })}
                className={`p-2 rounded-xl flex items-center gap-1.5 font-bold text-xs transition active:scale-95 ${
                  draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{draft.floatingBanner?.enabled !== false ? 'WIDGET ACTIVE' : 'WIDGET DISABLED'}</span>
              </button>
            </div>

            {/* Auto-Hide on Expire Toggle */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${adminInnerCard}`}>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-white">Auto-Hide Widget When Code Expires</h4>
                <p className={`text-[11px] ${adminMuted}`}>
                  {draft.floatingBanner?.autoHideOnExpire !== false 
                    ? "🟢 ON: Banner automatically disappears from screen once the linked coupon code expires." 
                    : "🔴 OFF: Banner stays visible, but displays '⚠️ Code Expired' badge and disables button."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDraft({
                  ...draft,
                  floatingBanner: {
                    ...(draft.floatingBanner || {}),
                    autoHideOnExpire: draft.floatingBanner?.autoHideOnExpire === false ? true : false
                  }
                })}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${
                  draft.floatingBanner?.autoHideOnExpire !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {draft.floatingBanner?.autoHideOnExpire !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{draft.floatingBanner?.autoHideOnExpire !== false ? 'Auto-Hide (ON)' : 'Show "Expired" (OFF)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${adminMuted}`}>Badge Tag Text</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.tag || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), tag: e.target.value }
                  })}
                  placeholder="e.g. SPECIAL OFFER"
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-cyan-400 border ${adminInputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${adminMuted}`}>Linked Promo Code</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.code || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), code: e.target.value.toUpperCase() }
                  })}
                  placeholder="e.g. BRIDE2026"
                  className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold text-amber-400 border ${adminInputBg}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-[11px] font-bold mb-1 ${adminMuted}`}>Banner Headline / Title</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.title || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), title: e.target.value }
                  })}
                  placeholder="e.g. Flat 10% OFF Signature Bridal Look"
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${adminInputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${adminMuted}`}>Button Action Text</label>
                <input
                  type="text"
                  value={draft.floatingBanner?.actionText || ''}
                  onChange={e => setDraft({
                    ...draft,
                    floatingBanner: { ...(draft.floatingBanner || {}), actionText: e.target.value }
                  })}
                  placeholder="e.g. Apply"
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border ${adminInputBg}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROMO COUPONS & EXPIRY TIMERS */}
        {activeTab === 'coupons' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Promo Coupons Manager & Expiry Timers
                </h3>
                <p className={`text-xs ${adminMuted}`}>Set coupon discounts, redemption limits, active status and expiry timer dates.</p>
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
                        <span className={`block text-[10px] mb-1 ${adminMuted}`}>⏱️ Expiry Date & Time (Countdown Timer)</span>
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
          </div>
        )}

        {/* TAB 4: MASTER FEATURE TOGGLES */}
        {activeTab === 'toggles_master' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" /> Master Feature & Section Toggles
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>Enable or disable any section, widget or feature on the live main customer app.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
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
          </div>
        )}

        {/* TAB 5: PACKAGE TITLES & TEXT EDITOR */}
        {activeTab === 'packages_text' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${adminCardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Type className="w-4 h-4" /> Package Titles & Text Editor (Kit-Wise)
                </h3>
                <p className={`text-xs ${adminMuted} mt-0.5`}>Customise package titles and descriptions separately for International Luxury vs Premium HD kits.</p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-black/50 border border-white/10 gap-1 self-start">
                <button
                  type="button"
                  onClick={() => setEditingKitTab('international')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editingKitTab === 'international' ? 'bg-cyan-500 text-neutral-950 shadow' : 'text-slate-400'}`}
                >
                  👑 International Luxury Kit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKitTab('drugstore')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editingKitTab === 'drugstore' ? 'bg-cyan-500 text-neutral-950 shadow' : 'text-slate-400'}`}
                >
                  ✨ Premium HD Kit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partyPackages.concat(bridalPackages).map(k => {
                const pkg = draft.kitText?.[editingKitTab]?.[k] || DEFAULT_CONFIG.kitText[editingKitTab][k];
                return (
                  <div key={`${editingKitTab}_${k}`} className={`p-4 rounded-2xl border space-y-2.5 ${adminInnerCard}`}>
                    <label className="block text-xs font-bold text-cyan-400 capitalize">{k.replace(/_/g, ' ')} ({editingKitTab === 'international' ? 'Luxury' : 'HD Kit'})</label>
                    <div>
                      <span className={`block text-[10px] mb-1 ${adminMuted}`}>Package Display Name</span>
                      <input
                        type="text"
                        value={pkg.name || ''}
                        onChange={e => setDraft({
                          ...draft,
                          kitText: {
                            ...(draft.kitText || {}),
                            [editingKitTab]: {
                              ...(draft.kitText?.[editingKitTab] || {}),
                              [k]: { ...pkg, name: e.target.value }
                            }
                          }
                        })}
                        className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}
                      />
                    </div>
                    <div>
                      <span className={`block text-[10px] mb-1 ${adminMuted}`}>Description / Details Text</span>
                      <textarea
                        rows={2}
                        value={pkg.desc || ''}
                        onChange={e => setDraft({
                          ...draft,
                          kitText: {
                            ...(draft.kitText || {}),
                            [editingKitTab]: {
                              ...(draft.kitText?.[editingKitTab] || {}),
                              [k]: { ...pkg, desc: e.target.value }
                            }
                          }
                        })}
                        className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: PACKAGE IMAGES & SEPARATE KIT PHOTOS */}
        {activeTab === 'kit_images' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${adminCardBg}`}>
            <div>
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Separate Package Images (Luxury Kit vs HD Kit)
              </h3>
              <p className={`text-xs ${adminMuted} mt-0.5`}>Upload any format photo or paste image URL for each package.</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-4 ${adminInnerCard}`}>
              <h4 className="font-bold text-xs text-amber-400 uppercase">👑 1. International Luxury Kit Photos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {partyPackages.concat(bridalPackages).map(k => (
                  <div key={k} className="p-3 rounded-xl border border-white/10 space-y-2">
                    <label className={`block text-[10px] capitalize font-bold ${adminMuted}`}>{k.replace(/_/g, ' ')}</label>
                    <input
                      type="text"
                      placeholder="Paste Image URL"
                      value={draft.kitImages?.international?.[k] || ''}
                      onChange={e => setDraft({
                        ...draft,
                        kitImages: {
                          ...draft.kitImages,
                          international: { ...(draft.kitImages?.international || {}), [k]: e.target.value }
                        }
                      })}
                      className={`w-full p-2 rounded-xl text-xs font-mono text-cyan-300 border ${adminInputBg}`}
                    />
                    <label className="block text-center py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] font-bold cursor-pointer border border-amber-500/30 hover:bg-amber-500/25">
                      Upload Any Image File
                      <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, 'international', k)} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-4 ${adminInnerCard}`}>
              <h4 className="font-bold text-xs text-rose-400 uppercase">✨ 2. Premium HD Kit Photos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {partyPackages.concat(bridalPackages).map(k => (
                  <div key={k} className="p-3 rounded-xl border border-white/10 space-y-2">
                    <label className={`block text-[10px] capitalize font-bold ${adminMuted}`}>{k.replace(/_/g, ' ')}</label>
                    <input
                      type="text"
                      placeholder="Paste Image URL"
                      value={draft.kitImages?.drugstore?.[k] || ''}
                      onChange={e => setDraft({
                        ...draft,
                        kitImages: {
                          ...draft.kitImages,
                          drugstore: { ...(draft.kitImages?.drugstore || {}), [k]: e.target.value }
                        }
                      })}
                      className={`w-full p-2 rounded-xl text-xs font-mono text-cyan-300 border ${adminInputBg}`}
                    />
                    <label className="block text-center py-1.5 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] font-bold cursor-pointer border border-rose-500/30 hover:bg-rose-500/25">
                      Upload Any Image File
                      <input type="file" accept="image/*" onChange={e => handlePackageImageUpload(e, 'drugstore', k)} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: VISITOR TRAFFIC & INSTAGRAM LOGS */}
        {activeTab === 'traffic_logs' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
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

        {/* TAB 8: TRANSFORMATIONS, VIDEOS & GIFS */}
        {activeTab === 'gallery' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> Transformations, Videos & GIFs Studio
                </h3>
                <p className={`text-xs ${adminMuted}`}>Direct URLs (.mp4, .webm, .gif) or file uploads under 2.5MB.</p>
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
                    Upload Direct Video/GIF/Image File (&lt;2.5MB)
                    <input type="file" accept="video/*,image/*,.gif" onChange={e => handleMediaUpload(e, idx)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PROMOTIONS */}
        {activeTab === 'promotions' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
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

        {/* TAB 10: TOP ANNOUNCEMENTS TICKER */}
        {activeTab === 'announcements' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
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
          </div>
        )}

        {/* TAB 11: TRAVEL FEES & CONVENIENCE ZONES */}
        {activeTab === 'convenience' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
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
          </div>
        )}

        {/* TAB 12: RATES */}
        {activeTab === 'prices' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
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
          </div>
        )}

        {/* TAB 13: THEMES & FONTS */}
        {activeTab === 'theme' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">Aesthetic Themes & Fonts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Color Theme</label>
                <select value={draft.theme?.colorTheme || 'liquid_glass'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold text-cyan-400 border ${adminInputBg}`}>
                  <option value="liquid_glass">💎 Liquid Glass iOS</option>
                  <option value="one_ui_9">✨ Samsung One UI 9</option>
                  <option value="nordic_pearl">❄️ Nordic Pearl Luxury</option>
                  <option value="sunset_rose">🌅 Sunset Rose Gold</option>
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
          </div>
        )}

        {/* TAB 14: PROFILE */}
        {activeTab === 'profile' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">Profile & Studio Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Studio Display Title</label>
                <input type="text" value={draft.studioName || ''} onChange={e => setDraft({ ...draft, studioName: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>WhatsApp Booking Number</label>
                <input type="text" value={draft.whatsappNumber || ''} onChange={e => setDraft({ ...draft, whatsappNumber: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs font-mono text-cyan-400 border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Instagram Handle</label>
                <input type="text" value={draft.instagramHandle || ''} onChange={e => setDraft({ ...draft, instagramHandle: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs font-mono text-pink-400 border ${adminInputBg}`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Profile Image URL</label>
                <input type="text" value={draft.profileImage || ''} onChange={e => setDraft({ ...draft, profileImage: e.target.value })} className={`w-full p-2.5 rounded-xl text-xs font-mono border ${adminInputBg}`} />
              </div>
            </div>
            <label className="inline-block px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-400 text-xs font-bold cursor-pointer border border-cyan-500/30 hover:bg-cyan-500/25">
              Upload New Profile Photo File
              <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Master Save Button */}
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-neutral-950 font-bold text-xs rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save All Changes Live to Customer App'}</span>
        </button>

      </div>
    </div>
  );
}
