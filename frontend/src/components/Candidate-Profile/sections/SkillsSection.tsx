'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil } from 'lucide-react';

interface SkillsSectionProps {
  skillsData: string[];
}

export default function SkillsSection({ skillsData }: SkillsSectionProps) {
  const [skills, setSkills] = useState(skillsData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setSkills(skillsData);
  }, [skillsData]);

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Skills</h2>
        {/*
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
          <button className="btn btn-outline btn-sm">➕ Add</button>
        </div>
        */}
      </div>
      {skills.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
            {skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-500">No skills listed.</p>
      )}
    </div>
  );
}