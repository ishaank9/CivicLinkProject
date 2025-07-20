import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK6dyfd6MqiwdZhRZTwqmg2VXvQOgO9_A",
  authDomain: "civiclink2025.firebaseapp.com",
  projectId: "civiclink2025",
  storageBucket: "civiclink2025.firebasestorage.app",
  messagingSenderId: "592301525541",
  appId: "1:592301525541:web:61d53ee383189f2df28dcc",
  measurementId: "G-W75RN2TP17"
};


//to initialize firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

