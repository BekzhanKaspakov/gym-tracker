import axios from "axios";
import qs from "qs";

import { CustomEvents } from "../events";

import { getCookie } from "./utils";
import {
  STORAGE_KEYS,
  XSRF_TOKEN_COOKIE,
  XSRF_TOKEN_HEADER,
} from "../constants/auth.constants";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  formSerializer: {
    indexes: null,
  },
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: "comma", encode: false }),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (accessToken) {
      config.headers.Authorization =
        config.headers["Authorization"] || `Bearer ${accessToken}`;
    }

    const xsrfToken = getCookie(XSRF_TOKEN_COOKIE);

    if (xsrfToken) {
      config.headers[XSRF_TOKEN_HEADER] = xsrfToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      error.response &&
      error.response.status === 401 &&
      !!localStorage.getItem(STORAGE_KEYS.isAuth)
    ) {
      const event = new Event(CustomEvents.UNAUTHORIZED);
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  },
);
