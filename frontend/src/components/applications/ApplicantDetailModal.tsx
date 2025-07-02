'use client';

import { useState } from 'react';
import {
  X,
  Star,
  Download,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { FullApplicantDetails } from '@/types';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import Image component

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // 2. Define API_URL

interface ApplicantDetailModalProps {
  applicant: FullApplicantDetails;
  onClose: () => void;
  onDownloadCV: (e: React.MouseEvent, resumePath: string | null) => void;
  onUpdateStatus: (
    applicationId: number,
    status: 'pending' | 'accepted' | 'rejected'
  ) => Promise<void>;
}

const InfoCardItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 flex items-center gap-2">
        <Icon size={14} /> {label}
      </p>
      <p className="font-semibold text-gray-800 mt-1 whitespace-pre-wrap">{value}</p>
    </div>
  );
};

export const ApplicantDetailModal = ({
  applicant,
  onClose,
  onDownloadCV,
  onUpdateStatus,
}: ApplicantDetailModalProps) => {
  const { candidate, applicationId } = applicant;
  const [isUpdating, setIsUpdating] = useState(false);

  const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();

  // 3. Create the full URL for the avatar
  const avatarFullUrl = candidate.candidateProfile?.profilePicture
    ? `${API_URL}/uploads/${candidate.candidateProfile.profilePicture}`
    : null;

  const experienceString = (() => {
    const expArray = candidate.candidateProfile?.experience;
    if (!Array.isArray(expArray) || expArray.length === 0) return 'No experience details provided.';
    return expArray.map(e => `${e.title || 'Role'} at ${e.org || 'Company'}`).join('\n');
  })();

  const educationString = (() => {
    const eduArray = candidate.candidateProfile?.education;
    if (!Array.isArray(eduArray) || eduArray.length === 0) return 'No education details provided.';
    return eduArray.map(e => `${e.degree || 'Degree'} at ${e.institution || 'Institution'}`).join('\n');
  })();

  const handleStatusChange = async (newStatus: 'pending' | 'accepted' | 'rejected') => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(applicationId, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-4xl p-0">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white/50 hover:bg-white"
        >
          <X />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b p-6 sm:p-8">
          {/* --- 3. Updated Avatar Logic --- */}
          <div className="avatar">
            <div className="w-24 rounded-full">
              {avatarFullUrl ? (
                <Image
                  src={avatarFullUrl}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} // Fallback for broken images
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-focus text-neutral-content">
                  <span className="text-3xl">{fullName.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-bold text-2xl">{fullName}</h3>
            <p className="text-gray-500">{candidate.candidateProfile?.title || 'No title provided'}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="btn btn-outline btn-square" title="Save Candidate">
              <Star />
            </button>
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn btn-primary${isUpdating ? ' btn-disabled' : ''}`}
                aria-disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Status'} <ChevronDown size={16} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><a onClick={() => handleStatusChange('accepted')}>Accept (Move to Interview)</a></li>
                <li><a onClick={() => handleStatusChange('pending')}>Shortlist (Move to Pending)</a></li>
                <li><a onClick={() => handleStatusChange('rejected')}>Reject (Move to Rejected)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          <div className="lg:col-span-2 prose max-w-none">
            <h4>PROFILE SUMMARY</h4>
            {/* --- 4. Use 'about' for the summary --- */}
            <p>{candidate.candidateProfile?.about || 'No summary provided.'}</p>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="card bg-base-200/50 p-6 rounded-lg">
              <div className="space-y-4">
                <InfoCardItem icon={Briefcase} label="EXPERIENCE" value={experienceString} />
                <InfoCardItem icon={GraduationCap} label="EDUCATION" value={educationString} />
                <InfoCardItem icon={Mail} label="EMAIL ADDRESS" value={candidate.email} />
                <InfoCardItem icon={Phone} label="PHONE" value={candidate.phone} />
              </div>
            </div>

            <Link href={`/profiles/${candidate.id}`} className="btn btn-primary btn-block">
              <Eye size={16} /> View Full Profile
            </Link>
            {candidate.resume ? (
              <button
                onClick={(e) => onDownloadCV(e, candidate.resume)}
                className="btn btn-outline btn-primary btn-block"
              >
                <Download size={16} /> Download CV
              </button>
            ) : (
              <p className="text-sm text-gray-500 text-center">No resume uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};