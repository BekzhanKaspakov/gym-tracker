"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, UserContext } from "./types";
import { STORAGE_KEYS } from "@/shared/constants/auth.constants";
import { useLogout } from "@/shared/api/auth";
import { removeLocalStorageItems } from "@/shared/utils/removeLocalStorageItems";
import { CustomEvents } from "@/shared/events";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<UserContext>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mutateAsync: logout } = useLogout();

  // Initialize auth state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = !!localStorage.getItem(STORAGE_KEYS.isAuth);
      setIsAuth(auth);
    }
    setIsLoading(false);
  }, []);

  const setIsAuthAndRemoveStorage = () => {
    removeLocalStorageItems();
    setIsAuth(false);
  };

  const handleLogout = useCallback(async () => {
    if (!localStorage.getItem(STORAGE_KEYS.isAuth)) {
      setIsAuthAndRemoveStorage();
      return;
    }

    await logout(undefined, {
      onError: () => {
        removeLocalStorageItems([STORAGE_KEYS.isAuth]);
      },
      onSuccess: () => {
        setIsAuthAndRemoveStorage();
      },
    });
  }, [logout]);

  useEffect(() => {
    const unAuthLogout = () => {
      removeLocalStorageItems();
      setIsAuth(false);
    };

    const handleForcedLogout = () => {
      handleLogout();
    };

    window.addEventListener(CustomEvents.UNAUTHORIZED, unAuthLogout);
    window.addEventListener(CustomEvents.FORCE_LOGOUT, handleForcedLogout);

    return () => {
      window.removeEventListener(CustomEvents.UNAUTHORIZED, unAuthLogout);
      window.removeEventListener(CustomEvents.FORCE_LOGOUT, handleForcedLogout);
    };
  }, [handleLogout]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        handleLogout,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
