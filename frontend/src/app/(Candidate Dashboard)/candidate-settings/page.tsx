'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getMyProfile, updateMyUserInfo, UpdateUserInfoPayload } from '@/lib/api';
// --- We'll use the same Sparkles icon for both, but you could import another one ---
import { User, Shield, Briefcase, GraduationCap, CheckCircle, Sparkles } from 'lucide-react';
import BasicInfoForm from '@/components/candidate-settings/BasicInfoForm';
import ExperienceForm from '@/components/candidate-settings/ExperienceForm';
import EducationForm from '@/components/candidate-settings/EducationForm';
import SkillsForm from '@/components/candidate-settings/SkillsForm';

export default function CandidateSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // --- ADD 'services' TO THE FORMDATA STATE ---
  const [formData, setFormData] = useState<UpdateUserInfoPayload & { profilePicture: string | null }>({
    firstName: '',
    lastName: '',
    title: '',
    location: '',
    about: '',
    services: '', // Added services
    profilePicture: null,
    experience: [],
    education: [],
    skills: [], 
    availability: '', 
  });

  useEffect(() => {
    const sectionFromUrl = searchParams.get('section');
    // --- ADD 'services' TO THE VALID SECTION CHECK ---
    if (sectionFromUrl && ['basic', 'about', 'services', 'experience', 'education', 'skills', 'availability'].includes(sectionFromUrl)) {
      setActiveSection(sectionFromUrl);
    }
    
    const fetchProfileData = async () => {
      try {
        const data = await getMyProfile();

        const cleanExperience = (data.candidateProfile?.experience || []).filter(
          (exp: any) => exp.title?.trim() || exp.org?.trim()
        );
        const cleanEducation = (data.candidateProfile?.education || []).filter(
          (edu: any) => edu.institution?.trim() || edu.degree?.trim()
        );

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          title: data.candidateProfile?.title || '',
          location: data.candidateProfile?.location || '',
          about: data.candidateProfile?.about || '',
          // --- POPULATE 'services' FROM FETCHED DATA ---
          services: data.candidateProfile?.services || '',
          profilePicture: data.candidateProfile?.profilePicture || null,
          experience: cleanExperience,
          education: cleanEducation,
          skills: data.candidateProfile?.skills || [],
          availability: data.candidateProfile?.availability || 'Not Actively Looking',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = (imageType: 'profilePicture' | 'coverPhoto', newPath: string) => {
    if (imageType === 'profilePicture') {
      setFormData({ ...formData, profilePicture: newPath });
    }
  };

  const handleExperienceChange = (newExperience: any[]) => {
    setFormData({ ...formData, experience: newExperience });
  };

  const handleEducationChange = (newEducation: any[]) => {
    setFormData({ ...formData, education: newEducation });
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const nonEmptyExperience = (formData.experience ?? []).filter(
      (exp) => exp.title?.trim() !== '' || exp.org?.trim() !== ''
    );
    const nonEmptyEducation = (formData.education ?? []).filter(
      (edu) => edu.institution?.trim() !== '' || edu.degree?.trim() !== ''
    );
    
    // --- ADD 'services' TO THE SUBMISSION PAYLOAD ---
    const payload: UpdateUserInfoPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title,
      location: formData.location,
      about: formData.about,
      services: formData.services, // Include services
      experience: nonEmptyExperience,
      education: nonEmptyEducation,
      skills: formData.skills,
      availability: formData.availability,
    };

    try {
      await updateMyUserInfo(payload);
      alert('Profile updated successfully!');
      router.push('/candidate-profile');
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  // --- ADD A CASE FOR 'services' IN THE RENDERER ---
  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInfoForm formData={formData as any} onInputChange={handleInputChange} onProfilePicUpload={(newPath) => handleProfilePicUpload('profilePicture', newPath)} />;
      case 'about':
        return (
          <div>
            <h3 className="font-bold text-lg mb-4">ABOUT ME</h3>
            <textarea name="about" value={formData.about || ''} onChange={handleInputChange} className="textarea textarea-bordered w-full h-48" placeholder="Tell us about yourself..."></textarea>
          </div>
        );
      // Add the new case for services
      case 'services':
        return (
          <div>
            <h3 className="font-bold text-lg mb-4">MY SERVICES</h3>
            <p className="text-sm text-gray-500 mb-4">List the professional services you offer. This helps recruiters understand your expertise as a freelancer or consultant.</p>
            <textarea name="services" value={formData.services || ''} onChange={handleInputChange} className="textarea textarea-bordered w-full h-48" placeholder="e.g., Full-Stack Web Development, UI/UX Design, SEO Optimization, Technical Writing..."></textarea>
          </div>
        );
      case 'experience':
        return <ExperienceForm experiences={formData.experience || []} onExperienceChange={handleExperienceChange} />;
      case 'education':
        return <EducationForm education={formData.education || []} onEducationChange={handleEducationChange} />;
      case 'skills':
        return <SkillsForm skills={formData.skills || []} onSkillsChange={handleSkillsChange} />;
      case 'availability':
        return (
          <div>
            <h3 className="font-bold text-lg mb-4">MY AVAILABILITY</h3>
            <p className="text-sm text-gray-500 mb-4">Set your current job-seeking status. This will be visible to recruiters.</p>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Current Status</span>
              </label>
              <select 
                name="availability" 
                className="select select-bordered" 
                value={formData.availability} 
                onChange={handleInputChange}
              >
                <option>Available Immediately</option>
                <option>Open to Opportunities</option>
                <option>Not Actively Looking</option>
              </select>
            </div>
          </div>
        );
      default:
        return <div className="text-center p-10 text-gray-500">Select a section to edit.</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Link href="/candidate-profile" className="btn btn-ghost">← Back to Profile</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            {/* --- ADD THE 'services' LINK TO THE SIDEBAR --- */}
            <ul className="menu bg-base-100 rounded-box p-2 shadow-sm">
              <li onClick={() => setActiveSection('basic')} className={activeSection === 'basic' ? 'bordered' : ''}><a><User size={16} /> Basic Information</a></li>
              <li onClick={() => setActiveSection('about')} className={activeSection === 'about' ? 'bordered' : ''}><a><Shield size={16} /> About</a></li>
              {/* Add the new Services menu item */}
              <li onClick={() => setActiveSection('services')} className={activeSection === 'services' ? 'bordered' : ''}><a><Sparkles size={16} /> Services</a></li>
              <li onClick={() => setActiveSection('experience')} className={activeSection === 'experience' ? 'bordered' : ''}><a><Briefcase size={16} /> Experience</a></li>
              <li onClick={() => setActiveSection('education')} className={activeSection === 'education' ? 'bordered' : ''}><a><GraduationCap size={16} /> Education</a></li>
              <li onClick={() => setActiveSection('skills')} className={activeSection === 'skills' ? 'bordered' : ''}><a><Sparkles size={16} /> Skills</a></li>
              <li onClick={() => setActiveSection('availability')} className={activeSection === 'availability' ? 'bordered' : ''}><a><CheckCircle size={16} /> Availability</a></li>
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