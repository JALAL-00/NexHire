'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { getRecentApplicants } from '@/lib/api/applications'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 1. Update the interface to include the email field
interface RecentApplicant {
  id: number;
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string; // <-- Add this line
    candidateProfile?: {
      title?: string;
      profilePicture?: string | null;
    };
  };
}

const NewApplicants = () => {
  const [applicants, setApplicants] = useState<RecentApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentApplicants();
        setApplicants(data as any); 
      } catch (err) {
        setError("Failed to load applicants.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex-grow space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ));
    }

    if (error) {
      return <div className="text-center text-error">{error}</div>;
    }

    if (applicants.length === 0) {
      return <div className="text-center text-gray-500">No new applicants yet.</div>;
    }

    return applicants.map((app) => {
      const applicant = app.candidate;
      const fullName = `${applicant.firstName} ${applicant.lastName}`;
      const avatarUrl = applicant.candidateProfile?.profilePicture
        ? `${API_URL}/uploads/${applicant.candidateProfile.profilePicture}`
        : '/default-avatar.png';

      return (
        <div key={app.id} className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <Image src={avatarUrl} alt={fullName} width={48} height={48} className="object-cover" />
            </div>
          </div>
          <div className="flex-grow">
            <p className="font-bold">{fullName}</p>
            <p className="text-sm text-gray-500">{applicant.candidateProfile?.title || 'No Title'}</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/messages?userId=${applicant.id}`} 
              className="btn btn-ghost btn-circle btn-sm"
              title={`Message ${fullName}`}
            >
              <MessageSquare size={18} />
            </Link>
            
            {/* --- 2. THIS IS THE UPDATED MAIL ICON LOGIC --- */}
            {applicant.email ? (
              <a 
                href={`mailto:${applicant.email}`}
                className="btn btn-ghost btn-circle btn-sm"
                title={`Email ${fullName}`}
              >
                <Mail size={18} />
              </a>
            ) : (
              <button className="btn btn-ghost btn-circle btn-sm" disabled>
                <Mail size={18} />
              </button>
            )}

            <button className="btn btn-ghost btn-circle btn-sm" disabled><Phone size={18} /></button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="card bg-base-100 shadow-md p-6 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">New Applicants</h2>
        <Link href="/find-candidate" className="text-sm text-primary hover:underline">
          See all
        </Link>
      </div>
      <div className="space-y-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default NewApplicants;