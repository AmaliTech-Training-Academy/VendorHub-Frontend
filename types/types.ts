export type UserRole = "VENDOR" | "EMPLOYEE";
export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  role: "VENDOR" | "EMPLOYEE";
  email: string;
  password: string;
  businessName?: string;
  ownerName?: string;
  fullName?: string;
};
export type AuthMode = "login" | "register";
export type AudienceTab = "employees" | "vendors";
