import { apiRequest } from "@/lib/api/client";
import type { LoginResponse, RegisterResponse } from "@/types/interfaces";

export const registerVendor = (data: {
  email: string;
  password: string;
  business_name: string;
  owner_name: string;
}) =>
  apiRequest<RegisterResponse>("accounts/vendor/register/", {
    method: "POST",
    body: data,
    auth: false,
  });

export const registerEmployee = (data: {
  email: string;
  password: string;
  full_name: string;
}) =>
  apiRequest<RegisterResponse>("accounts/employee/register/", {
    method: "POST",
    body: data,
    auth: false,
  });

export const loginUser = (data: { email: string; password: string }) =>
  apiRequest<LoginResponse>("accounts/login/", {
    method: "POST",
    body: data,
    auth: false,
  });
