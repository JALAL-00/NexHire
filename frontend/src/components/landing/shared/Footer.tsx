'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = [
  {
    title: 'Quick Link',
    items: ['About', 'Contact', 'Pricing', 'Blog'],
  },
  {
    title: 'Candidate',
    items: ['Browse Jobs', 'Browse Employers', 'Candidate Dashboard', 'Saved Jobs'],
  },
  {
    title: 'Employers',
    items: ['Post a Job', 'Browse Candidates', 'Employers Dashboard', 'Applications'],
  },
  {
    title: 'Support',
    items: ['Faqs', 'Privacy Policy', 'Terms & Conditions'],
  },
];

const socialIcons = [
  { icon: <Facebook size={20} />, href: '#' },
  { icon: <Twitter size={20} />, href: '#' },
  { icon: <Instagram size={20} />, href: '#' },
  { icon: <Youtube size={20} />, href: '#' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Branding */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-white mb-4">NexHire</h4>
            <p className="text-sm">
              Call now:{' '}
              <span className="text-white font-semibold">(+880) 1571314883</span>
            </p>
            <p className="text-sm mt-2">
              408/1 (Old KA 66/1), Kuratoli, Khilkhet, Dhaka, Bangladesh
            </p>
          </div>

          {/* Dynamic Footer Columns */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="md:col-span-2">
              <h4 className="font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© 2025 NexHire. All Rights Reserved</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {socialIcons.map((s, i) => (
              <Link href={s.href} key={i} className="hover:text-white">
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
