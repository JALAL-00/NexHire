// src/types/auth.ts

// Matches backend/src/auth/dto/login.dto.ts
export interface LoginDto {
  email: string;
  password: string;
}

// Matches backend/src/auth/dto/register.dto.ts
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

// Matches backend/src/auth/dto/forgot-password.dto.ts
export interface ForgotPasswordDto {
  email: string;
}

// Matches backend/src/auth/dto/reset-password.dto.ts
export interface ResetPasswordDto {
  token: string;
  password: string;
}