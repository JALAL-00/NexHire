'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X, UploadCloud } from 'lucide-react';

interface ApplyJobModalProps {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
}

export const ApplyJobModal = ({ jobId, jobTitle, onClose }: ApplyJobModalProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!resumeFile) {
      setError('Please select a resume file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');
    const token = Cookies.get('auth_token');
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Upload the Resume File and GET the path back
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const uploadResponse = await axios.post<{ filePath: string }>(
        'http://localhost:3000/candidate/resume',
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percent);
          },
        });

      const resumePath = uploadResponse.data.filePath;

      // Step 2: Submit the Final Application with the resume path
      const applicationPayload = {
        jobId: jobId,
        coverLetter: coverLetter,
        resume: resumePath, // Pass the specific resume path
      };

      await axios.post('http://localhost:3000/candidate/apply-job', applicationPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Successfully applied for: ${jobTitle}`);
      onClose(); // Close the modal on final success

    } catch (err: any) {
      console.error("Failed to apply for job:", err);
      const errorMessage = err.response?.data?.message || "Application failed. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <dialog id="apply_job_modal" className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">Apply Job: {jobTitle}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X /></button>
        </div>

        <div className="py-4 space-y-6">
          {error && <div className="alert alert-error text-sm p-2">{error}</div>}
          <div>
            <label className="label"><span className="label-text">Upload Your Resume</span></label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, XLS</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" />
              </label>
            </div> 
            {resumeFile && <p className="text-sm text-success mt-2">Selected file: {resumeFile.name}</p>}
            {isLoading && uploadProgress > 0 && <progress className="progress progress-primary w-full mt-2" value={uploadProgress} max="100"></progress>}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="label"><span className="label-text">Cover Letter (Optional)</span></label>
            <div className="border rounded-lg">
              <textarea className="textarea w-full h-40 focus:outline-none rounded-b-lg" placeholder="Write a brief cover letter..." value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}></textarea>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn" disabled={isLoading}>Cancel</button>
          <button onClick={handleApply} className="btn btn-primary" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : 'Apply Now →'}
          </button>
        </div>
      </div>
    </dialog>
  );
};
