'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: 'candidate' | 'recruiter';
  sub: number;
  email: string;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        // Set the cookie for future authenticated requests
        Cookies.set('auth_token', token, { expires: 1, secure: process.env.NODE_ENV === 'production' });

        // Decode the token to determine the user's role for redirection
        const decodedToken = jwtDecode<DecodedToken>(token);
        
        // Determine the correct dashboard URL
        const dashboardUrl = decodedToken.role === 'recruiter' 
          ? '/recruiter-dashboard' 
          : '/candidate-dashboard';

        // Redirect to the appropriate dashboard, replacing the callback URL in history
        router.replace(dashboardUrl);

      } catch (error) {
        console.error("Failed to process auth token:", error);
        // If the token is invalid, redirect to login with an error
        router.replace('/login?error=invalid_token');
      }
    } else {
      // If no token is found in the URL, redirect to login
      console.error("No token found in callback URL.");
      router.replace('/login?error=auth_failed');
    }
  }, [router, searchParams]);

  // Render a loading state while the effect runs
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-lg">Authenticating, please wait...</p>
      </div>
    </div>
  );
}