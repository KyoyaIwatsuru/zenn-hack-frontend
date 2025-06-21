import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/auth/firebase";

/**
 * Firebase Auth state management hook
 * Provides real-time Firebase Auth state updates
 */
export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;

      setUser(firebaseUser);
      setIsLoading(false);
      setIsInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isInitialized,
    displayName: user?.displayName || null,
  };
}
