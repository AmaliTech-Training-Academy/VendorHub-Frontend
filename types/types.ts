export type UserRole = "vendor" | "employee";
export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  password: string;
  role: UserRole;
};

export type AuthMode = "login" | "register";
export type AudienceTab = "employees" | "vendors";
