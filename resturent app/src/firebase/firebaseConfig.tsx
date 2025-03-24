import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAkoR8VziQ61vHC6F3FiqvMQ94qOiV1XMM",
  authDomain: "job-project-336ba.firebaseapp.com",
  projectId: "job-project-336ba",
  storageBucket: "job-project-336ba.firebasestorage.app",
  messagingSenderId: "313031012028",
  appId: "1:313031012028:web:dc47cd18b9a31d6f72eab9",
  measurementId: "G-ZN9LRBKTK2"
};

// Firebase App initialize
const app = initializeApp(firebaseConfig);

// Services Export
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
