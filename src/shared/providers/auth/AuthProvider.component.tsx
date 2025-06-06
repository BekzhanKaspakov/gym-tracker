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
  const isAuthInit =
    typeof window !== "undefined"
      ? !!localStorage.getItem(STORAGE_KEYS.isAuth)
      : false;
  const [isAuth, setIsAuth] = useState<boolean>(isAuthInit);
  const [user, setUser] = useState<UserContext>();
  const { mutateAsync: logout } = useLogout();

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
        // window.location используется из-за того что AuthProvider расположен вне контекста AppRouter
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
  }, [setIsAuth, handleLogout]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        handleLogout,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
