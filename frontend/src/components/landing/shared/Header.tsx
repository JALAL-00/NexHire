// src/components/landing/shared/Header.tsx
'use client';

import Link from 'next/link';
// Import the 'Menu' icon for our hamburger button
import { Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-base-100 border-b shadow-sm sticky top-0 z-50">
      <div className="navbar container mx-auto px-4 py-3">
        <div className="navbar-start">
          {/* --- NEW: Hamburger Menu for Mobile --- */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <Menu size={24} />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {/* Mobile Links */}
              <li><Link href="/">Explore</Link></li>
              <li><Link href="/jobs">Find Job</Link></li>
              <li><Link href="/assistant">Nexi Ai</Link></li>
              <li><Link href="/scroll-dashboard">Orbit Scroll</Link></li>
              <li><Link href="#">Career Resources</Link></li>
              <div className="divider my-2"></div>
              {/* Auth links for mobile */}
              <li><Link href="/login" className="btn btn-sm btn-outline btn-primary mb-2">Login</Link></li>
              <li><Link href="/register" className="btn btn-sm btn-primary">Register</Link></li>
            </ul>
          </div>
          {/* --- End of Hamburger Menu --- */}

          {/* Logo */}
          <Link href="/" className="btn btn-ghost text-xl font-bold text-primary ml-2 lg:ml-0">
            NexHire
          </Link>
        </div>

        {/* Center menu for Desktop (hidden on mobile) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-gray-700 text-base">
            <li><Link href="/">Explore</Link></li>
            <li><Link href="/jobs">Find Job</Link></li>
            <li><Link href="/assistant">Nexi Ai</Link></li>
            <li><Link href="/scroll-dashboard">Orbit Scroll</Link></li>
            <li><Link href="#">Career Resources</Link></li>
          </ul>
        </div>

        {/* Icons + Auth buttons for Desktop (hidden on mobile) */}
        <div className="navbar-end">
          <div className="hidden md:flex gap-2">
            <Link href="/login" className="btn btn-outline btn-primary">Login</Link>
            <Link href="/register" className="btn btn-primary">Register</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;