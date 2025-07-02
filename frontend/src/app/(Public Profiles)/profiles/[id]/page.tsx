'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMyProfile } from '@/lib/api';
import { User } from '@/types';
import ProfileView from '@/components/Candidate-Profile/ProfileView';

// This is a new "wrapper" page for the ProfileView component.
export default function PublicProfilePage() {
  const params = useParams();
  const profileId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We fetch the logged-in user to see if they are the owner of the profile.
    const fetchCurrentUser = async () => {
      try {
        const user = await getMyProfile();
        setCurrentUser(user);
      } catch (error) {
        // It's okay if this fails; it just means the viewer is not logged in.
        console.log('Viewer is not logged in.');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  // Determine if the current viewer is the owner of the profile.
  const isOwner = currentUser ? currentUser.id.toString() === profileId : false;

  // Render the ProfileView component, passing the ID from the URL and the ownership status.
  return <ProfileView userId={profileId} isOwner={isOwner} />;
}