import { useFirebase } from '@/hooks/useFirebase';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from '@firebase/auth';
import { useEffect, useState } from 'react';

const useFirebaseAuth = (): {
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
  user: User | undefined;
} => {
  const { firebaseAuth, firebaseAuthProvider } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (loadedUser) => {
      if (!user && loadedUser) {
        setUser(loadedUser!);
      } else if (user && !loadedUser) {
        setUser(undefined);
      }

      setIsLoading(false);
    });
  }, [firebaseAuth, user]);

  const signIn = () => {
    setIsLoading(true);

    signInWithPopup(firebaseAuth, firebaseAuthProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // TODO: Do something with the error
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signOut = async () => {
    setIsLoading(true);

    await firebaseAuth.signOut();

    setUser(undefined);

    setIsLoading(false);
  };

  return {
    isLoading,
    signIn,
    signOut,
    user,
  };
};

export { useFirebaseAuth };
