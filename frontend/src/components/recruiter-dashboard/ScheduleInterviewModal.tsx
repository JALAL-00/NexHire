'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createInterview, CreateInterviewPayload } from '@/lib/api/interviews';

interface ScheduleInterviewModalProps {
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleInterviewModal = ({
  applicationId,
  candidateName,
  jobTitle,
  onClose,
  onSuccess,
}: ScheduleInterviewModalProps) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<'Video Call' | 'Phone Screen' | 'On-site'>('Video Call');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a date and time.');
      return;
    }
    setIsSaving(true);
    setError('');

    const payload: CreateInterviewPayload = {
      applicationId,
      title: `Interview with ${candidateName} for ${jobTitle}`,
      date: new Date(date).toISOString(),
      type,
      locationOrLink,
      notes,
    };

    try {
      await createInterview(payload);
      alert('Interview scheduled successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to schedule interview. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X /></button>
        <h3 className="font-bold text-lg">Schedule Interview</h3>
        <p className="py-2">For: <span className="font-semibold">{candidateName}</span> ({jobTitle})</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="label"><span className="label-text">Date and Time</span></label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">Interview Type</span></label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="select select-bordered w-full">
              <option>Video Call</option>
              <option>Phone Screen</option>
              <option>On-site</option>
            </select>
          </div>
          <div>
            <label className="label"><span className="label-text">Location / Link</span></label>
            <input type="text" placeholder="e.g., Google Meet URL or Office Address" value={locationOrLink} onChange={(e) => setLocationOrLink(e.target.value)} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">Notes (for you)</span></label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="textarea textarea-bordered w-full" placeholder="e.g., Focus on React skills..."></textarea>
          </div>
          
          {error && <p className="text-error text-sm">{error}</p>}

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? <span className="loading loading-spinner"></span> : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};