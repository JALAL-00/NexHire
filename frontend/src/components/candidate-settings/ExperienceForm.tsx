'use client';

import { X, Plus } from 'lucide-react';

interface Experience {
  title: string;
  org: string;
  duration: string;
  location: string;
  desc: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onExperienceChange: (newExperiences: Experience[]) => void;
}

export default function ExperienceForm({ experiences, onExperienceChange }: ExperienceFormProps) {

  // --- THIS IS THE FIX ---
  // Updated to handle state immutably.
  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    
    const updatedExperiences = experiences.map((expItem, i) => {
        if (index === i) {
            // Return a new object with the updated property
            return {
                ...expItem,
                [name]: value
            };
        }
        return expItem;
    });

    onExperienceChange(updatedExperiences);
  };

  const handleAddExperience = () => {
    const currentExperiences = Array.isArray(experiences) ? experiences : [];
    onExperienceChange([...currentExperiences, { title: '', org: '', duration: '', location: '', desc: '' }]);
  };

  const handleRemoveExperience = (index: number) => {
    const values = [...experiences];
    values.splice(index, 1);
    onExperienceChange(values);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">EXPERIENCE</h3>
        <button type="button" onClick={handleAddExperience} className="btn btn-sm btn-outline btn-primary"><Plus size={16} /> Add Experience</button>
      </div>
      <div className="space-y-6">
        {/* Safety check to ensure experiences is an array */}
        {Array.isArray(experiences) && experiences.map((exp, index) => (
          <div key={index} className="p-4 border rounded-lg relative space-y-2">
            <button type="button" onClick={() => handleRemoveExperience(index)} className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2"><X size={14} /></button>
            <input type="text" name="title" placeholder="Job Title" value={exp.title || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
            <input type="text" name="org" placeholder="Company Name" value={exp.org || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" name="duration" placeholder="e.g., 2022 - Present" value={exp.duration || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
              <input type="text" name="location" placeholder="Location" value={exp.location || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
            </div>
            <textarea name="desc" placeholder="Description..." value={exp.desc || ''} onChange={e => handleInputChange(index, e)} className="textarea textarea-bordered w-full"></textarea>
          </div>
        ))}
      </div>
    </div>
  );
}