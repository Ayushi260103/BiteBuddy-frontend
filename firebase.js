// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bitebuddy-2d99d.firebaseapp.com",
  projectId: "bitebuddy-2d99d",
  storageBucket: "bitebuddy-2d99d.firebasestorage.app",
  messagingSenderId: "1059979288434",
  appId: "1:1059979288434:web:4685218756ec4757f8c7eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app, auth};