import { LoginResponse, RegisterResponse } from "@/types/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = Array.isArray(errorBody?.detail)
      ? errorBody.detail.join(" ")
      : errorBody?.detail || "Something went wrong";
    throw new Error(message);
  }

  return res.json();
}

export const registerVendor = (data: {
  email: string;
  password: string;
  business_name: string;
  owner_name: string;
}) => apiRequest<RegisterResponse>("accounts/vendor/register/", data);

export const registerEmployee = (data: {
  email: string;
  password: string;
  full_name: string;
}) => apiRequest<RegisterResponse>("accounts/employee/register/", data);

export const loginUser = (data: { email: string; password: string }) =>
  apiRequest<LoginResponse>("accounts/login/", data);
