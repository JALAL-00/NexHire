'use client';

// Define the shape of a single experience object
interface Experience {
  title: string;
  org: string;
  duration: string;
  location: string;
  desc: string;
}

// Define the props the component expects from ProfileView
interface ExperienceSectionProps {
  experienceData: Experience[];
}

export default function ExperienceSection({ experienceData }: ExperienceSectionProps) {

  // --- THIS IS THE FIX ---
  // Filter out any experience entries that are essentially empty before rendering.
  const validExperiences = Array.isArray(experienceData)
    ? experienceData.filter(exp => exp.title?.trim() || exp.org?.trim())
    : [];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Experience</h2>
        <div className="flex gap-2">
          {/* These buttons can be linked to the settings page in the future 
          <button className="btn btn-outline btn-sm">Edit</button>
          <button className="btn btn-outline btn-sm">➕ Add</button>
          */}
        </div>
      </div>
      <div className="space-y-6">
        {/* Render the filtered list of experiences */}
        {validExperiences.length > 0 ? (
          validExperiences.map((exp, idx) => (
            <div key={idx} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold text-gray-800">{exp.title}</h3>
              <p className="text-sm text-gray-600">{exp.org} • {exp.location}</p>
              <p className="text-xs text-gray-500">{exp.duration}</p>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{exp.desc}</p>
            </div>
          ))
        ) : (
          // Display a fallback message if there's no valid experience data
          <p className="text-gray-500">No experience information has been added yet.</p>
        )}
      </div>
    </div>
  );
}