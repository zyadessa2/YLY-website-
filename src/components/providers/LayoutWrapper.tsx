'use client';

import { usePathname } from 'next/navigation';
import { NavbarDemo } from '../my-components/navbar/Navbar';
import Footer from '../my-components/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if current route is dashboard or signin
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname?.startsWith('/signin') || pathname?.startsWith('/register');
  const hideNavbarFooter = isDashboard || isAuthPage;

  if (hideNavbarFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <NavbarDemo />
      {children}
      <Footer />
    </>
  );
}
