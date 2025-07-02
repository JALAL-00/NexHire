'use client';
import { ApplicantCard } from './ApplicantCard';
import { Applicant } from '@/types';

interface ApplicationColumnProps {
  title: string;
  count: number;
  applicants: Applicant[];
  onCardClick: (applicant: Applicant) => void;
  // --- THIS IS THE FIX (Part 4): Ensure this signature matches the parent's function ---
  onDownloadCV: (e: React.MouseEvent, resumePath: string | null) => void;
}

export const ApplicationColumn = ({ title, count, applicants, onCardClick, onDownloadCV }: ApplicationColumnProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex-shrink-0 w-full">
      <h2 className="font-bold text-gray-700 mb-4">{title} ({count})</h2>
      <div className="space-y-4">
        {applicants.map((applicant) => (
          <div key={applicant.id} onClick={() => onCardClick(applicant)} className="cursor-pointer">
            <ApplicantCard 
              applicant={applicant} 
              onDownloadCV={onDownloadCV} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};