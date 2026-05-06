import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnPivbKPgbTW1cWBtaLanx7kNeb8SoEIA",
  authDomain: "nexr-580d8.firebaseapp.com",
  projectId: "nexr-580d8",
  storageBucket: "nexr-580d8.firebasestorage.app",
  messagingSenderId: "210792020149",
  appId: "1:210792020149:web:028b4bf12ca454ede1a6fc"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();