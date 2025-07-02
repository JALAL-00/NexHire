// src/app/Candidate Dashboard/profile/page.tsx

import type { Metadata } from 'next';
import ProfileView from '@/components/Recruiter-Profile/ProfileView'; // Import the client component

// This is a Server Component, so we can export metadata here.
export const metadata: Metadata = {
  title: 'Recruiter Profile | Profile', // This sets the browser tab title
  description: 'View and manage your professional profile.',
};

// This page now just renders our interactive client component.
export default function ProfilePage() {
  return <ProfileView isOwner={false} />;
}

