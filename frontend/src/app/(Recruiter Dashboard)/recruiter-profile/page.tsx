'use client'; // This page should be a client component to handle profile logic

import ProfileView from '@/components/Recruiter-Profile/ProfileView';

// This is a client-side page for the logged-in recruiter's own profile.
export default function MyRecruiterProfilePage() {
  

  return <ProfileView isOwner={true} />;
}