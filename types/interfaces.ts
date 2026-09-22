import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type {
  LoginFormData,
  RegisterFormValues,
  UserRole,
} from "@/types/types";

// types/interfaces.ts
export interface User {
  id: string;
  email: string;
  password: string;
  role: "VENDOR" | "EMPLOYEE";
  businessName?: string;
  ownerName?: string;
  fullName?: string;
}

export interface AuthState {
  role: UserRole | null;
  accessToken: string | null;
  setAuth: (role: UserRole, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export interface UseUserLoginOptions {
  onSuccess?: (role: UserRole | null) => void;
  onError?: (error: string) => void;
}

export interface UseUserRegistrationOptions {
  onSuccess?: (data: RegisterFormValues) => void;
  onError?: (error: string) => void;
}

export interface LoginFieldsProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
}

export interface RegisterFieldsProps {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  setValue: UseFormSetValue<RegisterFormValues>;
  watch: UseFormWatch<RegisterFormValues>;
}

export interface GraphicImage {
  src: string;
  alt: string;
}

export interface OnboardingGraphicsProps {
  images: [GraphicImage, GraphicImage, GraphicImage];
  heading: string;
  highlightedWord: string;
  description: string;
}

export interface AuthConfig {
  images: [GraphicImage, GraphicImage, GraphicImage];
  onboardingHeading: string;
  onboardingHighlight: string;
  onboardingDescription: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix?: string;
  description: string;
  submitLabel: string;
  loadingLabel: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateHref: string;
  panelClassName: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: "VENDOR" | "EMPLOYEE";
}

export interface LoginResponse {
  access: string;
  refresh: string;
  id: number;
  email: string;
  role: "VENDOR" | "EMPLOYEE";
}
