// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "fusion-desk.firebaseapp.com",
  projectId: "fusion-desk",
  storageBucket: "fusion-desk.firebasestorage.app",
  messagingSenderId: "552989620962",
  appId: "1:552989620962:web:a53519d4912359b3443cbb",
  measurementId: "G-9M8XSMVC91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
