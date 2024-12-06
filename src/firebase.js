// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPBGV5LMun4qXFNNs3_oIfE0OYvZVfzRw",
  authDomain: "hotel-management-system-82e7b.firebaseapp.com",
  projectId: "hotel-management-system-82e7b",
  storageBucket: "hotel-management-system-82e7b.firebasestorage.app",
  messagingSenderId: "776082390154",
  appId: "1:776082390154:web:971d2b0f2446fda4958173"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);