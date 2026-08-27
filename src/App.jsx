import React, { useState, useEffect } from 'react';
import { 
  Crown, CalendarCheck, Megaphone, Plus, Trash2, Send, Check, RefreshCw, 
  User, Sparkles, Sun, Moon, Lock, Tag, Layers, Type, Save, Film, Upload, Play
} from 'lucide-react';
import { fetchLiveConfig, updateLiveConfig, db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const DEFAULT_TEMPLATES = [
  { id: 1, title: "Wedding Season 15% OFF", text: "✨ *Special Wedding Season Offer - Husna Farooqui Studio* ✨\n\nBook your Signature Bridal Look this week and get *Flat 15% OFF* + complimentary lash extension!\n\nUse Code: *WEDDING15*\nBook Online: https://your-domain.com" },
  { id: 2, title: "Weekend Party Glam Flash Offer", text: "💄 *Flash Weekend Glam Offer!* 💄\n\nBook Super HD Party Makeup for 2 or more family members and get 1 Party Look at *50% OFF*!\n\nContact: +919997210876" }
];

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');
  const [draft, setDraft] = useState({});
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
      const data = await fetchLiveConfig({});
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
    if (pinInput === "8760") setIsAuthenticated(true);
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

  // 📹 Smart Video/Image File Upload Handler
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
        setActionStatus(`Loaded ${isVid ? 'Video' : 'Image'} file. Click 'Publish Changes Live' to save.`);
      };
      reader.readAsDataURL(file);
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
      setActionStatus(`✅ Delivered WhatsApp message to ${b.clientName}!`);
    } catch (err) {
      setActionStatus(`⚠️ Server offline or error: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="max-w-sm w-full p-8 rounded-3xl bg-white/[0.04] border border-white/10 text-center space-y-4 shadow-2xl">
          <Crown className="w-8 h-8 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <input type="password" placeholder="PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className="w-full text-center text-lg p-3 rounded-2xl bg-black/40 border border-white/20 text-cyan-400 font-mono" />
          <button type="submit" className="w-full py-3 bg-cyan-500 text-neutral-950 font-bold text-xs rounded-2xl">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-4 flex justify-between items-center bg-[#080d1e]/80">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-cyan-400" />
          <h1 className="font-bold text-sm">HF Studio Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAdminDarkMode(!isAdminDarkMode)} className="p-2 rounded-xl bg-white/10">{isAdminDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}</button>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-rose-400 font-bold">Lock</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-5">
        {actionStatus && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs text-center animate-fade-in">
            {actionStatus}
          </div>
        )}

        <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'gallery' ? 'bg-cyan-500 text-neutral-950' : 'bg-white/5 text-slate-400'}`}>
            <Film className="w-3.5 h-3.5" /> 📸 Transformations & Video Studio
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'bookings' ? 'bg-cyan-500 text-neutral-950' : 'bg-white/5 text-slate-400'}`}>
            📋 Bookings ({bookingsList.length})
          </button>
          <button onClick={() => setActiveTab('promotions')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'promotions' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 text-slate-400'}`}>
            <Megaphone className="w-3.5 h-3.5" /> Promotions
          </button>
        </div>

        {/* TAB: TRANSFORMATIONS & VIDEO MANAGER */}
        {activeTab === 'gallery' && (
          <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-3xl border border-white/10 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> Live Video & Image Showcase
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload any video (.mp4, .webm, .mov) or direct video URL.</p>
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
                <Plus className="w-3.5 h-3.5" /> Add Video/Photo Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(draft.galleryPhotos || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-mono">Media #{idx + 1} ({item.type === 'video' ? '🎥 Video' : '🖼️ Image'})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = draft.galleryPhotos.filter((_, i) => i !== idx);
                        setDraft({ ...draft, galleryPhotos: copy });
                      }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Type</label>
                      <select
                        value={item.type || 'video'}
                        onChange={(e) => {
                          const copy = [...draft.galleryPhotos];
                          copy[idx] = { ...copy[idx], type: e.target.value };
                          setDraft({ ...draft, galleryPhotos: copy });
                        }}
                        className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold"
                      >
                        <option value="video">🎥 Direct Video (Auto-play)</option>
                        <option value="image">🖼️ Photo Image</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={item.sub || ''}
                        onChange={(e) => {
                          const copy = [...draft.galleryPhotos];
                          copy[idx] = { ...copy[idx], sub: e.target.value };
                          setDraft({ ...draft, galleryPhotos: copy });
                        }}
                        className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }}
                      className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Video / Image Link or Base64</label>
                    <input
                      type="text"
                      value={item.url || ''}
                      onChange={(e) => {
                        const copy = [...draft.galleryPhotos];
                        copy[idx] = { ...copy[idx], url: e.target.value };
                        setDraft({ ...draft, galleryPhotos: copy });
                      }}
                      placeholder="https://...mp4 or upload below"
                      className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                    <label className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 border border-cyan-500/30 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video/Image File</span>
                      <input type="file" accept="video/*,image/*" onChange={(e) => handleMediaUpload(e, idx)} className="hidden" />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-neutral-950 font-bold text-xs rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing...' : 'Publish All Videos Live to Main App'}</span>
            </button>
          </div>
        )}

        {/* TAB: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookingsList.map(b => (
              <div key={b.id} className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {b.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                    <h4 className="font-bold text-base mt-2">{b.clientName}</h4>
                    <p className="text-xs text-slate-300 font-mono">📞 {b.clientPhone}</p>
                  </div>
                  <button onClick={() => deleteDoc(doc(db, "bookings", b.id))} className="p-1 text-rose-400"><Trash2 className="w-4 h-4" /></button>
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
    </div>
  );
}
