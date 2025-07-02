// src/components/jobs/UpdateJobModal.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X, Briefcase, MapPin, DollarSign, Star, BookText, Calendar, Type, BarChart3 } from 'lucide-react';

// Define the structure of the job object passed as a prop
interface Job {
  id: number;
  title: string;
  description: string;
  responsibilities?: string; // Make optional to handle older data
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  jobType?: string;
  jobLevel?: string;
  expirationDate?: string;
}

interface UpdateJobModalProps {
  job: Job;
  onClose: () => void;
  onJobUpdated: () => void; // Callback to refresh the job list
}

export const UpdateJobModal = ({ job, onClose, onJobUpdated }: UpdateJobModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    skills: '',
    experience: '',
    description: '',
    responsibilities: '',
    jobType: '',
    jobLevel: '',
    expirationDate: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill the form with the existing job data when the modal opens
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        location: job.location || '',
        salary: job.salary || '',
        skills: job.skills?.join(', ') || '',
        experience: job.experience || '',
        description: job.description || '',
        responsibilities: job.responsibilities || '',
        jobType: job.jobType || '',
        jobLevel: job.jobLevel || '',
        // Format date for the input type="date" which expects 'YYYY-MM-DD'
        expirationDate: job.expirationDate ? new Date(job.expirationDate).toISOString().split('T')[0] : '',
      });
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError('');
    const token = Cookies.get('auth_token');
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsUpdating(false);
      return;
    }

    // Construct the payload to match your updated backend DTO
    const updatePayload = {
      jobId: job.id,
      title: formData.title,
      description: formData.description,
      responsibilities: formData.responsibilities,
      location: formData.location,
      salary: formData.salary,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: formData.experience,
      jobType: formData.jobType,
      jobLevel: formData.jobLevel,
      expirationDate: formData.expirationDate,
    };

    console.log("Submitting update:", updatePayload);

    try {
      await axios.patch('http://localhost:3000/recruiter/jobs', updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job updated successfully!');
      onJobUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update job:", err);
      setError("Could not update job. Please check your input and try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control"><label className="label"><span className="label-text font-medium">Job Title</span></label><label className="input input-bordered flex items-center gap-2"><Briefcase size={16} className="text-gray-400" /><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="grow" /></label></div>
            <div className="form-control"><label className="label"><span className="label-text font-medium">Location</span></label><label className="input input-bordered flex items-center gap-2"><MapPin size={16} className="text-gray-400" /><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="grow" /></label></div>
            <div className="form-control"><label className="label"><span className="label-text font-medium">Salary Range</span></label><label className="input input-bordered flex items-center gap-2"><DollarSign size={16} className="text-gray-400" /><input type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="grow" /></label></div>
            <div className="form-control"><label className="label"><span className="label-text font-medium">Expiration Date</span></label><label className="input input-bordered flex items-center gap-2"><Calendar size={16} className="text-gray-400" /><input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} className="grow" /></label></div>
          </div>
        );
      case 'requirements':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control"><label className="label"><span className="label-text font-medium">Experience Level</span></label><select name="experience" value={formData.experience} onChange={handleInputChange} className="select select-bordered"><option value="" disabled>Select...</option><option>1-2 Years</option><option>3-5 Years</option><option>5+ Years</option></select></div>
              <div className="form-control"><label className="label"><span className="label-text font-medium">Job Type</span></label><select name="jobType" value={formData.jobType} onChange={handleInputChange} className="select select-bordered"><option value="" disabled>Select...</option><option>Full Time</option><option>Part Time</option><option>Contract</option><option>Remote</option></select></div>
              <div className="form-control"><label className="label"><span className="label-text font-medium">Job Level</span></label><select name="jobLevel" value={formData.jobLevel} onChange={handleInputChange} className="select select-bordered"><option value="" disabled>Select...</option><option>Entry</option><option>Mid-Level</option><option>Senior</option></select></div>
            </div>
            <div className="form-control"><label className="label"><span className="label-text font-medium">Required Skills (comma-separated)</span></label><label className="input input-bordered flex items-center gap-2"><Star size={16} className="text-gray-400" /><input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="grow" /></label></div>
          </div>
        );
      case 'description':
        return (
          <div className="space-y-6">
            <div className="form-control"><label className="label"><span className="label-text font-medium">Job Description</span></label><textarea name="description" value={formData.description} onChange={handleInputChange} className="textarea textarea-bordered h-24" placeholder="Provide a detailed job description..."></textarea></div>
            <div className="form-control"><label className="label"><span className="label-text font-medium">Responsibilities</span></label><textarea name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} className="textarea textarea-bordered h-24" placeholder="List the key responsibilities..."></textarea></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-4xl p-0">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-2xl">Update Job Posting</h3>
              <p className="text-gray-500 mt-1">Editing: <span className="font-semibold text-primary">{job.title}</span></p>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X /></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 border-b">
          <div className="tabs tabs-boxed bg-base-200 p-1">
            <a className={`tab flex-1 ${activeTab === 'details' ? 'tab-active !bg-white' : ''}`} onClick={() => setActiveTab('details')}>Job Details</a>
            <a className={`tab flex-1 ${activeTab === 'requirements' ? 'tab-active !bg-white' : ''}`} onClick={() => setActiveTab('requirements')}>Requirements</a>
            <a className={`tab flex-1 ${activeTab === 'description' ? 'tab-active !bg-white' : ''}`} onClick={() => setActiveTab('description')}>Description</a>
          </div>
        </div>

        <div className="p-6 sm:p-8 min-h-[24rem]">
          {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
          {renderContent()}
        </div>

        <div className="bg-base-200 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleUpdate} className="btn btn-primary" disabled={isUpdating}>
            {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
          </button>
        </div>
      </div>
    </dialog>
  );
};