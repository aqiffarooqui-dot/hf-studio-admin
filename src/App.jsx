import React, { useState, useEffect } from 'react';
import { 
  Crown, Settings, Save, Lock, Plus, Trash2, ToggleLeft, ToggleRight, 
  Percent, Tag, Volume2, Car, Sparkles, RefreshCw, CheckCircle2, 
  Phone, Instagram, Palette, Type, Gift, MapPin, Eye, Sliders, Layers, 
  Image as ImageIcon, Upload, Video, Film, Play, ExternalLink, Sun, Moon,
  CalendarCheck, User, Clock, Check, X
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
    { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
    { type: "image", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80" },
    { type: "image", title: "Ultra HD Party Look", sub: "Long-Wear Flawless Base", url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80" }
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

const partyPackages = ['simple_party', 'hd_party', 'super_hd_party', 'cocktail_glam'];
const bridalPackages = ['engagement_bride', 'royal_bridal'];

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('bookings');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [bookingsList, setBookingsList] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchLiveConfig(DEFAULT_CONFIG);
      setDraft(data);
    }
    load();
  }, []);

  // Real-Time Bookings Listener from Firebase
  useEffect(() => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookingsList(list);
      }, (err) => {
        console.warn("Bookings listener:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore bookings load error:", e);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === (draft.adminPin || "8760")) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect Admin Security PIN');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');
    try {
      await updateLiveConfig(draft);
      setStatusMsg('🎉 All settings, media, coupons & rates pushed live!');
    } catch (err) {
      setStatusMsg('❌ Error saving changes: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ 1-Click Accept & Send Confirmation WhatsApp Message
  const handleAcceptBooking = async (booking) => {
    try {
      // 1. Update status in database
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "confirmed" });

      // 2. Open Free WhatsApp with Official Confirmation Message
      const clientPhoneClean = String(booking.clientPhone).replace(/[^0-9]/g, '');
      const fullPhone = clientPhoneClean.startsWith('91') ? clientPhoneClean : `91${clientPhoneClean}`;

      const confirmMessage = 
        `🎉 *APPOINTMENT CONFIRMED - ${draft.studioName || "HUSNA FAROOQUI MAKEUP STUDIO"}* 🎉\n\n` +
        `Dear *${booking.clientName}*,\n` +
        `We are thrilled to confirm your VIP booking appointment!\n\n` +
        `📅 *Confirmed Date:* ${booking.eventDate}\n` +
        `💄 *Package:* ${booking.packageName}\n` +
        `💎 *Vanity Kit:* ${booking.kitType}\n` +
        `📍 *Location Zone:* ${booking.zoneName}\n` +
        `🏠 *Venue:* ${booking.venueAddress}\n` +
        `💰 *Estimated Total:* ₹${booking.totalAmount?.toLocaleString('en-IN')}\n\n` +
        `Our team will reach out prior to the date for final schedule coordination.\n\n` +
        `_For queries: +${draft.whatsappNumber}_`;

      window.open(`https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(confirmMessage)}`, '_blank');
    } catch (err) {
      alert("Error confirming booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (confirm("Are you sure you want to delete this booking record?")) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
      } catch (err) {
        alert("Error deleting: " + err.message);
      }
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({ ...draft, profileImage: reader.result, profilePhotoType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryMediaUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const copy = [...(draft.galleryPhotos || [])];
        copy[index] = {
          ...copy[index],
          url: reader.result,
          type: file.type.startsWith('video') ? 'video' : 'image'
        };
        setDraft({ ...draft, galleryPhotos: copy });
      };
      reader.readAsDataURL(file);
    }
  };

  const adminBgClass = isAdminDarkMode ? "bg-[#030712] text-[#f8fafc]" : "bg-[#f4f6fa] text-[#0f172a]";
  const adminCardBg = isAdminDarkMode ? "bg-white/[0.04] backdrop-blur-3xl border-white/10" : "bg-white border-slate-200 shadow-md";
  const adminInnerCard = isAdminDarkMode ? "bg-black/40 border-white/10" : "bg-slate-50 border-slate-200";
  const adminInputBg = isAdminDarkMode ? "bg-black/40 border-white/20 text-white" : "bg-white border-slate-300 text-slate-900";
  const adminMuted = isAdminDarkMode ? "text-slate-400" : "text-slate-600";

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${adminBgClass} flex items-center justify-center p-4 font-sans`}>
        <form onSubmit={handleLogin} className={`max-w-sm w-full p-8 rounded-3xl text-center space-y-5 shadow-2xl border ${adminCardBg}`}>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{draft.studioName || "HUSNA FAROOQUI"}</h2>
            <p className={`text-xs ${adminMuted} mt-1`}>Master Studio Management Console</p>
          </div>
          <input
            type="password"
            maxLength={6}
            placeholder="Enter Admin PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className={`w-full text-center text-lg tracking-widest rounded-2xl p-3 text-cyan-500 font-mono focus:outline-none border ${adminInputBg}`}
          />
          {pinError && <p className="text-xs text-rose-500 font-medium">{pinError}</p>}
          <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs rounded-2xl shadow-lg active:scale-95 transition-all">
            Unlock Master Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${adminBgClass} font-sans pb-20 transition-colors duration-300`}>
      
      {/* Header with Day/Night Switch */}
      <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b px-4 sm:px-8 py-4 ${isAdminDarkMode ? 'bg-[#080d1e]/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold">{draft.studioName || "HUSNA FAROOQUI"} Console</h1>
              <p className={`text-[11px] ${adminMuted}`}>Live Firebase Synced Admin Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAdminDarkMode(prev => !prev)}
              className={`p-2.5 rounded-2xl border transition-all active:scale-90 flex items-center justify-center ${isAdminDarkMode ? 'bg-white/10 border-white/20 text-amber-400' : 'bg-white border-slate-300 text-slate-700 shadow-sm'}`}
              title={isAdminDarkMode ? "Switch to Day Mode" : "Switch to Night Mode"}
            >
              {isAdminDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button onClick={() => setIsAuthenticated(false)} className="text-xs text-rose-500 hover:underline font-bold">
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-xs font-bold text-cyan-500 text-center animate-fade-in shadow-lg">
            {statusMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b pb-3 border-slate-200/40 dark:border-white/10">
          {[
            { id: 'bookings', label: `📋 Live Bookings (${bookingsList.length})` },
            { id: 'profile', label: '📱 Profile Photo & Contact' },
            { id: 'gallery', label: '📸 Transformations & Reels' },
            { id: 'theme', label: '🎨 Themes & Fonts' },
            { id: 'coupons', label: '🏷️ Promo Coupons' },
            { id: 'floating', label: '🎈 Floating Banner' },
            { id: 'toggles', label: '🎛️ Guest Discount' },
            { id: 'prices', label: '💄 Package Rates' },
            { id: 'announcements', label: '📢 Top Announcements' },
            { id: 'convenience', label: '🚗 Travel Fees' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-lg shadow-cyan-500/20'
                  : `${adminMuted} hover:text-cyan-500 bg-white/5 border border-slate-200/40 dark:border-white/5`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: LIVE INCOMING BOOKINGS (WITH 1-CLICK ACCEPT CONFIRMATION) */}
        {activeTab === 'bookings' && (
          <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-500 flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" /> Incoming Appointments & Bookings
                </h3>
                <p className={`text-xs ${adminMuted} mt-0.5`}>
                  Manage bookings received from clients in real-time. Accept to send instant confirmation on client's WhatsApp.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded-xl">
                {bookingsList.length} Total Bookings
              </span>
            </div>

            {bookingsList.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                ✨ No incoming bookings yet. New bookings submitted by clients will appear here instantly!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingsList.map((item) => (
                  <div key={item.id} className={`p-5 rounded-3xl border space-y-4 ${adminInnerCard}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${item.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
                          {item.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending Review'}
                        </span>
                        <h4 className="font-bold text-base text-white mt-2 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-cyan-400" />
                          <span>{item.clientName}</span>
                        </h4>
                        <p className="text-xs text-slate-300 font-mono mt-0.5">📞 {item.clientPhone}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(item.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs border-t border-b border-white/10 py-3">
                      <div className="flex justify-between"><span className={adminMuted}>Event Date:</span><strong className="text-amber-400 font-mono">{item.eventDate}</strong></div>
                      <div className="flex justify-between"><span className={adminMuted}>Package:</span><span className="font-semibold text-right">{item.packageName}</span></div>
                      <div className="flex justify-between"><span className={adminMuted}>Vanity Kit:</span><span className="text-right">{item.kitType}</span></div>
                      <div className="flex justify-between"><span className={adminMuted}>Zone:</span><span>{item.zoneName}</span></div>
                      <div className="flex justify-between"><span className={adminMuted}>Address:</span><span className="text-right truncate max-w-[200px]">{item.venueAddress}</span></div>
                      {item.appliedCoupon && item.appliedCoupon !== 'None' && (
                        <div className="flex justify-between text-emerald-400 font-semibold"><span>Coupon:</span><span>{item.appliedCoupon}</span></div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-white/5 font-bold text-sm">
                        <span>Total Investment:</span>
                        <span className="text-cyan-400 font-mono">₹{item.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAcceptBooking(item)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
                      >
                        <Check className="w-4 h-4" />
                        <span>{item.status === 'confirmed' ? 'Resend WhatsApp Confirmation' : 'Accept & Confirm (WhatsApp)'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* TAB 1: PROFILE PHOTO & SOCIALS */}
          {activeTab === 'profile' && (
            <div className={`p-6 rounded-3xl border space-y-6 ${adminCardBg}`}>
              <div className={`space-y-3 p-4 rounded-2xl border ${adminInnerCard}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Profile Photo Mode
                  </span>
                  
                  <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-white/10 gap-1">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, profilePhotoType: 'image' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${draft.profilePhotoType !== 'instagram' ? 'bg-cyan-500 text-neutral-950 shadow' : `${adminMuted}`}`}
                    >
                      Image URL / Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, profilePhotoType: 'instagram' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${draft.profilePhotoType === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow' : `${adminMuted}`}`}
                    >
                      Instagram Profile Photo
                    </button>
                  </div>
                </div>

                {draft.profilePhotoType === 'instagram' ? (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-400">
                    📸 <strong>Instagram Auto-Sync Active:</strong> Your profile photo is automatically pulled from <strong>@{draft.instagramHandle || 'husna_farooqui_makeup'}</strong> via direct proxy.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-cyan-400 shrink-0 shadow-lg">
                        <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <label className={`block text-[11px] font-semibold ${adminMuted}`}>Direct Image Link</label>
                        <input
                          type="text"
                          value={draft.profileImage || ''}
                          onChange={(e) => setDraft({ ...draft, profileImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className={`w-full p-2.5 rounded-xl text-xs font-mono border ${adminInputBg}`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/40 dark:border-white/10">
                      <label className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-500 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 border border-cyan-500/30 transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                        <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                      </label>
                      <span className={`text-[11px] ${adminMuted}`}>Upload directly from device (auto-converts)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${adminMuted}`}>Studio Display Title</label>
                  <input
                    type="text"
                    value={draft.studioName || ''}
                    onChange={(e) => setDraft({ ...draft, studioName: e.target.value })}
                    className={`w-full p-3 rounded-2xl text-xs font-bold border ${adminInputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${adminMuted}`}>Artist Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={draft.artistTagline || ''}
                    onChange={(e) => setDraft({ ...draft, artistTagline: e.target.value })}
                    className={`w-full p-3 rounded-2xl text-xs border ${adminInputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${adminMuted}`}>WhatsApp Number (with 91 code)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919997210876"
                    value={draft.whatsappNumber || ''}
                    onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    className={`w-full p-3 rounded-2xl font-mono text-cyan-500 text-xs font-bold border ${adminInputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${adminMuted}`}>Instagram Username (without @)</label>
                  <input
                    type="text"
                    placeholder="e.g. husna_farooqui_makeup"
                    value={draft.instagramHandle || ''}
                    onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value.replace(/^@/, '') })}
                    className={`w-full p-3 rounded-2xl font-mono text-pink-500 text-xs font-bold border ${adminInputBg}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${adminMuted}`}>Base Studio Location / Address</label>
                  <input
                    type="text"
                    value={draft.baseLocation || ''}
                    onChange={(e) => setDraft({ ...draft, baseLocation: e.target.value })}
                    className={`w-full p-3 rounded-2xl text-xs border ${adminInputBg}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSFORMATIONS & REELS */}
          {activeTab === 'gallery' && (
            <div className={`p-6 rounded-3xl border space-y-5 ${adminCardBg}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xs uppercase text-cyan-500 flex items-center gap-1.5">
                    <Film className="w-4 h-4" /> Transformations Media & Reels Studio
                  </h3>
                  <p className={`text-xs ${adminMuted} mt-0.5`}>Add/edit makeover photos, direct videos, or Instagram Reel links</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft({
                      ...draft,
                      galleryPhotos: [
                        ...(draft.galleryPhotos || []),
                        {
                          type: "image",
                          title: "New Transformation Look",
                          sub: "Signature Makeover",
                          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
                        }
                      ]
                    });
                  }}
                  className="px-3 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Media
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {(draft.galleryPhotos || []).map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-500 font-mono">Media Card #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = draft.galleryPhotos.filter((_, i) => i !== idx);
                          setDraft({ ...draft, galleryPhotos: copy });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`block text-[10px] mb-1 ${adminMuted}`}>Media Type</label>
                        <select
                          value={item.type || 'image'}
                          onChange={(e) => {
                            const copy = [...draft.galleryPhotos];
                            copy[idx] = { ...copy[idx], type: e.target.value };
                            setDraft({ ...draft, galleryPhotos: copy });
                          }}
                          className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}
                        >
                          <option value="image">🖼️ Image Photo</option>
                          <option value="video">🎥 Direct Video (.mp4)</option>
                          <option value="instagram_reel">📸 Instagram Reel Link</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-[10px] mb-1 ${adminMuted}`}>Tag Subtitle</label>
                        <input
                          type="text"
                          value={item.sub || ''}
                          onChange={(e) => {
                            const copy = [...draft.galleryPhotos];
                            copy[idx] = { ...copy[idx], sub: e.target.value };
                            setDraft({ ...draft, galleryPhotos: copy });
                          }}
                          placeholder="e.g. Dewy Finish"
                          className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] mb-1 ${adminMuted}`}>Card Title</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const copy = [...draft.galleryPhotos];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setDraft({ ...draft, galleryPhotos: copy });
                        }}
                        placeholder="e.g. Royal Bridal Look"
                        className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] mb-1 ${adminMuted}`}>Media URL / Reel Link</label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => {
                          const copy = [...draft.galleryPhotos];
                          copy[idx] = { ...copy[idx], url: e.target.value };
                          setDraft({ ...draft, galleryPhotos: copy });
                        }}
                        placeholder="https://... or Reel link"
                        className={`w-full p-2 rounded-xl text-xs font-mono text-cyan-500 border ${adminInputBg}`}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/40 dark:border-white/10">
                      <label className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-500 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 border border-cyan-500/30 transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input type="file" accept="image/*,video/*" onChange={(e) => handleGalleryMediaUpload(e, idx)} className="hidden" />
                      </label>
                      <span className={`text-[10px] ${adminMuted}`}>Upload directly from device</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THEMES & FONTS */}
          {activeTab === 'theme' && (
            <div className={`p-6 rounded-3xl border space-y-6 ${adminCardBg}`}>
              <h3 className="font-bold text-xs uppercase text-cyan-500 flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Visual Design, Fonts & App Skin
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 flex items-center gap-1.5 ${adminMuted}`}>
                    <Layers className="w-3.5 h-3.5 text-cyan-500" /> Color Theme & Aesthetics
                  </label>
                  <select
                    value={draft.theme?.colorTheme || 'liquid_glass'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, colorTheme: e.target.value }
                    })}
                    className={`w-full p-3 rounded-2xl text-xs font-bold text-cyan-500 border ${adminInputBg}`}
                  >
                    <option value="liquid_glass">💎 Liquid Glass iOS (Ultra Frosted Glassmorphism)</option>
                    <option value="one_ui_9">✨ Samsung One UI 9 (Warm Gold Squircles)</option>
                    <option value="google_minimal">🔵 Google Minimalist (Material You Clean)</option>
                    <option value="gold_rose">👑 Royal Gold & Rose Radiance</option>
                    <option value="champagne">🥂 Champagne Gold & Warm Amber</option>
                    <option value="emerald">💚 Emerald Luxe & Velvet Gold</option>
                    <option value="violet">🔮 Midnight Orchid & Electric Rose</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 flex items-center gap-1.5 ${adminMuted}`}>
                    <Type className="w-3.5 h-3.5 text-amber-500" /> Typography & Font Family
                  </label>
                  <select
                    value={draft.theme?.fontFamily || 'sans'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, fontFamily: e.target.value }
                    })}
                    className={`w-full p-3 rounded-2xl text-xs font-bold text-amber-500 border ${adminInputBg}`}
                  >
                    <option value="sans">Plus Jakarta Sans (Samsung One UI 9 / Android)</option>
                    <option value="outfit">Outfit (iOS & Liquid Glass Minimal)</option>
                    <option value="comic">Comic Sans / Comic Neue (Fun & Vibrant)</option>
                    <option value="serif">Playfair Display (Royal Serif)</option>
                    <option value="cormorant">Cormorant Garamond (Haute Couture Luxury)</option>
                    <option value="cinzel">Cinzel (Signature Roman Bridal)</option>
                    <option value="montserrat">Montserrat (Clean Editorial Sans)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${adminMuted}`}>Default Customer Theme Mode</label>
                  <select
                    value={draft.theme?.defaultMode || 'dark'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, defaultMode: e.target.value }
                    })}
                    className={`w-full p-3 rounded-2xl text-xs font-bold border ${adminInputBg}`}
                  >
                    <option value="dark">🌙 Dark Mode (Night Glass)</option>
                    <option value="light">☀️ Light Mode (Clean Pearl Minimal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROMO COUPONS */}
          {activeTab === 'coupons' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase text-cyan-500 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Promotional Coupon Manager
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const code = prompt("Enter new Coupon Code (e.g. SPECIAL20):");
                    if (code) {
                      const clean = code.trim().toUpperCase();
                      setDraft({
                        ...draft,
                        validCoupons: {
                          ...draft.validCoupons,
                          [clean]: { type: "percent", value: 10, label: "Special Offer", maxUses: 1 }
                        }
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-cyan-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Coupon
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(draft.validCoupons || {}).map(([code, cData]) => (
                  <div key={code} className={`p-4 rounded-2xl border space-y-3 ${adminInnerCard}`}>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="w-full sm:w-1/4">
                        <label className={`block text-[10px] mb-1 ${adminMuted}`}>Coupon Code</label>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => {
                            const newCode = e.target.value.toUpperCase();
                            const updated = { ...draft.validCoupons };
                            const oldVal = updated[code];
                            delete updated[code];
                            updated[newCode] = oldVal;
                            setDraft({ ...draft, validCoupons: updated });
                          }}
                          className={`w-full p-2 rounded-xl font-mono font-bold text-cyan-500 text-xs border ${adminInputBg}`}
                        />
                      </div>

                      <div className="w-full sm:w-1/3 flex gap-2">
                        <div className="w-1/2">
                          <label className={`block text-[10px] mb-1 ${adminMuted}`}>Type</label>
                          <select
                            value={cData.type}
                            onChange={(e) => setDraft({
                              ...draft,
                              validCoupons: { ...draft.validCoupons, [code]: { ...cData, type: e.target.value } }
                            })}
                            className={`w-full p-2 rounded-xl text-xs font-bold border ${adminInputBg}`}
                          >
                            <option value="percent">% Percent Off</option>
                            <option value="flat">₹ Flat Amount</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className={`block text-[10px] mb-1 ${adminMuted}`}>Value</label>
                          <input
                            type="number"
                            value={cData.value}
                            onChange={(e) => setDraft({
                              ...draft,
                              validCoupons: { ...draft.validCoupons, [code]: { ...cData, value: Number(e.target.value) } }
                            })}
                            className={`w-full p-2 rounded-xl font-mono text-xs font-bold text-cyan-500 border ${adminInputBg}`}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/4">
                        <label className={`block text-[10px] mb-1 ${adminMuted}`}>Redemption Limit</label>
                        <select
                          value={cData.maxUses ?? 1}
                          onChange={(e) => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...cData, maxUses: e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value) }
                            }
                          })}
                          className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`}
                        >
                          <option value={1}>1 Time (Single Use)</option>
                          <option value={2}>2 Times</option>
                          <option value={5}>5 Times</option>
                          <option value="unlimited">♾️ Unlimited</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...draft.validCoupons };
                          delete updated[code];
                          setDraft({ ...draft, validCoupons: updated });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className={`block text-[10px] mb-1 ${adminMuted}`}>Promo Label</label>
                      <input
                        type="text"
                        value={cData.label || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          validCoupons: { ...draft.validCoupons, [code]: { ...cData, label: e.target.value } }
                        })}
                        className={`w-full p-2 rounded-xl text-xs border ${adminInputBg}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FLOATING BANNER */}
          {activeTab === 'floating' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-500">Floating Bottom Offer Widget</h3>
                  <p className={`text-xs ${adminMuted}`}>Toggle bottom floating pill</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, enabled: !draft.floatingBanner?.enabled } })}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Tag</label>
                  <input type="text" value={draft.floatingBanner?.tag || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, tag: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs font-bold text-cyan-500 border ${adminInputBg}`} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Code</label>
                  <input type="text" value={draft.floatingBanner?.code || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, code: e.target.value.toUpperCase() } })} className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border ${adminInputBg}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1 ${adminMuted}`}>Title</label>
                  <input type="text" value={draft.floatingBanner?.title || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, title: e.target.value } })} className={`w-full p-2.5 rounded-xl text-xs border ${adminInputBg}`} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GUEST DISCOUNT */}
          {activeTab === 'toggles' && (
            <div className={`p-6 rounded-3xl border space-y-4 ${adminCardBg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-500">Extra Family Guest Discount</h3>
                  <p className={`text-xs ${adminMuted}`}>Toggle extra guest savings</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, guestDiscount: { ...draft.guestDiscount, enabled: !draft.guestDiscount?.enabled } })}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.guestDiscount?.enabled !== false ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}
                >
                  {draft.guestDiscount?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{draft.guestDiscount?.enabled !== false ? 'ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>

              {draft.guestDiscount?.enabled !== false && (
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/40 dark:border-white/10">
                  <label className="text-xs font-bold">Discount %:</label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={draft.guestDiscount?.discountPercent ?? 15}
                    onChange={(e) => setDraft({ ...draft, guestDiscount: { ...draft.guestDiscount, discountPercent: Number(e.target.value) } })}
                    className={`w-20 p-2 rounded-xl text-cyan-500 font-mono font-bold text-xs border ${adminInputBg}`}
                  />
                  <span className="font-bold text-cyan-500 text-xs">% OFF</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PRICES */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-3xl border space-y-3 ${adminCardBg}`}>
                <h3 className="font-bold text-xs uppercase text-cyan-500">👑 International Luxury Vanity Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className={`block text-[11px] mb-1 capitalize ${adminMuted}`}>{pkgKey.replace(/_/g, ' ')}</label>
                      <input
                        type="number"
                        value={draft.pricingByKit.international[pkgKey]}
                        onChange={(e) => setDraft({
                          ...draft,
                          pricingByKit: {
                            ...draft.pricingByKit,
                            international: { ...draft.pricingByKit.international, [pkgKey]: Number(e.target.value) }
                          }
                        })}
                        className={`w-full p-2.5 rounded-xl font-mono text-cyan-500 text-xs border ${adminInputBg}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-5 rounded-3xl border space-y-3 ${adminCardBg}`}>
                <h3 className="font-bold text-xs uppercase text-rose-500">✨ Premium Drugstore & HD Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className={`block text-[11px] mb-1 capitalize ${adminMuted}`}>{pkgKey.replace(/_/g, ' ')}</label>
                      <input
                        type="number"
                        value={draft.pricingByKit.drugstore[pkgKey]}
                        onChange={(e) => setDraft({
                          ...draft,
                          pricingByKit: {
                            ...draft.pricingByKit,
                            drugstore: { ...draft.pricingByKit.drugstore, [pkgKey]: Number(e.target.value) }
                          }
                        })}
                        className={`w-full p-2.5 rounded-xl font-mono text-cyan-500 text-xs border ${adminInputBg}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className={`p-5 rounded-3xl border space-y-3 ${adminCardBg}`}>
              <h3 className="font-bold text-xs uppercase text-cyan-500">📢 Announcement Lines</h3>
              {draft.announcements.map((line, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={line}
                  onChange={(e) => {
                    const copy = [...draft.announcements];
                    copy[idx] = e.target.value;
                    setDraft({ ...draft, announcements: copy });
                  }}
                  className={`w-full p-3 rounded-2xl text-xs border ${adminInputBg}`}
                />
              ))}
            </div>
          )}

          {/* TAB 9: CONVENIENCE */}
          {activeTab === 'convenience' && (
            <div className={`p-5 rounded-3xl border space-y-3 ${adminCardBg}`}>
              <h3 className="font-bold text-xs uppercase text-cyan-500">🚗 Convenience Travel Fees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(draft.convenienceZones).map(([zoneKey, zData]) => (
                  <div key={zoneKey} className={`p-3 rounded-2xl border flex justify-between items-center ${adminInnerCard}`}>
                    <span className="text-xs truncate max-w-[200px]">{zData.name}</span>
                    <input
                      type="number"
                      value={zData.fee}
                      onChange={(e) => setDraft({
                        ...draft,
                        convenienceZones: {
                          ...draft.convenienceZones,
                          [zoneKey]: { ...zData, fee: Number(e.target.value) }
                        }
                      })}
                      className={`w-24 p-2 rounded-xl font-mono text-cyan-500 font-bold text-xs text-right border ${adminInputBg}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-neutral-950 font-bold text-sm rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Syncing to Firebase...' : 'Push All Changes Live to Customer App'}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
