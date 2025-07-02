'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <h4 className="font-bold text-white mb-4">NexHire</h4>
          <p className="text-sm">
            Call now: <span className="text-white font-semibold">(+880) 1571314883</span>
          </p>
          <p className="text-sm mt-2">
            408/1 (Old KA 66/1), Kuratoli, Khilkhet, Dhaka, Bangladesh
          </p>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-4">Quick Link</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">About</Link></li>
            <li><Link href="#" className="hover:text-white">Contact</Link></li>
            <li><Link href="#" className="hover:text-white">Pricing</Link></li>
            <li><Link href="#" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-4">Candidate</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Browse Jobs</Link></li>
            <li><Link href="#" className="hover:text-white">Browse Employers</Link></li>
            <li><Link href="#" className="hover:text-white">Candidate Dashboard</Link></li>
            <li><Link href="#" className="hover:text-white">Saved Jobs</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-4">Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Post a Job</Link></li>
            <li><Link href="#" className="hover:text-white">Browse Candidates</Link></li>
            <li><Link href="#" className="hover:text-white">Employers Dashboard</Link></li>
            <li><Link href="#" className="hover:text-white">Applications</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Faqs</Link></li>
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>© 2025 NexHire. All Rights Reserved</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-white"><Facebook size={20} /></Link>
          <Link href="#" className="hover:text-white"><Twitter size={20} /></Link>
          <Link href="#" className="hover:text-white"><Instagram size={20} /></Link>
          <Link href="#" className="hover:text-white"><Youtube size={20} /></Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
