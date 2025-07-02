// src/components/applications/AddColumnModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddColumnModalProps {
  onClose: () => void;
  onAddColumn: (columnName: string) => void;
}

export const AddColumnModal = ({ onClose, onAddColumn }: AddColumnModalProps) => {
  const [columnName, setColumnName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    if (!columnName.trim()) {
      alert("Please enter a column name.");
      return;
    }
    
    setIsLoading(true);
    // In a real app, you might call an API to save this new column state
    console.log(`Adding new column: ${columnName}`);
    
    // Simulate API call
    setTimeout(() => {
      onAddColumn(columnName);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <dialog id="add_column_modal" className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Add New Column</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X />
          </button>
        </div>
        
        <div className="py-4">
          <label className="label">
            <span className="label-text">Column Name</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g., 'Interviewing' or 'Hired'" 
            className="input input-bordered w-full"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleAdd} className="btn btn-primary" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : 'Add Column'}
          </button>
        </div>
      </div>
      {/* Backdrop to close modal */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};