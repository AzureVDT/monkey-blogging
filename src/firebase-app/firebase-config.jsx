import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBkMPFIOcaIGbi4uT4wyO0YGX9eQQ5Oif8",
    authDomain: "monkey-blogging-d6c77.firebaseapp.com",
    projectId: "monkey-blogging-d6c77",
    storageBucket: "monkey-blogging-d6c77.appspot.com",
    messagingSenderId: "606095636747",
    appId: "1:606095636747:web:ae8099a1656505c2a94a0e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
