// src/app/api/auth.ts
import api from './api';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '@/types/auth'; // We'll create this types file next

// --- Login ---
export const loginUser = async (data: LoginDto) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    // Re-throw the error to be caught by the component
    throw error.response?.data || new Error('Login failed');
  }
};

// --- Register ---
export const registerUser = async (data: RegisterDto) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error('Registration failed');
  }
};

// --- Forgot Password ---
export const forgotPassword = async (data: ForgotPasswordDto) => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error('Forgot password request failed');
  }
};

// --- Reset Password ---
export const resetPassword = async (data: ResetPasswordDto) => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error('Password reset failed');
  }
};

// --- Logout ---
export const logoutUser = async (token: string) => {
  try {
    // This endpoint might not need the token in the header if it's in the body
    const response = await api.post('/auth/logout', { token });
    return response.data;
  } catch (error: any) {
    // We often don't care if this fails, but we can log it
    console.error('Backend logout failed, proceeding with client-side logout.');
    throw error;
  }
};

// --- Delete Account ---
export const deleteAccount = async () => {
  try {
    // The interceptor in api.ts automatically adds the Authorization header
    const response = await api.delete('/auth/account');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error('Account deletion failed');
  }
};