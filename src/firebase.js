// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDd6nDOLxO40xVwlpRlZwwHLEcfQ2N8AXg",
  authDomain: "socialchat-527f0.firebaseapp.com",
  databaseURL: "https://socialchat-527f0-default-rtdb.firebaseio.com",
  projectId: "socialchat-527f0",
  storageBucket: "socialchat-527f0.appspot.com",
  messagingSenderId: "318765202132",
  appId: "1:318765202132:web:b0986e83553cb8e9e41941",
  measurementId: "G-GP5D2SDGE2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const realdb = getDatabase();
export const db = getFirestore();
export const auth = getAuth();

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();
// Create a storage reference from  storage firebase
export const storageRef = ref(storage);
export const checkAuth = (navigate) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("email", user.email);
      localStorage.setItem("id", user.uid);
    } else {
      navigate("/");
    }
  });
};
