import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyC8Fyhe-Ao8Yl1rm1-lGt_YstUZqDqrlho",
  authDomain: "galleryproref.firebaseapp.com",
  projectId: "galleryproref",
  storageBucket: "galleryproref.firebasestorage.app",
  messagingSenderId: "445452616495",
  appId: "1:445452616495:web:10d1cb1182b1c54b51d7da"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  db
};
