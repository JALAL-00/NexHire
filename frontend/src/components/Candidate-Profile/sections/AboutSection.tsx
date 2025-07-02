'use client';
import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

// Define the props this component will receive
interface AboutSectionProps {
  aboutText: string;
}

export default function AboutSection({ aboutText: initialAboutText }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  // The component's internal state is initialized from the prop
  const [aboutText, setAboutText] = useState(initialAboutText);

  // This ensures that if the parent's data changes, this component updates too
  useEffect(() => {
    setAboutText(initialAboutText);
  }, [initialAboutText]);

  // Placeholder function, can be implemented later
  const handleAdd = () => {
    console.log("Add button clicked");
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">About</h2>
      {/* <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
          <button className="btn btn-outline btn-sm" onClick={handleAdd}>➕ Add</button>
        </div>
         */ }
      </div>
      {isEditing ? (
        <>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="textarea textarea-bordered w-full min-h-[150px]"
          />
          <div className="text-right mt-2">
            <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(false)}>Save</button>
          </div>
        </>
      ) : (
        <p className="text-gray-700 whitespace-pre-line">{aboutText}</p>
      )}
    </div>
  );
}