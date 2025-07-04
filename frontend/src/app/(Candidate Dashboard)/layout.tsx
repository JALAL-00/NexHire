
import Navbar from '@/components/shared/Navbar'; 
import Footer from '@/components/shared/Footer';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}