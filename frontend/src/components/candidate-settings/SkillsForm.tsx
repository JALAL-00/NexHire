'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  onSkillsChange: (newSkills: string[]) => void;
}

export default function SkillsForm({ skills, onSkillsChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onSkillsChange([...skills, trimmedSkill]);
      setNewSkill(''); // Clear the input after adding
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleAddSkill();
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">SKILLS</h3>
      <p className="text-sm text-gray-500 mb-4">
        Add skills that highlight your expertise. Press Enter or click "Add" to add a skill.
      </p>
      
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., React, Node.js, Project Management"
          className="input input-bordered w-full"
        />
        <button type="button" onClick={handleAddSkill} className="btn btn-primary">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="badge badge-lg badge-outline gap-2">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="btn btn-xs btn-circle btn-ghost"
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}