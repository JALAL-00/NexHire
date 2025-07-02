// src/types/index.ts

export interface EducationInfo {
  degree: string;
  institution: string;
  year: number;
}

export interface FullApplicantDetails {
  applicationId: number;
  status: string;
  
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    resume: string | null;
    candidateProfile?: {
      title?: string;
      experience?: { title: string; org: string }[];
      education?: { degree: string; institution: string; }[];
      about?: string;
      profilePicture?: string | null;
    };
  };
}

export interface Applicant {
  id: number;
  candidateId: number;
  name: string;
  title: string;
  experience: string;
  appliedDate: string;
  avatarUrl?: string | null;
  education: EducationInfo[] | string;
  resume: string | null;
  fullDetails: FullApplicantDetails;
}

// This interface is correct and contains all the needed properties.
export interface RecruiterProfile {
  id: number;
  designation?: string;
  companyName?: string;
  profilePicture?: string | null;
  coverPhoto?: string | null;
  location?: string;
  website?: string;
  about?: string;
}

export interface Recruiter {
  id: number;
  companyName?: string;
  email?: string;
  phone?: string; 
  recruiterProfile?: RecruiterProfile; 
}

export interface Job {
  id: number;
  title: string;
  description: string;
  responsibilities?: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  education?: string;
  jobType?: string; 
  jobLevel?: string;
  // --- FIX 1: Make the status property non-optional ---
  // This resolves the error in `OpenJobsSection.tsx`.
  status: 'Active' | 'Expired'; 
  createdAt?: string; 
  expirationDate?: string; 
  recruiter?: Recruiter; 
}


export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'recruiter';
  
  // --- FIX 2: Add the missing top-level phone property ---
  phone?: string | null;

  candidateProfile?: {
    id: number;
    title?: string;
    profilePicture?: string | null;
    location?: string;
    availability?: string;
    experience?: any[]; 
    education?: any[];  
    coverPhoto?: string | null;
    about?: string;
    services?: string;
    skills?: string[];
    savedJobs?: { id: number; title: string }[];
  };

  // --- FIX 3: Use the detailed `RecruiterProfile` interface here ---
  // Instead of an inline definition, this now correctly references the detailed interface above.
  recruiterProfile?: RecruiterProfile;

  applications?: {
    id: number;
    job: { id: number };
  }[];
}