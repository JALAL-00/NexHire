'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import axios from 'axios'; 
import Cookies from 'js-cookie'; 
import { LayoutGrid, UserPlus, Briefcase, Calendar, Headset, Leaf, PlusCircle, Star, Mail, LogOut, DollarSign } from 'lucide-react';

const RecruiterSidebar = () => {
  const router = useRouter(); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const handleLogout = async () => {
    const token = Cookies.get('auth_token');
    try {
      if (token) {
        axios.post(`${API_URL}/auth/logout`, { token });
      }
    } catch (error) {
      console.error("Logout API call failed, but logging out client-side anyway.", error);
    } finally {
      Cookies.remove('auth_token');
      router.push('/home');
    }
  };

  const menuLinkItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/recruiter-dashboard', active: true },
    { icon: PlusCircle, label: 'Create New Job', href: '/create-job' },
    { icon: Briefcase, label: 'My Jobs', href: '/manage-jobs' },
    { icon: UserPlus, label: 'Find Candidates', href: '/find-candidate' },
    { icon: Star, label: 'Shortlisted Candidates', href: '/shortlisted-candidates' },
    { icon: Calendar, label: 'Interviews Schedule', href: '/interviews-schedule' },
    { icon: Mail, label: 'Send Email', href: '' },
    { icon: DollarSign, label: 'Plans & Billing', href: '/pricing' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-base-100 p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center gap-2 p-2 mb-8">
          <Leaf className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold hidden lg:inline">NexHire</span>
        </div>
        <ul className="menu space-y-2">
          {menuLinkItems.map(item => (
            <li key={item.label}>
              <Link href={item.href} className={item.active ? 'active' : ''}>
                <item.icon size={20} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <a onClick={handleLogout} className="cursor-pointer">
              <LogOut size={20} />
              <span className="hidden lg:inline">Logout</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <Link href="#" className="btn btn-ghost w-full justify-start">
          <Headset size={20} /> <span className="hidden lg:inline">Help</span>
        </Link>
      </div>
    </aside>
  );
};

export default RecruiterSidebar;