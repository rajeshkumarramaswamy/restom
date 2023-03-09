// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs1Do6IFcCuCRtMY9fbBYTtoZ6nEd4LDA",
  authDomain: "resto-management-6805b.firebaseapp.com",
  projectId: "resto-management-6805b",
  storageBucket: "resto-management-6805b.appspot.com",
  messagingSenderId: "677414113431",
  appId: "1:677414113431:web:4f689bc8d8043f8b7899d2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
