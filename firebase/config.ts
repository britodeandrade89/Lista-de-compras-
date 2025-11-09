// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrwC791rplIiqOeXKZTlCaacM8YhKkQdw",
  authDomain: "lista-de-compras-4420b.firebaseapp.com",
  projectId: "lista-de-compras-4420b",
  storageBucket: "lista-de-compras-4420b.appspot.com",
  messagingSenderId: "457388372289",
  appId: "1:457388372289:web:f210e74b357e03ca5b71c0",
  measurementId: "G-DRMYGDKDDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
