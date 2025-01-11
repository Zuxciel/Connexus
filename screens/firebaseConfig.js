import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get, child, push, query, orderByChild, limitToLast, onValue, update } from 'firebase/database';

// Firebase config object (Change with your firebase API)
const firebaseConfig = {
  // Your Firebase API
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Change initializeAuth with getAuth
const db = getDatabase(app);

export { auth, db, set, ref, get, child, signOut, push, query, orderByChild, limitToLast, onValue, update };
