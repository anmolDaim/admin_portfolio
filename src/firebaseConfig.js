// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkN4E1aQ2qraiU3JIbkgNEILtB-KWKkck",
  authDomain: "shreejewellers-53ac3.firebaseapp.com",
  projectId: "shreejewellers-53ac3",
  storageBucket: "shreejewellers-53ac3.appspot.com", // ✅ Fix typo in storage bucket
  messagingSenderId: "785459907919",
  appId: "1:785459907919:web:c75abe0ea7ce34744c493a",
  measurementId: "G-5QPKT8NR69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

export { app, analytics, db, auth }; // ✅ Export Firestore `db`
