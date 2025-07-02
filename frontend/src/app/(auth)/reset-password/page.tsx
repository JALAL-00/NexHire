'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [token, setToken] = useState(''); // Changed from 'otp' to 'token'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- Validation ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 6) { // Match backend MinLength(6)
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // --- Construct the payload to match your backend DTO ---
    const payload = {
      token: token, // Changed from 'OTP' to 'token'
      password: password,
    };

    try {
      await axios.post(`${API_URL}/auth/reset-password`, payload);
      
      alert('Password has been reset successfully! Please log in.');
      router.push('/login'); // Redirect to login page on success

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The code may be invalid or expired.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Reset Your Password</h2>
          
          <p className="text-center text-sm text-gray-500">
            A verification code has been sent to <span className="font-medium">{email || 'your email'}</span>.
          </p>

          {error && <div className="alert alert-error text-sm p-2"><span>{error}</span></div>}

          {/* OTP/Token Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Verification Code</span></label>
            <input
              type="text"
              placeholder="Enter the 6-digit code"
              className="input input-bordered"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
            />
          </div>
          
          {/* New Password Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">New Password</span></label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm New Password Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Confirm New Password</span></label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-control mt-2">
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Reset Password'}
            </button>
          </div>

          <p className="text-center mt-2 text-sm">
            Didn't get a code?{' '}
            <Link href="/forgot-password" className="link link-primary">Resend</Link>
          </p>
        </form>
      </div>
    </div>
  );
}