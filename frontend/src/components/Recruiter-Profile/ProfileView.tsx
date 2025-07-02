'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Briefcase, Pencil, Settings, Globe, CheckCircle, LayoutTemplate } from 'lucide-react';
import ImageUpload from '@/components/profile/ImageUpload';
import { getMyProfile, getRecruiterJobs } from '@/lib/api';
import { getUserProfileById } from '@/lib/api/users';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import OpenJobsSection from './sections/OpenJobSection';
import ActivitySection from './sections/ActivitySection'; 
import { getInitials } from '@/lib/utils';
import { User, Job } from '@/types'; // Import main types

// --- CHANGE 1: REMOVE the local RecruiterProfileData and Job interfaces ---
// We will use the main User and Job types from `src/types` directly.

const TABS = ['Timeline', 'Open Jobs', 'About', 'Contact'];

interface ProfileViewProps {
  userId?: string | number;
  isOwner: boolean;
}

export default function ProfileView({ userId, isOwner }: ProfileViewProps) {
  // --- CHANGE 2: The state will now hold a User object and a separate jobs array ---
  const [profile, setProfile] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Timeline');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const rawUserData: User = userId ? await getUserProfileById(userId) : await getMyProfile();
        
        // --- CHANGE 3: Await the promise for jobs ---
        // For a public view, you'll need a way to get jobs by recruiter ID.
        // For now, this logic works for the owner's view.
        const recruiterJobs: Job[] = isOwner ? await getRecruiterJobs() : [];
        
        if (rawUserData && rawUserData.role === 'recruiter') {
          setProfile(rawUserData);
          setJobs(recruiterJobs);
        } else {
          throw new Error('Recruiter profile data could not be found.');
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId, isOwner]);

  const handleUploadSuccess = (imageType: 'profilePicture' | 'coverPhoto', newPath: string) => {
    setProfile(prev => {
        if (!prev || !prev.recruiterProfile) return prev;
        return {
            ...prev,
            recruiterProfile: {
                ...prev.recruiterProfile,
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

  // --- CHANGE 4: Create a display object from the `profile` state for easier access ---
  const rp = profile.recruiterProfile; // Alias for recruiterProfile
  const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

  return (
    <div className="bg-base-100 min-h-screen">
      <header className="relative h-60 md:h-80 w-full bg-gray-200">
        <ImageUpload
          imageType="coverPhoto"
          currentImageUrl={rp?.coverPhoto} // Use the coverPhoto from the profile
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
                  currentImageUrl={rp?.profilePicture} // Use profilePicture
                  onUploadSuccess={(newPath) => handleUploadSuccess('profilePicture', newPath)}
                  isProfilePic={true}
                  className="w-40 h-40 -mt-5" 
                  userName={name}
                  disabled={!isOwner}
                />
                <h1 className="text-3xl font-bold mt-6">{name}</h1>
                <div className="badge badge-success gap-2 mt-4"><CheckCircle size={14}/> Recruiter</div>
                <div className="space-y-3 mt-6 text-gray-600 w-full">
                  <p className="flex items-center gap-3"><Briefcase size={18} /> {rp?.designation || 'Not specified'}</p>
                  <p className="flex items-center gap-3"><Settings size={18} /> {rp?.companyName || 'Not specified'}</p>
                  <p className="flex items-center gap-3"><MapPin size={18} /> {rp?.location || 'Not specified'}</p>
                  <p className="flex items-center gap-3"><Phone size={18} /> {profile.phone || 'Not specified'}</p>
                  <p className="flex items-center gap-3"><Mail size={18} /> {profile.email}</p>
                </div>
                {isOwner ? (
                  <div className="w-full space-y-3 mt-8">
                    <Link href="/recruiter-settings" className="btn btn-primary btn-block">
                      <Pencil size={18} /> Edit Profile Info
                    </Link>
                    <Link href="/pricing" className="btn btn-outline btn-block">
                      <LayoutTemplate size={18} /> Customize Profile
                      <span className="badge badge-info">PRO</span>
                    </Link>
                    <a
                      href={rp?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-block"
                    >
                      <Globe size={18} /> Visit Website
                    </a>
                  </div>
                 ) : (
                  <div className="w-full space-y-3 mt-8">
                     <Link href={`/messages?userId=${profile.id}`} className="btn btn-primary btn-block">
                        Message {name.split(' ')[0]}
                     </Link>
                     <a
                      href={rp?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-block"
                    >
                      <Globe size={18} /> Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>
          <main className="lg:col-span-9 pt-8">
            <div className="tabs tabs-bordered">
              {TABS.map((tab) => (
                <a key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </a>
              ))}
            </div>
            <div className="mt-6">
              {activeTab === 'Timeline' && <ActivitySection userId={profile.id} isOwner={isOwner} />}
              {activeTab === 'About' && <AboutSection aboutText={rp?.about || ''} />}
              {activeTab === 'Contact' && <ContactSection email={profile.email} phone={profile.phone || ''} website={rp?.website || ''} />}
              {activeTab === 'Open Jobs' && <OpenJobsSection jobs={jobs} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}