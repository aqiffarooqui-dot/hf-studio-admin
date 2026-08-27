import React, { useState, useEffect } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, 
  Play, ExternalLink, Phone, Image as ImageIcon, Percent, ToggleLeft, ToggleRight,
  Sliders, Palette
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig, db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

  showOfferSection: true,
  enableDiscountsAndCoupons: true,
  
  floatingBanner: {
    enabled: true,
    tag: "SPECIAL WEDDING OFFER",
    title: "Flat 10% OFF Signature Bridal Look",
    code: "BRIDE2026",
    actionText: "Apply Offer"
  },

  guestDiscount: {
    enabled: true,
    discountPercent: 15
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
    "BRIDE2026": { type: "percent", value: 10, label: "10% Seasonal Wedding Discount", maxUses: 1 },
    "HUSNA15": { type: "percent", value: 15, label: "15% Special Bridal Promo", maxUses: 1 },
    "ROYAL1000": { type: "flat", value: 1000, label: "₹1,000 Flat Off on Packages", maxUses: 5 },
    "WELCOME500": { type: "flat", value: 500, label: "₹500 Flat First-Booking Offer", maxUses: "unlimited" }
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

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [bookingsList, setBookingsList] = useState([]);
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === (draft.adminPin || "8760")) setIsAuthenticated(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setActionStatus('');
    try {
      await updateLiveConfig(draft);
      setActionStatus('🎉 All media videos, gallery & settings synced live to Main App!');
    } catch (err) {
      setActionStatus('❌ Error: ' + err.message);
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

  // 📹 Universal Media Handler (Auto Video Play + Image file parser)
  const handleMediaUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onloadend = () => {
        const copy = [...(draft.galleryPhotos || [])];
        copy[index] = {
          ...copy[index],
          url: reader.result,
          type: isVid ? 'video' : 'image'
        };
        setDraft({ ...draft, galleryPhotos: copy });
        setActionStatus(`Loaded ${isVid ? 'Video' : 'Image'} file. Click 'Save All Changes' to publish live.`);
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
    <div className={`min-h-screen ${adminBgClass} font-sans pb-24 transition-colors duration-300`}>
      
      {/* Admin Header with Day/Night Switch */}
      <header className={`sticky top-0 z-40 backdrop-blur-3xl border-b px-4 sm:px-8 py-4 flex justify-between items-center ${isAdminDarkMode ? 'bg-[#080d1e]/80 border-white/10' : 'bg-white/85 border-slate-200 shadow-sm'}`}>
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
        
        {actionStatus && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs text-center animate-fade-in shadow-lg">
            {actionStatus}
          </div>
        )}

        {/* Master Nav Tabs */}
        <div className="flex gap-2 border-b pb-3 border-slate-200/40 dark:border-white/10 overflow-x-auto">
          {[
            { id: 'bookings', label: `📋 Bookings (${bookingsList.length})` },
            { id: 'gallery', label: '📸 Video & Transformations' },
            { id: 'promotions', label: '📢 WhatsApp Promotions' },
            { id: 'profile', label: '📱 Profile & Contact' },
            { id: 'theme', label: '🎨 Themes & Fonts' },
            { id: 'coupons', label: '🏷️ Promo Coupons' },
            { id: 'prices', label: '💄 Package Rates' },
            { id: 'announcements', label: '📢 Announcements' },
            { id: 'convenience', label: '🚗 Travel Fees' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                activeTab === tab.id ? 'bg-cyan-500 text-neutral-950 shadow-md font-bold' : `${adminMuted} hover:text-cyan-400 bg-white/5`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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

        {/* TAB 2: TRANSFORMATIONS & LIVE AUTO-PLAYING VIDEOS */}
        {activeTab === 'gallery' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> Media & Auto-Playing Video Studio
                </h3>
                <p className={`text-xs ${adminMuted}`}>Upload direct videos (.mp4, .webm, .mov) or transformation photos.</p>
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
                    <span className="text-xs font-bold text-cyan-400 font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Live Video' : '🖼️ Photo'})</span>
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
                        <option value="image">🖼️ Image</option>
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
                    <label className={`block text-[10px] mb-1 ${adminMuted}`}>URL or Upload File</label>
                    <input type="text" value={item.url || ''} onChange={e => {
                      const copy = [...draft.galleryPhotos];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setDraft({ ...draft, galleryPhotos: copy });
                    }} className={`w-full p-2 rounded-xl text-xs font-mono text-cyan-400 border ${adminInputBg}`} />
                  </div>

                  <label className="block text-center py-2 rounded-xl bg-cyan-500/15 text-cyan-400 text-xs font-bold cursor-pointer border border-cyan-500/30 hover:bg-cyan-500/25 transition">
                    Upload Direct Video/Image File
                    <input type="file" accept="video/*,image/*" onChange={e => handleMediaUpload(e, idx)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROMOTIONS */}
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

        {/* TAB 4: PROFILE */}
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

        {/* TAB 5: THEMES & FONTS */}
        {activeTab === 'theme' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">Aesthetic Themes & Fonts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Color Theme</label>
                <select value={draft.theme?.colorTheme || 'liquid_glass'} onChange={e => setDraft({ ...draft, theme: { ...draft.theme, colorTheme: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold text-cyan-400 border ${adminInputBg}`}>
                  <option value="liquid_glass">💎 Liquid Glass iOS (Frosted)</option>
                  <option value="one_ui_9">✨ Samsung One UI 9 Gold</option>
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
                  <option value="sans">Plus Jakarta Sans (Modern UI)</option>
                  <option value="outfit">Outfit (iOS Glass Minimal)</option>
                  <option value="serif">Playfair Display (Royal)</option>
                  <option value="cormorant">Cormorant Garamond (Luxury)</option>
                  <option value="cinzel">Cinzel (Roman Bridal)</option>
                  <option value="montserrat">Montserrat (Editorial)</option>
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

        {/* TAB 6: RATES */}
        {activeTab === 'prices' && (
          <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
            <h3 className="font-bold text-xs uppercase text-cyan-400">👑 International Luxury Vanity Kit (₹)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {partyPackages.concat(bridalPackages).map(k => (
                <div key={k}>
                  <label className={`block text-[10px] mb-1 capitalize ${adminMuted}`}>{k.replace(/_/g, ' ')}</label>
                  <input type="number" value={draft.pricingByKit.international[k]} onChange={e => setDraft({ ...draft, pricingByKit: { ...draft.pricingByKit, international: { ...draft.pricingByKit.international, [k]: Number(e.target.value) } } })} className={`w-full p-2.5 rounded-xl font-mono text-cyan-400 text-xs border ${adminInputBg}`} />
                </div>
              ))}
            </div>
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
          <span>{isSaving ? 'Syncing...' : 'Save All Changes Live to Main App'}</span>
        </button>

      </div>
    </div>
  );
}
