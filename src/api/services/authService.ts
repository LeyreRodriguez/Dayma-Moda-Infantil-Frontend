import { get, post } from "../httpClient";
import type { AuthResponse, LoginRequest, SignupRequest, User, GoogleLoginRequest } from "../../types/auth";

export const authService = {
  login: (data: LoginRequest) => post<AuthResponse>("/auth/login", data),

  signup: (data: SignupRequest) => post<AuthResponse>("/auth/signup", data),

  logout: () => post<void>("/auth/logout"),

  getProfile: () => get<User>("/auth/me"),

  googleLogin: (data: GoogleLoginRequest) =>
    post<AuthResponse>("/auth/google/login", data),

  googleSignup: (data: GoogleLoginRequest) =>
    post<AuthResponse>("/auth/google/register", data),

  subscribe: () => post<string>("/newsletter/subscribe"),
};
