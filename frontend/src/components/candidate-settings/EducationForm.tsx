'use client';

import { X, Plus } from 'lucide-react';
import { ChangeEvent } from 'react';

type Education = {
  institution: string;
  degree: string;
  year: number;
};

type EducationFormProps = {
  education: Education[];
  onEducationChange: (education: Education[]) => void;
};

export default function EducationForm({ education, onEducationChange }: EducationFormProps) {

  // --- THIS IS THE FIX ---
  // Updated to handle state immutably, preventing the "readonly" error.
  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    // Create a new array by mapping over the old one
    const updatedEducation = education.map((eduItem, i) => {
      // If it's the item we want to change...
      if (index === i) {
        // ...return a new object with the updated value.
        return {
          ...eduItem,
          [name]: name === 'year' ? parseInt(value, 10) || '' : value,
        };
      }
      // Otherwise, return the original item.
      return eduItem;
    });

    onEducationChange(updatedEducation);
  };

  const handleAddEducation = () => {
    // Ensure education is an array before spreading
    const currentEducation = Array.isArray(education) ? education : [];
    onEducationChange([...currentEducation, { institution: '', degree: '', year: new Date().getFullYear() }]);
  };

  const handleRemoveEducation = (index: number) => {
    const values = [...education];
    values.splice(index, 1);
    onEducationChange(values);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">EDUCATION</h3>
          <button type="button" onClick={handleAddEducation} className="btn btn-sm btn-outline btn-primary"><Plus size={16} /> Add Education</button>
      </div>
      <div className="space-y-6">
        {/* Safety check: Ensure 'education' is an array before mapping */}
        {Array.isArray(education) && education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-lg relative space-y-2">
            <button type="button" onClick={() => handleRemoveEducation(index)} className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2"><X size={14} /></button>
            <input type="text" name="institution" placeholder="University/Institution" value={edu.institution || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" name="degree" placeholder="Degree (e.g., B.S. Computer Science)" value={edu.degree || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
              <input type="number" name="year" placeholder="Year of Graduation" value={edu.year || ''} onChange={e => handleInputChange(index, e)} className="input input-bordered w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}