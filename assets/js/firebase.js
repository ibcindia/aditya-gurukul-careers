
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD26R1ppRIpSINz_MsHTre2LUyd_IXj-hA",
  authDomain: "aditya-gurukul-careers.firebaseapp.com",
  projectId: "aditya-gurukul-careers",
  storageBucket: "aditya-gurukul-careers.firebasestorage.app",
  messagingSenderId: "15562333909",
  appId: "1:15562333909:web:fc65aecf330fa4cc684c5c",
  measurementId: "G-880HKRFTB3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

