// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_5blkGlK1izDGEAkDS7XBWZLpZd9v0tg",
  authDomain: "realtor-clone-react-a557f.firebaseapp.com",
  projectId: "realtor-clone-react-a557f",
  storageBucket: "realtor-clone-react-a557f.appspot.com",
  messagingSenderId: "665483167098",
  appId: "1:665483167098:web:8a15a555b64eddd84642c3",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
