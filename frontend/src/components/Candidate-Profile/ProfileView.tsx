'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Briefcase, Pencil, LayoutTemplate, CheckCircle, MessageSquare, Settings } from 'lucide-react';
import ActivitySection from '@/components/Candidate-Profile/sections/ActivitySection';
import AboutSection from '@/components/Candidate-Profile/sections/AboutSection';
import ServicesSection from '@/components/Candidate-Profile/sections/ServicesSection';
import ExperienceSection from '@/components/Candidate-Profile/sections/ExperienceSection';
import EducationSection from '@/components/Candidate-Profile/sections/EducationSection';
import SkillsSection from '@/components/Candidate-Profile/sections/SkillsSection';
import ImageUpload from '@/components/profile/ImageUpload';
import { getMyProfile } from '@/lib/api';
import { getUserProfileById } from '@/lib/api/users';
import { User } from '@/types';
import { getInitials } from '@/lib/utils';

const TABS = ['Timeline', 'About', 'Services', 'Experience', 'Education', 'Skills'];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ProfileViewProps {
  userId?: string | number;
  isOwner: boolean;
}

export default function ProfileView({ userId, isOwner }: ProfileViewProps) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Timeline');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const rawUserData = userId ? await getUserProfileById(userId) : await getMyProfile();
        
        if (rawUserData) {
          setProfile(rawUserData);
        } else {
          throw new Error('Profile data could not be found.');
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // --- THIS IS THE FIX ---
    // The call to fetchProfileData() must be inside the useEffect hook's body.
    // The extra call outside of it has been removed.
    fetchProfileData();

  }, [userId]);

  const handleUploadSuccess = (imageType: 'profilePicture' | 'coverPhoto', newPath: string) => {
    setProfile(prev => {
        if (!prev || !prev.candidateProfile) return prev;
        return {
            ...prev,
            candidateProfile: {
                ...prev.candidateProfile,
                [imageType]: newPath,
            },
        };
    });
  };
  
  if (isLoading) {
    return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error || !profile) {
    return <div className="alert alert-error m-8">{error || 'Profile could not be loaded.'}</div>;
  }
  
  const displayProfile = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      title: profile.candidateProfile?.title || 'No title specified',
      availability: profile.candidateProfile?.availability || 'Not specified',
      location: profile.candidateProfile?.location || 'Not specified',
      experience: profile.candidateProfile?.experience || [],
      education: profile.candidateProfile?.education || [],
      profilePicture: profile.candidateProfile?.profilePicture,
      coverPhoto: profile.candidateProfile?.coverPhoto,
      about: profile.candidateProfile?.about || 'No information provided.',
      services: profile.candidateProfile?.services || 'No services listed.',
      skills: profile.candidateProfile?.skills || [],
  };

  const fullProfilePicUrl = displayProfile.profilePicture 
    ? `${API_URL}/uploads/${displayProfile.profilePicture}` 
    : '/default-avatar.png';

  return (
    <div className="bg-base-100 min-h-screen">
      <header className="relative h-60 md:h-80 w-full bg-gray-200">
        <ImageUpload
          imageType="coverPhoto"
          currentImageUrl={displayProfile.coverPhoto}
          onUploadSuccess={(newPath) => handleUploadSuccess('coverPhoto', newPath)}
          className="w-full h-full"
          disabled={!isOwner}
        />
      </header>
      <div className="container mx-auto px-4 pb-24">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 -mt-24">
            <div className="sticky top-24">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <ImageUpload
                  imageType="profilePicture"
                  currentImageUrl={displayProfile.profilePicture}
                  onUploadSuccess={(newPath) => handleUploadSuccess('profilePicture', newPath)}
                  isProfilePic={true}
                  className="w-40 h-40 -mt-5"
                  disabled={!isOwner}
                  userName={`${displayProfile.firstName} ${displayProfile.lastName}`} 
                />
                <h1 className="text-3xl font-bold mt-6">{displayProfile.firstName} {displayProfile.lastName}</h1>
                
                {isOwner && (
                  <div className="badge badge-success gap-2 mt-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {displayProfile.availability}
                  </div>
                )}
                
                <div className="space-y-3 mt-6 text-gray-600 w-full">
                  <p className="flex items-center gap-3"><Settings size={18} /> {displayProfile.title}</p>
                  <p className="flex items-center gap-3"><MapPin size={18} /> {displayProfile.location}</p>
                  <p className="flex items-center gap-3"><Mail size={18} /> {displayProfile.email}</p>
                </div>
                
                {isOwner && (
                  <>
                    <div className="w-full space-y-3 mt-8">
                      <Link href="/candidate-settings" className="btn btn-primary btn-block">
                        <Pencil size={18} /> Edit Profile Info
                      </Link>
                      <Link href="/pricing" className="btn btn-outline btn-block">
                        <LayoutTemplate size={18} /> Customize Profile
                        <span className="badge badge-info">PRO</span>
                      </Link>
                    </div>
                    <div className="card bg-base-200/50 border w-full mt-8">
                      <div className="card-body">
                        <h2 className="card-title">Hire {displayProfile.firstName}</h2>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="font-semibold">Freelance/Project</p>
                            <p className="text-sm text-gray-500">Availability: Now</p>
                          </div>
                          <CheckCircle className="text-success" size={24} />
                        </div>
                        <div className="card-actions mt-4">
                          <Link 
                            href="/candidate-settings?section=availability" 
                            className="btn btn-outline btn-primary btn-sm btn-block"
                          >
                            <MessageSquare size={16} /> Edit Availability
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
            <main className="lg:col-span-9 pt-8">
              <div className="tabs tabs-bordered">
                {TABS.map((tab) => (
                  <a key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</a>
                ))}
              </div>
              <div className="mt-6">
              {activeTab === 'Timeline' && (
                <ActivitySection
                  profilePic={fullProfilePicUrl}
                  userName={`${displayProfile.firstName} ${displayProfile.lastName}`}
                  userId={profile.id}
                  isOwner={isOwner}
                />
              )}
              {activeTab === 'About' && <AboutSection aboutText={displayProfile.about || ''} />}
              {activeTab === 'Services' && <ServicesSection servicesText={displayProfile.services || ''} />}
              {activeTab === 'Experience' && <ExperienceSection experienceData={displayProfile.experience || []} />}
              {activeTab === 'Education' && <EducationSection educationData={displayProfile.education || []} />}
              {activeTab === 'Skills' && <SkillsSection skillsData={displayProfile.skills || []} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}