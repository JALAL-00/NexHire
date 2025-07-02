// src/app/Candidate Dashboard/profile/page.tsx

import type { Metadata } from 'next';
import ProfileView from '@/components/Candidate-Profile/ProfileView'; // Import the client component

// This is a Server Component, so we can export metadata here.
export const metadata: Metadata = {
  title: 'Candidate Profile | Profile', // This sets the browser tab title
  description: 'View and manage your professional profile.',
};

// This page now just renders our interactive client component.
export default function MyCandidateProfilePage() {
    return (
        <ProfileView isOwner={true} />
    );
  }