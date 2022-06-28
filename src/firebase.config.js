// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByn3dfw9OL50Tuj5RKMql8cVC3MHvQ06Y",
  authDomain: "house-marketplace-app-6b2ae.firebaseapp.com",
  projectId: "house-marketplace-app-6b2ae",
  storageBucket: "house-marketplace-app-6b2ae.appspot.com",
  messagingSenderId: "545135513783",
  appId: "1:545135513783:web:0d5b0a44d4d51f7b7dbd32",
  measurementId: "G-BNJRDQ1YZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()