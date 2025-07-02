'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMyProfile } from '@/lib/api';
import { getUserProfileById } from '@/lib/api/users'; // We'll use this to get role
import { User } from '@/types';

// Dynamically import BOTH profile view components
import CandidateProfileView from '@/components/Candidate-Profile/ProfileView';
import RecruiterProfileView from '@/components/Recruiter-Profile/ProfileView';

export default function PublicProfilePage() {
  const params = useParams();
  const profileId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileToView, setProfileToView] = useState<User | null>(null); // State for the profile being viewed
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch the profile of the page we are on to determine their role
        const targetProfile = await getUserProfileById(profileId);
        setProfileToView(targetProfile);

        // Fetch the currently logged-in user to check for ownership
        const loggedInUser = await getMyProfile();
        setCurrentUser(loggedInUser);

      } catch (error) {
        console.error('Error fetching profile data:', error);
        // It's okay if getMyProfile fails, means viewer is not logged in.
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
        fetchInitialData();
    }
  }, [profileId]);

  if (isLoading) {
    return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (!profileToView) {
    return <div className="alert alert-error m-8">Profile not found.</div>;
  }

  // Determine if the current viewer is the owner of the profile.
  const isOwner = currentUser ? currentUser.id.toString() === profileId : false;

  // --- THIS IS THE KEY LOGIC ---
  // Render the correct profile view based on the role of the user whose profile is being viewed.
  if (profileToView.role === 'recruiter') {
    return <RecruiterProfileView userId={profileId} isOwner={isOwner} />;
  }
  
  if (profileToView.role === 'candidate') {
    return <CandidateProfileView userId={profileId} isOwner={isOwner} />;
  }

  return <div className="alert alert-warning m-8">Unknown user role.</div>;
}