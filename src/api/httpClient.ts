import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const IMAGE_ORIGIN = API_BASE_URL.startsWith("http")
  ? new URL(API_BASE_URL).origin
  : "http://localhost:8080";

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? `${IMAGE_ORIGIN}${path}` : `${IMAGE_ORIGIN}/${path}`;
}

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/me") &&
      !error.config.url?.includes("/auth/login") &&
      !error.config.url?.includes("/auth/signup")
    ) {
      localStorage.removeItem("auth_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>) && "success" in (raw as Record<string, unknown>)) {
    return (raw as ApiResponse<T>).data as T;
  }
  return raw as T;
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.get<T>(url, config);
  return unwrap<T>(data);
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.post<T>(url, body, config);
  return unwrap<T>(data);
}

export async function put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.put<T>(url, body, config);
  return unwrap<T>(data);
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.delete<T>(url, config);
  return unwrap<T>(data);
}

export async function postFormData<T>(url: string, formData: FormData): Promise<T> {
  const { data } = await httpClient.post<T>(url, formData, {
    headers: {
      "Content-Type": undefined, 
    },
  });
  return unwrap<T>(data);
}

export default httpClient;
