// frontend/src/app/(Landing Page)/layout.tsx
import Header from '@/components/landing/shared/Header';
import Footer from '@/components/landing/shared/Footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
