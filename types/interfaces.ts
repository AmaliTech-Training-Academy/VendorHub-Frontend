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
  role: "vendor" | "employee";
  businessName?: string;
  ownerName?: string;
  fullName?: string;
}

export interface AuthState {
  users: User[];
  isLoading: boolean;
  error: string;
  role: UserRole | null;
  register: (formData: RegisterFormValues) => Promise<boolean>;
  login: (formData: LoginFormData) => Promise<boolean>;
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
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  watch: UseFormWatch<RegisterFormData>;
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
