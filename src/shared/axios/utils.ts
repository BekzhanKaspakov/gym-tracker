import { axiosInstance } from "./base.axios";
import { STORAGE_KEYS } from "../constants/auth.constants";
import { LoginResponse } from "../api/auth";

export const setAuthBearer = () =>
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });

export const setAuthTokens = (authResponse: LoginResponse): void => {
  const { token: accessToken } = authResponse;

  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }

  setAuthBearer();
};

export const setParentAuthTokens = (authResponse: LoginResponse): void => {
  const { token: accessToken } = authResponse;

  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessParentToken, accessToken);
  }

  setAuthTokens(authResponse);
};

export const removeAuthTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.accessParentToken);
  localStorage.removeItem(STORAGE_KEYS.accessTokenExpiry);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.refreshTokenExpiry);
};

export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};
