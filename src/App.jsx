import React, { useState, useEffect } from 'react';
import { 
  Crown, Settings, Save, Lock, Plus, Trash2, ToggleLeft, ToggleRight, 
  Percent, Tag, Volume2, Car, Sparkles, RefreshCw, CheckCircle2, 
  Phone, Instagram, Palette, Type, Gift, MapPin, Eye, Sliders, Layers, Image as ImageIcon, Upload
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig } from './firebase';

const DEFAULT_CONFIG = {
  adminPin: "8760",
  studioName: "HUSNA FAROOQUI",
  artistTagline: "Celebrity & Bridal Makeup Artist",
  profilePhotoType: "image", // 'image' | 'instagram'
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  whatsappNumber: "919997210876",
  instagramHandle: "husna_farooqui_makeup",
  baseLocation: "Okhla / Jamia Nagar, New Delhi",

  theme: {
    fontFamily: "sans", // 'sans', 'outfit', 'comic', 'serif', 'cormorant', 'cinzel', 'montserrat'
    colorTheme: "liquid_glass", // 'liquid_glass', 'one_ui_9', 'google_minimal', 'gold_rose', 'champagne', 'emerald', 'violet'
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
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchLiveConfig(DEFAULT_CONFIG);
      setDraft(data);
    }
    load();
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
      setStatusMsg('🎉 All settings, themes, fonts, profile photo & rates synced live!');
    } catch (err) {
      setStatusMsg('❌ Error saving changes: ' + err.message);
    } finally {
      setIsSaving(false);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#f8fafc] flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="max-w-sm w-full bg-white/[0.04] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{draft.studioName || "HUSNA FAROOQUI"}</h2>
            <p className="text-xs text-slate-400 mt-1">Master Studio Management Console</p>
          </div>
          <input
            type="password"
            maxLength={6}
            placeholder="Enter Admin PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-lg tracking-widest bg-black/40 border border-white/20 rounded-2xl p-3 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
          />
          {pinError && <p className="text-xs text-rose-400 font-medium">{pinError}</p>}
          <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs rounded-2xl shadow-lg active:scale-95 transition-all">
            Unlock Master Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] font-sans pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080d1e]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold">{draft.studioName || "HUSNA FAROOQUI"} Console</h1>
              <p className="text-[11px] text-slate-400">Live Firebase Synced Admin Console</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-rose-400 hover:underline">
            Lock Portal
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-cyan-500/40 text-xs font-bold text-cyan-400 text-center animate-fade-in shadow-lg">
            {statusMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'profile', label: '📱 Profile Photo & Contact' },
            { id: 'theme', label: '🎨 Liquid Glass & Fonts' },
            { id: 'coupons', label: '🏷️ Promo Coupons Studio' },
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
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* TAB 1: PROFILE PHOTO & SOCIALS */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-6">
              
              <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Profile Photo Mode
                  </span>
                  
                  {/* Photo Source Switch */}
                  <div className="inline-flex p-1 rounded-xl bg-white/10 border border-white/10 gap-1">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, profilePhotoType: 'image' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${draft.profilePhotoType !== 'instagram' ? 'bg-cyan-500 text-neutral-950' : 'text-slate-400'}`}
                    >
                      Image URL / Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, profilePhotoType: 'instagram' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${draft.profilePhotoType === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-400'}`}
                    >
                      Instagram Profile Photo
                    </button>
                  </div>
                </div>

                {draft.profilePhotoType === 'instagram' ? (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
                    📸 <strong>Instagram Auto-Sync Active:</strong> Your profile photo is automatically pulled from <strong>@{draft.instagramHandle || 'husna_farooqui_makeup'}</strong>.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-cyan-400 shrink-0 shadow-lg">
                        <img src={draft.profileImage || DEFAULT_CONFIG.profileImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <label className="block text-[11px] text-slate-400 font-semibold">Direct Image Link</label>
                        <input
                          type="text"
                          value={draft.profileImage || ''}
                          onChange={(e) => setDraft({ ...draft, profileImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <label className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 border border-white/20 transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                        <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                      </label>
                      <span className="text-[11px] text-slate-400">Directly upload any JPG/PNG from your phone or PC</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Studio Display Title</label>
                  <input
                    type="text"
                    value={draft.studioName || ''}
                    onChange={(e) => setDraft({ ...draft, studioName: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Artist Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={draft.artistTagline || ''}
                    onChange={(e) => setDraft({ ...draft, artistTagline: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">WhatsApp Number (with 91 country code)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919997210876"
                    value={draft.whatsappNumber || ''}
                    onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 font-mono text-cyan-400 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Instagram Username (without @)</label>
                  <input
                    type="text"
                    placeholder="e.g. husna_farooqui_makeup"
                    value={draft.instagramHandle || ''}
                    onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value.replace(/^@/, '') })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 font-mono text-pink-400 text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Base Studio Location / Address</label>
                  <input
                    type="text"
                    value={draft.baseLocation || ''}
                    onChange={(e) => setDraft({ ...draft, baseLocation: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIQUID GLASS, ONE UI 9 & EXPANDED FONTS */}
          {activeTab === 'theme' && (
            <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-6">
              <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Visual Design, Fonts & App Skin
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" /> Color Theme & Aesthetics
                  </label>
                  <select
                    value={draft.theme?.colorTheme || 'liquid_glass'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, colorTheme: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs font-bold text-cyan-400"
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
                  <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-400" /> Typography & Font Family
                  </label>
                  <select
                    value={draft.theme?.fontFamily || 'sans'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, fontFamily: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs font-bold text-amber-400"
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
                  <label className="block text-xs font-bold text-slate-400 mb-2">Default Theme Mode</label>
                  <select
                    value={draft.theme?.defaultMode || 'dark'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, defaultMode: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs font-bold text-white"
                  >
                    <option value="dark">🌙 Dark Mode (Night Glass)</option>
                    <option value="light">☀️ Light Mode (Clean Pearl Minimal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROMO COUPONS */}
          {activeTab === 'coupons' && (
            <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
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
                  <div key={code} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] text-slate-400 mb-1">Coupon Code</label>
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
                          className="w-full p-2 rounded-xl bg-white/5 border border-white/10 font-mono font-bold text-cyan-400 text-xs"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 flex gap-2">
                        <div className="w-1/2">
                          <label className="block text-[10px] text-slate-400 mb-1">Type</label>
                          <select
                            value={cData.type}
                            onChange={(e) => setDraft({
                              ...draft,
                              validCoupons: { ...draft.validCoupons, [code]: { ...cData, type: e.target.value } }
                            })}
                            className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold"
                          >
                            <option value="percent">% Percent Off</option>
                            <option value="flat">₹ Flat Amount</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="block text-[10px] text-slate-400 mb-1">Value</label>
                          <input
                            type="number"
                            value={cData.value}
                            onChange={(e) => setDraft({
                              ...draft,
                              validCoupons: { ...draft.validCoupons, [code]: { ...cData, value: Number(e.target.value) } }
                            })}
                            className="w-full p-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] text-slate-400 mb-1">Redemption Limit</label>
                        <select
                          value={cData.maxUses ?? 1}
                          onChange={(e) => setDraft({
                            ...draft,
                            validCoupons: {
                              ...draft.validCoupons,
                              [code]: { ...cData, maxUses: e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value) }
                            }
                          })}
                          className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
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
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Promo Label</label>
                      <input
                        type="text"
                        value={cData.label || ''}
                        onChange={(e) => setDraft({
                          ...draft,
                          validCoupons: { ...draft.validCoupons, [code]: { ...cData, label: e.target.value } }
                        })}
                        className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FLOATING BANNER */}
          {activeTab === 'floating' && (
            <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-400">Floating Bottom Offer Widget</h3>
                  <p className="text-xs text-slate-400">Toggle bottom floating pill</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, enabled: !draft.floatingBanner?.enabled } })}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tag</label>
                  <input type="text" value={draft.floatingBanner?.tag || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, tag: e.target.value } })} className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs font-bold text-cyan-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Code</label>
                  <input type="text" value={draft.floatingBanner?.code || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, code: e.target.value.toUpperCase() } })} className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs font-mono font-bold" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                  <input type="text" value={draft.floatingBanner?.title || ''} onChange={(e) => setDraft({ ...draft, floatingBanner: { ...draft.floatingBanner, title: e.target.value } })} className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GUEST DISCOUNT */}
          {activeTab === 'toggles' && (
            <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-400">Extra Family Guest Discount</h3>
                  <p className="text-xs text-slate-400">Toggle extra guest savings</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, guestDiscount: { ...draft.guestDiscount, enabled: !draft.guestDiscount?.enabled } })}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.guestDiscount?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                >
                  {draft.guestDiscount?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{draft.guestDiscount?.enabled !== false ? 'ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>

              {draft.guestDiscount?.enabled !== false && (
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <label className="text-xs font-bold">Discount %:</label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={draft.guestDiscount?.discountPercent ?? 15}
                    onChange={(e) => setDraft({ ...draft, guestDiscount: { ...draft.guestDiscount, discountPercent: Number(e.target.value) } })}
                    className="w-20 p-2 rounded-xl bg-black/40 border border-white/20 text-cyan-400 font-mono font-bold text-xs"
                  />
                  <span className="font-bold text-cyan-400 text-xs">% OFF</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PRICES */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-3">
                <h3 className="font-bold text-xs uppercase text-cyan-400">👑 International Luxury Vanity Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className="block text-[11px] mb-1 capitalize text-slate-400">{pkgKey.replace(/_/g, ' ')}</label>
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
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 font-mono text-cyan-400 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-3">
                <h3 className="font-bold text-xs uppercase text-rose-400">✨ Premium Drugstore & HD Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className="block text-[11px] mb-1 capitalize text-slate-400">{pkgKey.replace(/_/g, ' ')}</label>
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
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 font-mono text-cyan-400 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-3">
              <h3 className="font-bold text-xs uppercase text-cyan-400">📢 Announcement Lines</h3>
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
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/20 text-xs text-white"
                />
              ))}
            </div>
          )}

          {/* TAB 8: CONVENIENCE */}
          {activeTab === 'convenience' && (
            <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-3">
              <h3 className="font-bold text-xs uppercase text-cyan-400">🚗 Convenience Travel Fees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(draft.convenienceZones).map(([zoneKey, zData]) => (
                  <div key={zoneKey} className="p-3 rounded-2xl bg-black/40 border border-white/20 flex justify-between items-center">
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
                      className="w-24 p-2 rounded-xl bg-white/5 border border-white/10 font-mono text-cyan-400 font-bold text-xs text-right"
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
