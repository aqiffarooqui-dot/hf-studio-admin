import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ⚠️ Paste your same Firebase keys here so it syncs with the main app
const firebaseConfig = {
  apiKey: "AIzaSyDrf7qAcl7lnvVNI3yQUXsdRRnNEqfsxt8",
  authDomain: "hf-makeup-backend.firebaseapp.com",
  projectId: "hf-makeup-backend",
  storageBucket: "hf-makeup-backend.firebasestorage.app",
  messagingSenderId: "1034643523470",
  appId: "1:1034643523470:web:26c99d9d59f2d679f586df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function fetchLiveConfig(defaultConfig) {
  try {
    const docRef = doc(db, "app_settings", "live_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultConfig, ...docSnap.data() };
    }
    return defaultConfig;
  } catch (err) {
    console.error("Fetch failed:", err);
    return defaultConfig;
  }
}

export async function updateLiveConfig(newConfig) {
  const docRef = doc(db, "app_settings", "live_config");
  await setDoc(docRef, newConfig);
}
