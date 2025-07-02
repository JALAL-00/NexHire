// src/app/(app)/layout.tsx
import Navbar from '@/components/shared/Navbar'; // The dashboard navbar we built before

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}