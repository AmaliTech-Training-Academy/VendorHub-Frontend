export enum UserRole {
  VENDOR = "VENDOR",
  EMPLOYEE = "EMPLOYEE",
}

export enum VerificationStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
}

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  role: UserRole;
  email: string;
  password: string;
  businessName?: string;
  ownerName?: string;
  fullName?: string;
  phone?: string | null;
  officeAddress?: string | null;
};

export type AuthMode = "login" | "register";
export type AudienceTab = "employees" | "vendors";
