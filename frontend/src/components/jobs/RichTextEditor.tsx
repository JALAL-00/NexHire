// src/components/jobs/RichTextEditor.tsx
//This used for Create job. 

'use client';

import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const RichTextEditor = ({ label, name, value, placeholder, onChange }: RichTextEditorProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary">
        <textarea
          name={name}
          className="textarea w-full h-32 focus:outline-none rounded-b-lg p-4"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></textarea>
        {/* Toolbar for visual effect */}
        <div className="bg-gray-100 p-2 border-t border-gray-300 flex items-center gap-4 text-gray-600">
          <button type="button" className="hover:text-primary"><Bold size={18} /></button>
          <button type="button" className="hover:text-primary"><Italic size={18} /></button>
          <button type="button" className="hover:text-primary"><Underline size={18} /></button>
          <div className="divider divider-horizontal mx-0"></div>
          <button type="button" className="hover:text-primary"><LinkIcon size={18} /></button>
          <div className="divider divider-horizontal mx-0"></div>
          <button type="button" className="hover:text-primary"><List size={18} /></button>
          <button type="button" className="hover:text-primary"><ListOrdered size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;