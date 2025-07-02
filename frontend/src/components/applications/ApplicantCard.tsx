'use client';

import { MoreVertical, Download, Pencil, Trash2, Eye } from 'lucide-react';
import { Applicant } from '@/types';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component for optimization

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApplicantCardProps {
  applicant: Applicant;
  onDownloadCV: (e: React.MouseEvent, resumePath: string | null) => void;
}

export const ApplicantCard = ({ applicant, onDownloadCV }: ApplicantCardProps) => {
  const educationText = typeof applicant.education === 'string' 
    ? applicant.education 
    : 'N/A';

  // Construct the full avatar URL or use null if not available
  const avatarFullUrl = applicant.avatarUrl ? `${API_URL}/uploads/${applicant.avatarUrl}` : null;

  return (
    <div className="card bg-white shadow-md p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">

          {/* --- THIS IS THE UPDATED AVATAR LOGIC --- */}
          <div className="avatar">
            <div className="w-12 rounded-full">
              {avatarFullUrl ? (
                <Image
                  src={avatarFullUrl}
                  width={48}
                  height={48}
                  alt={applicant.name}
                  className="object-cover"
                  onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} // Fallback for broken images
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-focus text-neutral-content">
                  <span>{applicant.name ? applicant.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <p className="font-bold text-gray-800">{applicant.name}</p>
            <p className="text-sm text-gray-500">{applicant.title}</p>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
            <div onClick={(e) => e.stopPropagation()}><MoreVertical size={18} /></div>
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
            <li onClick={(e) => e.stopPropagation()}><a><Pencil size={14} /> Edit</a></li>
            <li onClick={(e) => e.stopPropagation()}><a><Trash2 size={14} /> Delete</a></li>
          </ul>
        </div>
      </div>
      <div className="divider my-3"></div>
      <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
        <li>{applicant.experience}</li>
        <li>Education: {educationText}</li>
        <li>Applied: {applicant.appliedDate}</li>
      </ul>
      
      <div className="card-actions mt-4 grid grid-cols-2 gap-2">
        <Link 
          href={`/profiles/${applicant.candidateId}`} 
          className="btn btn-sm btn-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye size={16} /> Profile
        </Link>
        <button 
          onClick={(e) => onDownloadCV(e, applicant.resume)}
          className="btn btn-sm btn-outline btn-primary"
          disabled={!applicant.resume}
        >
          <Download size={16} /> Take CV
        </button>
      </div>
    </div>
  );
};