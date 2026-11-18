import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPOTDwngfZVDseBmZdFjrlB300nn-RPV0",
    authDomain: "roomiematch-7414a.firebaseapp.com",
      projectId: "roomiematch-7414a",
        storageBucket: "roomiematch-7414a.firebasestorage.app",
          messagingSenderId: "356717110447",
            appId: "1:356717110447:web:0f080c51e508af15de605a"
            };

            const app = initializeApp(firebaseConfig);
            export const auth = getAuth(app);
            export const db = getFirestore(app);
            export { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut };