import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAs1Do6IFcCuCRtMY9fbBYTtoZ6nEd4LDA",
  authDomain: "resto-management-6805b.firebaseapp.com",
  projectId: "resto-management-6805b",
  storageBucket: "resto-management-6805b.appspot.com",
  messagingSenderId: "677414113431",
  appId: "1:677414113431:web:2bdf48fb3e0752e27899d2",
};

const firestore = initializeApp(firebaseConfig);

export default firestore;
