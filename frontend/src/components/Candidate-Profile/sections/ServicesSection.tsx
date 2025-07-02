'use client';
import { useState, useEffect } from 'react';
import { Pencil, Plus } from 'lucide-react';

interface ServicesSectionProps {
  servicesText: string;
}

export default function ServicesSection({ servicesText: initialServices }: ServicesSectionProps) {
  const [services, setServices] = useState(initialServices);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Services</h2>
        {/* 
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
          <button className="btn btn-outline btn-sm">➕ Add</button>
        </div>
        */}
      </div>
      {isEditing ? (
        <textarea
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="textarea textarea-bordered w-full min-h-[150px]"
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-line">{services}</p>
      )}
    </div>
  );
}