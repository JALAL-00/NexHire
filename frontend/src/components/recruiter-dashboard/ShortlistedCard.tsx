'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, MessageSquare, CalendarPlus } from 'lucide-react';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ShortlistedCardProps {
  application: {
    id: number;
    job: {
      title: string;
    };
    candidate: {
      id: number;
      firstName: string;
      lastName: string;
      candidateProfile?: {
        title?: string;
        profilePicture?: string | null;
      };
    };
  };
}

export const ShortlistedCard = ({ application }: ShortlistedCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id: applicationId, candidate, job } = application;
  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  const avatarUrl = candidate.candidateProfile?.profilePicture
    ? `${API_URL}/uploads/${candidate.candidateProfile.profilePicture}`
    : null;

  return (
    <>
      <div className="card bg-base-100 shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="card-body items-center text-center p-6">
          <div className="avatar">
            {/* --- 1. UPDATED RING COLOR --- */}
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {avatarUrl ? (
                  <Image src={avatarUrl} width={96} height={96} alt={fullName} className="object-cover" />
              ) : (
                  <div className="flex items-center justify-center w-full h-full bg-neutral-focus text-neutral-content">
                      <span className="text-3xl">{fullName.charAt(0).toUpperCase()}</span>
                  </div>
              )}
            </div>
          </div>
          <h2 className="card-title mt-4">{fullName}</h2>
          <p className="text-primary font-semibold">{candidate.candidateProfile?.title || 'No Title'}</p>
          <div className="badge badge-ghost mt-1">
            Shortlisted for: {job.title}
          </div>
          <div className="card-actions mt-4 w-full grid grid-cols-1 gap-2">
            {/* --- 2. UPDATED BUTTON COLOR --- */}
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <CalendarPlus size={16} /> Schedule Interview
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/profiles/${candidate.id}`} className="btn btn-outline btn-sm">
                  <Eye size={16} /> Profile
              </Link>
              <Link href={`/messages?userId=${candidate.id}`} className="btn btn-outline btn-sm">
                  <MessageSquare size={16} /> Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ScheduleInterviewModal
          applicationId={applicationId}
          candidateName={fullName}
          jobTitle={job.title}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { /* You could add a success indicator here */ }}
        />
      )}
    </>
  );
};