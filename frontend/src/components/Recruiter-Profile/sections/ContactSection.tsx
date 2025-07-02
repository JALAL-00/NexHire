'use client';
import { Mail, Phone, Globe } from 'lucide-react';

interface ContactSectionProps {
  email: string;
  phone: string;
  website: string;
}

export default function ContactSection({ email, phone, website }: ContactSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <p className="flex items-center gap-3">
          <Mail size={18} /> {email}
        </p>
        <p className="flex items-center gap-3">
          <Phone size={18} /> {phone}
        </p>
        <p className="flex items-center gap-3">
          <Globe size={18} /> <a href={website} target="_blank" rel="noopener noreferrer" className="link link-primary">{website}</a>
        </p>
      </div>
    </div>
  );
}