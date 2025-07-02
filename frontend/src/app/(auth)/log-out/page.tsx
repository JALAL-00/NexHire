// src/app/(auth)/log-out/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to the login page.
    // Using router.replace() prevents this page from being added to the browser history.
    router.replace('/login');
  }, [router]);

  // This content will likely never be seen by the user.
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <p>Logging you out...</p>
        <span className="loading loading-spinner loading-lg mt-4"></span>
      </div>
    </div>
  );
}