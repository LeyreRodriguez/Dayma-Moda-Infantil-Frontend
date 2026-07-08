export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  newsletter?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}
