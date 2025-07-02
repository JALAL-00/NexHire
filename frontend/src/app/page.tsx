'use client';

import Header from '@/components/landing/shared/Header';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import LandingPage from '@/components/landing/PageView';
import DashboardPage from '@/app/(Candidate Dashboard)/candidate-dashboard/page';

// TEMP: Assume not logged in; you can improve later
const isLoggedIn = false;

export default function HomePage() {
  return (
    <>
      {isLoggedIn ? <Navbar /> : <Header />}
      {isLoggedIn ? <DashboardPage /> : <LandingPage />}
      <Footer />
    </>
  );
}
