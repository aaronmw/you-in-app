import { initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { firebaseConfig } from 'firebase.config';

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const firebaseAuthProvider = new GoogleAuthProvider();
const firebaseAuth = getAuth();

const useFirebase = () => {
  return {
    firebase,
    firebaseAuth,
    firebaseAuthProvider,
    firestore,
  };
};

export { firebase, firestore, firebaseAuthProvider, firebaseAuth, useFirebase };
