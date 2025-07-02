'use client';

interface Education {
  degree: string;
  institution: string;
  year: number;
}

interface EducationSectionProps {
  educationData: Education[];
}

export default function EducationSection({ educationData }: EducationSectionProps) {

  // --- THIS IS THE FIX ---
  // Filter out any education entries that are empty before attempting to render them.
  const validEducation = Array.isArray(educationData)
    ? educationData.filter(edu => edu.institution?.trim() || edu.degree?.trim())
    : [];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Education</h2>
      </div>
      <div className="space-y-6">
        {/* Render the filtered list of education records */}
        {validEducation.length > 0 ? (
          validEducation.map((edu, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
              <p className="text-sm text-gray-600">{edu.degree}</p>
              {edu.year && <p className="text-xs text-gray-500">Graduated: {edu.year}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No education information provided.</p>
        )}
      </div>
    </div>
  );
}