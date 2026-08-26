import React, { useState, useEffect } from 'react';
import { 
  Crown, Settings, Save, Lock, Plus, Trash2, ToggleLeft, ToggleRight, 
  Percent, Tag, Volume2, Car, Sparkles, RefreshCw, CheckCircle2, 
  Phone, Instagram, Palette, Type, Gift, MapPin, Eye, Sliders
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig } from './firebase';

const DEFAULT_CONFIG = {
  adminPin: "8760",
  studioName: "HUSNA FAROOQUI",
  artistTagline: "Celebrity & Bridal Makeup Artist",
  whatsappNumber: "919997210876",
  instagramHandle: "husna_farooqui_makeup",
  baseLocation: "Okhla / Jamia Nagar, New Delhi",

  // Theme & Appearance
  theme: {
    fontFamily: "serif", // 'serif', 'cormorant', 'cinzel', 'sans', 'montserrat'
    colorTheme: "gold_rose", // 'gold_rose', 'champagne', 'emerald', 'violet'
    defaultMode: "dark" // 'dark' | 'light'
  },

  // Feature Toggles
  showOfferSection: true,
  enableDiscountsAndCoupons: true,
  
  // Floating Banner Config
  floatingBanner: {
    enabled: true,
    tag: "SPECIAL WEDDING OFFER",
    title: "Flat 10% OFF Signature Bridal Look",
    code: "BRIDE2026",
    actionText: "Apply Offer"
  },

  // Guest Discount Control
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
      setStatusMsg('🎉 All studio changes, themes, banners & rates updated live on Main App!');
    } catch (err) {
      setStatusMsg('❌ Error saving changes: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] text-[#f2f4f8] flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="max-w-sm w-full bg-[#14171f] border border-[#232730] p-8 rounded-3xl text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif">{draft.studioName || "Husna Farooqui"}</h2>
            <p className="text-xs text-[#8e95a5] mt-1">Master Studio Management Console</p>
          </div>
          <input
            type="password"
            maxLength={6}
            placeholder="Enter Admin PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-lg tracking-widest bg-[#0f1117] border border-[#282d38] rounded-2xl p-3 text-amber-400 font-mono focus:outline-none focus:border-amber-500"
          />
          {pinError && <p className="text-xs text-rose-500 font-medium">{pinError}</p>}
          <button type="submit" className="w-full py-3 bg-amber-500 text-neutral-950 font-bold text-xs rounded-2xl shadow hover:opacity-95">
            Unlock Master Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f2f4f8] font-sans pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0b0c0e]/90 backdrop-blur-xl border-b border-[#232730] px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-serif">{draft.studioName || "Husna Farooqui"} Control</h1>
              <p className="text-[11px] text-[#8e95a5]">Live Firebase Synced Admin Console</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-rose-400 hover:underline">
            Lock Portal
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-[#14171f] border border-amber-500/40 text-xs font-semibold text-amber-400 text-center animate-fade-in shadow-lg">
            {statusMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#232730] pb-3">
          {[
            { id: 'profile', label: '📱 Contact & Socials' },
            { id: 'floating', label: '🎈 Floating Offer Studio' },
            { id: 'theme', label: '🎨 Fonts & Branding' },
            { id: 'toggles', label: '🎛️ Guest Discount & Toggles' },
            { id: 'prices', label: '💄 Package Rates' },
            { id: 'coupons', label: '🏷️ Promo Coupons' },
            { id: 'announcements', label: '📢 Top Announcements' },
            { id: 'convenience', label: '🚗 Travel Fees' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'bg-[#14171f] text-[#8e95a5] hover:text-[#f2f4f8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* TAB 1: CONTACT & SOCIAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-3xl bg-[#14171f] border border-[#232730] space-y-5">
              <h3 className="font-bold text-xs uppercase text-amber-400 flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> Studio Identity & Booking Routing
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Studio Display Title</label>
                  <input
                    type="text"
                    value={draft.studioName || ''}
                    onChange={(e) => setDraft({ ...draft, studioName: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Artist Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={draft.artistTagline || ''}
                    onChange={(e) => setDraft({ ...draft, artistTagline: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">WhatsApp Booking Number (with 91 country code)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919997210876"
                    value={draft.whatsappNumber || ''}
                    onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] font-mono text-amber-400 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Instagram Username (without @)</label>
                  <input
                    type="text"
                    placeholder="e.g. husna_farooqui_makeup"
                    value={draft.instagramHandle || ''}
                    onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value.replace(/^@/, '') })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] font-mono text-pink-400 text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Base Studio Location / Address</label>
                  <input
                    type="text"
                    value={draft.baseLocation || ''}
                    onChange={(e) => setDraft({ ...draft, baseLocation: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Admin Security PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={draft.adminPin || '8760'}
                    onChange={(e) => setDraft({ ...draft, adminPin: e.target.value })}
                    className="w-36 p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] font-mono text-amber-400 text-xs font-bold tracking-widest"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLOATING OFFER BANNER STUDIO */}
          {activeTab === 'floating' && (
            <div className="p-6 rounded-3xl bg-[#14171f] border border-amber-500/30 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" /> Floating Bottom Promo Widget
                  </h3>
                  <p className="text-xs text-[#8e95a5] mt-0.5">Control the high-converting offer card floating at the bottom-right</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft({
                    ...draft,
                    floatingBanner: {
                      ...draft.floatingBanner,
                      enabled: !draft.floatingBanner?.enabled
                    }
                  })}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.floatingBanner?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                >
                  {draft.floatingBanner?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{draft.floatingBanner?.enabled !== false ? 'WIDGET ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#232730]">
                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Offer Tag Badge</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.tag || ''}
                    onChange={(e) => setDraft({
                      ...draft,
                      floatingBanner: { ...draft.floatingBanner, tag: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Promo Coupon Code</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.code || ''}
                    onChange={(e) => setDraft({
                      ...draft,
                      floatingBanner: { ...draft.floatingBanner, code: e.target.value.toUpperCase() }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Offer Title / Headline</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.title || ''}
                    onChange={(e) => setDraft({
                      ...draft,
                      floatingBanner: { ...draft.floatingBanner, title: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-1.5">Button Action Text</label>
                  <input
                    type="text"
                    value={draft.floatingBanner?.actionText || 'Apply Offer'}
                    onChange={(e) => setDraft({
                      ...draft,
                      floatingBanner: { ...draft.floatingBanner, actionText: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THEME, FONTS & BRANDING */}
          {activeTab === 'theme' && (
            <div className="p-6 rounded-3xl bg-[#14171f] border border-[#232730] space-y-6">
              <h3 className="font-bold text-xs uppercase text-amber-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Live Theme & Font Customizer
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-2 flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" /> Luxury Font Family
                  </label>
                  <select
                    value={draft.theme?.fontFamily || 'serif'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, fontFamily: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs font-bold text-amber-400"
                  >
                    <option value="serif">Playfair Display (Royal Serif)</option>
                    <option value="cormorant">Cormorant Garamond (Haute Couture)</option>
                    <option value="cinzel">Cinzel Luxe (Signature Bridal)</option>
                    <option value="sans">Plus Jakarta Sans (Modern Clean)</option>
                    <option value="montserrat">Montserrat (Editorial Minimal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-2">Accent Color Palette</label>
                  <select
                    value={draft.theme?.colorTheme || 'gold_rose'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, colorTheme: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs font-bold text-rose-400"
                  >
                    <option value="gold_rose">👑 Royal Gold & Rose Radiance</option>
                    <option value="champagne">🥂 Champagne Gold & Warm Amber</option>
                    <option value="emerald">💎 Emerald Luxe & Velvet Gold</option>
                    <option value="violet">🔮 Midnight Orchid & Electric Rose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8e95a5] mb-2">Default Theme Mode</label>
                  <select
                    value={draft.theme?.defaultMode || 'dark'}
                    onChange={(e) => setDraft({
                      ...draft,
                      theme: { ...draft.theme, defaultMode: e.target.value }
                    })}
                    className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs font-bold text-[#f2f4f8]"
                  >
                    <option value="dark">🌙 Dark Mode (One UI Night)</option>
                    <option value="light">☀️ Light Mode (Pure Minimal Pearl)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUEST DISCOUNT & FEATURE TOGGLES */}
          {activeTab === 'toggles' && (
            <div className="space-y-4">
              
              <div className="p-5 rounded-3xl bg-[#14171f] border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                      <Percent className="w-4 h-4" /> Extra Guest Discount Switch
                    </h3>
                    <p className="text-xs text-[#8e95a5] mt-0.5">Toggle discount percentage on extra family makeup bookings</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft({
                      ...draft,
                      guestDiscount: { ...draft.guestDiscount, enabled: !draft.guestDiscount?.enabled }
                    })}
                    className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.guestDiscount?.enabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                  >
                    {draft.guestDiscount?.enabled !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span>{draft.guestDiscount?.enabled !== false ? 'DISCOUNT ACTIVE' : 'DISABLED'}</span>
                  </button>
                </div>

                {draft.guestDiscount?.enabled !== false && (
                  <div className="flex items-center gap-3 pt-3 border-t border-[#232730]">
                    <label className="text-xs font-semibold">Guest Discount Percentage:</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={draft.guestDiscount?.discountPercent ?? 15}
                        onChange={(e) => setDraft({
                          ...draft,
                          guestDiscount: { ...draft.guestDiscount, discountPercent: Number(e.target.value) }
                        })}
                        className="w-20 p-2 rounded-xl bg-[#0f1117] border border-[#282d38] text-amber-400 font-mono font-bold text-xs"
                      />
                      <span className="font-bold text-amber-400 text-xs">% OFF</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-3xl bg-[#14171f] border border-[#232730] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#232730]">
                  <div>
                    <span className="font-bold text-sm block">Master Promo Coupon Box</span>
                    <span className="text-xs text-[#8e95a5]">Enable/disable entire coupon code section in calculator</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, enableDiscountsAndCoupons: !draft.enableDiscountsAndCoupons })}
                    className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.enableDiscountsAndCoupons !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                  >
                    {draft.enableDiscountsAndCoupons !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span>{draft.enableDiscountsAndCoupons !== false ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm block">Top Offer Announcement Banner</span>
                    <span className="text-xs text-[#8e95a5]">Show or hide top rolling announcement ticker</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, showOfferSection: !draft.showOfferSection })}
                    className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs ${draft.showOfferSection !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}
                  >
                    {draft.showOfferSection !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span>{draft.showOfferSection !== false ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PACKAGE RATES */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-[#14171f] border border-amber-500/30 space-y-3">
                <h3 className="font-bold text-xs uppercase text-amber-400">👑 International Luxury Vanity Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className="block text-[11px] mb-1 capitalize text-[#8e95a5]">{pkgKey.replace(/_/g, ' ')}</label>
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
                        className="w-full p-2.5 rounded-xl bg-[#0f1117] border border-[#282d38] font-mono text-amber-400 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#14171f] border border-[#232730] space-y-3">
                <h3 className="font-bold text-xs uppercase text-rose-400">✨ Premium Drugstore & HD Kit (₹)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {partyPackages.concat(bridalPackages).map((pkgKey) => (
                    <div key={pkgKey}>
                      <label className="block text-[11px] mb-1 capitalize text-[#8e95a5]">{pkgKey.replace(/_/g, ' ')}</label>
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
                        className="w-full p-2.5 rounded-xl bg-[#0f1117] border border-[#282d38] font-mono text-amber-400 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="p-5 rounded-3xl bg-[#14171f] border border-[#232730] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase text-amber-400">🏷️ Active Promotional Coupons</h3>
                <button
                  type="button"
                  onClick={() => {
                    const code = prompt("Enter Coupon Code (e.g. FESTIVE25):");
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
                  className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Code
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(draft.validCoupons).map(([code, cData]) => (
                  <div key={code} className="p-3.5 rounded-2xl bg-[#0f1117] border border-[#282d38] flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 text-sm">{code}</span>
                    <div className="flex gap-2">
                      <select
                        value={cData.type}
                        onChange={(e) => setDraft({
                          ...draft,
                          validCoupons: {
                            ...draft.validCoupons,
                            [code]: { ...cData, type: e.target.value }
                          }
                        })}
                        className="p-2 rounded-xl bg-[#14171f] border border-[#282d38] text-xs"
                      >
                        <option value="percent">% Off</option>
                        <option value="flat">₹ Flat</option>
                      </select>
                      <input
                        type="number"
                        value={cData.value}
                        onChange={(e) => setDraft({
                          ...draft,
                          validCoupons: {
                            ...draft.validCoupons,
                            [code]: { ...cData, value: Number(e.target.value) }
                          }
                        })}
                        className="w-20 p-2 rounded-xl bg-[#14171f] border border-[#282d38] font-mono text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...draft.validCoupons };
                        delete updated[code];
                        setDraft({ ...draft, validCoupons: updated });
                      }}
                      className="text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="p-5 rounded-3xl bg-[#14171f] border border-[#232730] space-y-3">
              <h3 className="font-bold text-xs uppercase text-amber-400">📢 Announcement Lines</h3>
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
                  className="w-full p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] text-xs text-[#f2f4f8]"
                />
              ))}
            </div>
          )}

          {/* TAB 8: TRAVEL FEES */}
          {activeTab === 'convenience' && (
            <div className="p-5 rounded-3xl bg-[#14171f] border border-[#232730] space-y-3">
              <h3 className="font-bold text-xs uppercase text-amber-400">🚗 Convenience Travel Fees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(draft.convenienceZones).map(([zoneKey, zData]) => (
                  <div key={zoneKey} className="p-3 rounded-2xl bg-[#0f1117] border border-[#282d38] flex justify-between items-center">
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
                      className="w-24 p-2 rounded-xl bg-[#14171f] border border-[#282d38] font-mono text-amber-400 font-bold text-xs text-right"
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
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-neutral-950 font-bold text-sm rounded-2xl shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Syncing to Firebase...' : 'Publish All Changes Live to Customer App'}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
