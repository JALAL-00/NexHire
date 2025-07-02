'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Call your backend API to send the OTP
      await axios.post(`${API_URL}/auth/forgot-password`, { email });

      alert('A verification code has been sent to your email.');
      
      // Step 2: Redirect to the reset-password page on success
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset code. Please check the email and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Forgot Password</h2>
          <p className="text-center text-sm text-gray-500">
            Enter your email and we'll send you a code to reset your password.
          </p>
          
          {error && <div className="alert alert-error text-sm p-2">{error}</div>}

          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Send Verification Code'}
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}