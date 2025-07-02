'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyProfile, updateMyUserInfo } from '@/lib/api';
import { User, Shield, Building } from 'lucide-react';
import ImageUpload from '@/components/profile/ImageUpload';

// Define a specific payload type for clarity
interface RecruiterUpdatePayload {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  designation?: string;
  phone?: string;
  website?: string;
  location?: string;
  about?: string;
}

export default function RecruiterSettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // State to hold form data, including profile picture for UI display
  const [formData, setFormData] = useState<RecruiterUpdatePayload & { profilePicture: string | null }>({
    firstName: '',
    lastName: '',
    companyName: '',
    designation: '',
    phone: '',
    website: '',
    location: '',
    about: '',
    profilePicture: null,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getMyProfile();
        if (data.role !== 'recruiter' || !data.recruiterProfile) {
          throw new Error('Recruiter profile could not be found.');
        }

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          companyName: data.recruiterProfile.companyName || '',
          designation: data.recruiterProfile.designation || '',
          phone: data.phone || '', // Note: phone is on the root User model
          website: data.recruiterProfile.website || '',
          location: data.recruiterProfile.location || '',
          about: data.recruiterProfile.about || '',
          profilePicture: data.recruiterProfile.profilePicture || null,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = (newPath: string) => {
    setFormData({ ...formData, profilePicture: newPath });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    // The payload is simply the formData, as our generic DTO handles the fields
    const payload: RecruiterUpdatePayload = { ...formData };
    
    try {
      await updateMyUserInfo(payload);
      alert('Profile updated successfully!');
      router.push('/recruiter-profile');
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  
  // A helper to render different sections of the form
  const renderSection = () => {
    switch(activeSection) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 flex flex-col items-center">
              <h3 className="font-bold text-lg mb-4 self-start">BASIC INFORMATION</h3>
              <ImageUpload
                imageType="profilePicture"
                currentImageUrl={formData.profilePicture}
                onUploadSuccess={handleProfilePicUpload}
                isProfilePic={true}
                className="w-40 h-40"
              />
              <p className="text-sm text-gray-500 mt-2">Update your photo</p>
            </div>
            <div className="md:col-span-2 space-y-4 pt-12">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label"><span className="label-text">First Name</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input input-bordered w-full" />
                </div>
              </div>
              <div>
                <label className="label"><span className="label-text">Designation / Title</span></label>
                <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g., HR Manager" />
              </div>
              <div>
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g., +123456789" />
              </div>
            </div>
          </div>
        );
      case 'company':
        return (
          <div>
            <h3 className="font-bold text-lg mb-4">COMPANY DETAILS</h3>
            <div className="space-y-4">
               <div>
                <label className="label"><span className="label-text">Company Name</span></label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text">Location</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g., San Francisco, CA" />
              </div>
              <div>
                <label className="label"><span className="label-text">Company Website</span></label>
                <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="input input-bordered w-full" placeholder="https://example.com" />
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div>
            <h3 className="font-bold text-lg mb-4">ABOUT SECTION</h3>
            <textarea name="about" value={formData.about} onChange={handleInputChange} className="textarea textarea-bordered w-full h-48" placeholder="Tell us about your company, culture, and what you look for in candidates..."></textarea>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Link href="/recruiter-profile" className="btn btn-ghost">← Back to Profile</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <ul className="menu bg-base-100 rounded-box p-2 shadow-sm">
              <li onClick={() => setActiveSection('basic')} className={activeSection === 'basic' ? 'bordered' : ''}><a><User size={16} /> Basic Information</a></li>
              <li onClick={() => setActiveSection('company')} className={activeSection === 'company' ? 'bordered' : ''}><a><Building size={16} /> Company Details</a></li>
              <li onClick={() => setActiveSection('about')} className={activeSection === 'about' ? 'bordered' : ''}><a><Shield size={16} /> About</a></li>
            </ul>
          </aside>
          <main className="md:col-span-3">
            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}
                {renderSection()}
              </div>
              <div className="card-actions justify-end p-6 border-t bg-base-200/50">
                <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}