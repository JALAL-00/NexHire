// src/app/(Recruiter Dashboard)/layout.tsx
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar'; 
// If you have a shared footer, import it as well
// import Footer from '@/components/shared/Footer';

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Your existing navbar will be displayed on top of the recruiter pages */}
      <Navbar />
      <main>
        {children}
      </main>
      {/* <Footer /> */}
      <Footer/>
    </div>
  );
}