
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjqFRkuO5dlBU_VW0kIMPud8-9pvYGNr0",
  authDomain: "mandiri-startup-academy.firebaseapp.com",
  projectId: "mandiri-startup-academy",
  storageBucket: "mandiri-startup-academy.firebasestorage.app",
  messagingSenderId: "245277580741",
  appId: "1:245277580741:web:2e534e65504ba6800c3fac"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const authPersistenceReady = setPersistence(
  auth,
  browserLocalPersistence
);
