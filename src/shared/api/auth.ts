import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios";

const AUTH_URI = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
};

interface AuthRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  error: string;
}

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<ErrorResponse>, AuthRequest>({
    mutationFn: (body: AuthRequest) =>
      axiosInstance.post(AUTH_URI.login, body).then(({ data }) => data),
    throwOnError: false,
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError<ErrorResponse>, AuthRequest>({
    mutationFn: (body: AuthRequest) =>
      axiosInstance.post(AUTH_URI.register, body).then(({ data }) => data),
    throwOnError: false,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: (block: boolean = false) =>
      axiosInstance
        .post(AUTH_URI.logout, null, { params: { block } })
        .then(({ data }) => data),
  });
};
