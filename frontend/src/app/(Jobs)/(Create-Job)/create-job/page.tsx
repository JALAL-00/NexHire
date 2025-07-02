'use client';

import { useState, useEffect, useRef } from 'react'; // <-- Import useEffect and useRef
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/jobs/RichTextEditor';
import { JobPostSuccessModal } from '@/components/jobs/JobPostSuccessModal';

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="form-control w-full">
    <label className="label"><span className="label-text font-semibold">{label}</span></label>
    {children}
  </div>
);

export default function CreateJobPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [postedJobTitle, setPostedJobTitle] = useState('');
  
  // --- THIS IS THE FIX ---
  // 1. Create a ref to track if the effect has already run.
  const effectRan = useRef(false);

  const [formData, setFormData] = useState({
    title: '', description: '', responsibilities: '', location: '', skills: '',
    experience: '', expirationDate: '', jobType: '', jobLevel: '', jobRole: '',
    minSalary: '', maxSalary: '', salaryType: '', education: '',
  });

  useEffect(() => {
    // 2. Only run the check if the effect has not run before.
    if (effectRan.current === false) {
      const checkStatus = async () => {
        const token = Cookies.get('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        try {
          const response = await axios.get('http://localhost:3000/recruiter/job-status', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!response.data.canPost) {
            alert('You have reached your job posting limit. Please upgrade to post more jobs.');
            router.push('/pricing');
          } else {
            setIsVerifying(false);
          }
        } catch (err) {
          console.error("Verification failed:", err);
          alert("You do not have permission to access this page.");
          router.push('/home');
        }
      };

      checkStatus();
    }

    // 3. The cleanup function runs on unmount. We set the ref here.
    //    In Strict Mode, this ensures the logic in the 'if' block doesn't run on the second render.
    return () => {
      effectRan.current = true;
    };
  }, [router]); // The dependency array is correct.

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const token = Cookies.get('auth_token');
    if (!token) {
      setError("Authentication failed. Please log in again.");
      setIsLoading(false);
      return;
    }

    const jobPayload = {
      title: formData.title,
      description: formData.description,
      responsibilities: formData.responsibilities,
      location: formData.location,
      salary: `$${formData.minSalary} - $${formData.maxSalary} ${formData.salaryType}`,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      experience: formData.experience,
      expirationDate: formData.expirationDate || null,
      jobType: formData.jobType,
      jobLevel: formData.jobLevel,
      education: formData.education, 
    };

    try {
      await axios.post('http://localhost:3000/recruiter/jobs', jobPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPostedJobTitle(jobPayload.title);
      setIsSuccessModalOpen(true);

    } catch (err: any) {
      // This catch block is still a valuable security fallback, so we keep it.
      if (err.response?.status === 403) {
        alert('You have reached your job posting limit. Please upgrade to post more jobs.');
        router.push('/pricing');
        return; 
      }
      
      const errorMessage = err.response?.data?.message || "Failed to post job. Please check the fields and try again.";
      setError(errorMessage);
      console.error("An unexpected error occurred while posting a job:", err);

    } finally {
      setIsLoading(false);
    }
  };
  
  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Verifying your account status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-base-200 min-h-screen p-4 sm:p-6 lg:p-8">
        <main className="container mx-auto max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <form onSubmit={handleSubmit} className="card-body">
              <h1 className="card-title text-3xl mb-6">Post a job</h1>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="Job Title"><input type="text" name="title" placeholder="Add job title, role, vacancies etc" className="input input-bordered w-full" value={formData.title} onChange={handleInputChange} required /></FormField>
                <FormField label="Job Role"><select name="jobRole" className="select select-bordered w-full" value={formData.jobRole} onChange={handleInputChange} required>
                  <option value="" disabled>Select...</option>
                  <option>Software Engineer</option>
                  <option>Data Science Analyst</option>
                  <option>Data Scientist</option>
                  <option>AI Research Engineer</option>
                  <option>Machine Learning Engineer</option>
                  <option>Graphic Designer</option>
                  <option>UI/UX Designer</option>
                  <option>Content Creator</option>
                  <option>Senior UI/UX Designer</option>
                  <option>Backend Engineer</option>
                  <option>Backend API Developer</option>
                  <option>Senior Backend Developer</option>
                  <option>Backend Software Engineer</option>
                  <option>Ethical Hacker</option>
                  <option>Team Operator</option>
                  <option>Cybersecurity Analyst</option>
                </select></FormField>
                <div className="md:col-span-2"><FormField label="Tags (Skills, comma-separated)"><input type="text" name="skills" placeholder="Job keyword, tags etc..." className="input input-bordered w-full" value={formData.skills} onChange={handleInputChange} required /></FormField></div>
                <div className="md:col-span-2"><h3 className="text-lg font-semibold mt-4">Salary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
                    <FormField label="Min Salary"><label className="input input-bordered flex items-center gap-2"><input type="number" name="minSalary" className="grow" placeholder="Minimum salary..." value={formData.minSalary} onChange={handleInputChange} required /><span className="badge badge-ghost">USD</span></label></FormField>
                    <FormField label="Max Salary"><label className="input input-bordered flex items-center gap-2"><input type="number" name="maxSalary" className="grow" placeholder="Maximum salary..." value={formData.maxSalary} onChange={handleInputChange} required /><span className="badge badge-ghost">USD</span></label></FormField>
                    <FormField label="Salary Type"><select name="salaryType" className="select select-bordered w-full" value={formData.salaryType} onChange={handleInputChange} required>
                      <option value="" disabled>Select...</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select></FormField>
                  </div>
                </div>
                <div className="md:col-span-2"><h3 className="text-lg font-semibold mt-4">Advance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
                    <FormField label="Education"><select name="education" className="select select-bordered w-full" value={formData.education} onChange={handleInputChange} required>
                      <option value="" disabled>Select...</option>
                      <option>Diploma</option>
                      <option>Bachelor's</option>
                      <option>Master's</option>
                    </select></FormField>
                    <FormField label="Experience"><select name="experience" className="select select-bordered w-full" value={formData.experience} onChange={handleInputChange} required>
                      <option value="" disabled>Select...</option>
                      <option>1-2 Years</option>
                      <option>2-3 Years</option>
                      <option>3-4 Years</option>
                      <option>4-5 Years</option>
                    </select></FormField>
                    <FormField label="Job Type"><select name="jobType" className="select select-bordered w-full" value={formData.jobType} onChange={handleInputChange} required>
                      <option value="" disabled>Select Job Type</option>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select></FormField>
                    <FormField label="Location"><input type="text" name="location" placeholder="e.g., New York, USA" className="input input-bordered w-full" value={formData.location} onChange={handleInputChange} required /></FormField>
                    <FormField label="Expiration Date"><input type="date" name="expirationDate" className="input input-bordered w-full" value={formData.expirationDate} onChange={handleInputChange} required /></FormField>
                    <FormField label="Job Level"><select name="jobLevel" className="select select-bordered w-full" value={formData.jobLevel} onChange={handleInputChange} required>
                      <option value="" disabled>Select Job Level</option>
                      <option>Entry Level</option>
                      <option>Mid-Level</option>
                      <option>Senior Level</option>
                    </select></FormField>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6 mt-4"><RichTextEditor label="Description" name="description" value={formData.description} placeholder="Add your job description..." onChange={handleInputChange} /><RichTextEditor label="Responsibilities" name="responsibilities" value={formData.responsibilities} placeholder="Add your job responsibilities..." onChange={handleInputChange} /></div>
              </div>
              <div className="card-actions justify-end mt-8"><button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? <span className="loading loading-spinner"></span> : 'Post Job →'}</button></div>
            </form>
          </div>
        </main>
      </div>
      {isSuccessModalOpen && (<JobPostSuccessModal jobTitle={postedJobTitle} onClose={() => { setIsSuccessModalOpen(false); router.push('/manage-jobs'); }} />)}
    </>
  );
}