import { get, post } from "../httpClient";
import type { AuthResponse, LoginRequest, SignupRequest, User } from "../../types/auth";

export const authService = {
  login: (data: LoginRequest) => post<AuthResponse>("/auth/login", data),

  signup: (data: SignupRequest) => post<AuthResponse>("/auth/signup", data),

  logout: () => post<void>("/auth/logout"),

  getProfile: () => get<User>("/auth/me"),
};
