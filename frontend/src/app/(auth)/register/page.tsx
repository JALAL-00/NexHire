'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const registerUser = async (data: any) => {
  const response = await axios.post('http://localhost:3000/auth/register', data);
  return response.data;
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName?: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toLowerCase();
    if (roleParam === 'candidate' || roleParam === 'recruiter') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  if (!validateEmail(formData.email)) {
    setError('Please enter a valid Gmail address with the first letter in lowercase.');
    setLoading(false);
    return;
  }

  if (!validatePassword(formData.password)) {
    setError('Password must be at least 8 characters long, contain uppercase, lowercase, and special characters (@$!%*?&).');
    setLoading(false);
    return;
  }

    const registrationData: typeof formData & { role: string; companyName?: string } = {
      ...formData,
      role: role,
    };

    if (role !== 'recruiter') {
      delete registrationData.companyName;
    }

    try {
      await registerUser(registrationData);
      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // We specify the chosen role AND the action, which is 'register'.
    const state = btoa(JSON.stringify({ role, action: 'register' }));
    window.location.href = `http://localhost:3000/auth/google?state=${state}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body flex flex-col gap-3.5" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          {error && <div className="alert alert-error text-sm p-2">{error}</div>}

          <div className="form-control">
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className={`btn w-40 ${role === 'candidate' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('candidate')}
              >
                I'm a Candidate
              </button>
              <button
                type="button"
                className={`btn w-40 ${role === 'recruiter' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('recruiter')}
              >
                I'm a Recruiter
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">First Name</span></label>
            <input
              name="firstName"
              type="text"
              placeholder="Jalal"
              className="input input-bordered w-full"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Last Name</span></label>
            <input
              name="lastName"
              type="text"
              placeholder="Uddin"
              className="input input-bordered w-full"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          {role === 'recruiter' && (
            <div className="form-control transition-all duration-300 ease-in-out">
              <label className="label"><span className="label-text">Company Name</span></label>
              <input
                name="companyName"
                type="text"
                placeholder="Tech LTD"
                className="input input-bordered w-full"
                required={role === 'recruiter'}
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              className="input input-bordered w-full"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>

          <div className="form-control">
            <button type="submit" className="btn btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Register'}
            </button>
          </div>

          <div className="divider">OR</div>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline flex items-center gap-2 w-full"
          >
            <FcGoogle size={24} /> Continue with Google
          </button>

          <p className="text-center mt-2 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}