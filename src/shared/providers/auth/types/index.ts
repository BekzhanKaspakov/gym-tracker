import { Dispatch } from "react";

export interface AuthContextType {
  isAuth: boolean;
  setIsAuth: Dispatch<boolean>;
  handleLogout: () => void;
  user: UserContext | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserContext | undefined>>;
}

type EmptyObj = Record<PropertyKey, never>;

export interface UserContext extends EmptyObj {}

export interface AuthProviderProps {
  children?: React.ReactNode;
}
