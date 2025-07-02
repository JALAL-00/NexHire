'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface DecodedToken {
  role: 'candidate' | 'recruiter';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const validateEmail = (email: string) => {
    const regex = /^[a-z][a-z0-9._%+-]*@gmail\.com$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid Gmail address with the first letter in lowercase.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain uppercase, lowercase, and special characters (@$!%*?&).');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { access_token } = response.data;
      Cookies.set('auth_token', access_token, { expires: 1 / 24 }); // 1 hour expiration
      const decodedToken = jwtDecode<DecodedToken>(access_token);

      const redirectTo = searchParams.get('redirect_to');

      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        const dashboardUrl = decodedToken.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard';
        router.replace(dashboardUrl);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const state = btoa(JSON.stringify({ action: 'login' }));
    window.location.href = `http://localhost:3000/auth/google?state=${state}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body flex flex-col gap-4" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl font-bold mx-auto">Welcome Back!</h2>

          {error && <div className="alert alert-error text-sm p-2">{error}</div>}

          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="input input-bordered w-full" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                className="input input-bordered w-full" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            <label className="label mt-2">
              <Link href="/forgot-password" className="label-text-alt link link-hover">Forgot password?</Link>
            </label>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full text-base py-3" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Login'}
            </button>
          </div>

          <div className="divider">OR</div>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline flex items-center gap-2"
          >
            <FcGoogle size={24} /> Sign in with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="link link-primary">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}