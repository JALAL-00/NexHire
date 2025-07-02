'use client';

interface AboutSectionProps {
  aboutText: string;
}

export default function AboutSection({ aboutText }: AboutSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">About</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {aboutText || 'No information provided.'}
      </p>
    </div>
  );
}