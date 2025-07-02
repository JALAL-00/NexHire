'use client';

import { Conversation } from '@/types/chat';
// --- FIX: Replaced 'PushPin' with the correct 'Pin' icon ---
import { Bell, Pin, UserPlus, Settings, Image as ImageIcon, FileText, Link2 } from 'lucide-react';

interface ConversationDetailsProps {
  activeConversation: Conversation | null;
}

export const ConversationDetails = ({ activeConversation }: ConversationDetailsProps) => {
  if (!activeConversation) return <aside className="hidden xl:w-1/4 xl:flex"></aside>;

  return (
    <aside className="hidden xl:w-1/4 xl:flex flex-col border-l bg-base-100 p-4">
      <h3 className="text-lg font-bold text-center mb-4">Group Information</h3>
      <div className="flex justify-around items-center mb-6">
        <button className="btn btn-ghost flex-col h-auto gap-1"><Bell size={20}/> <span className="text-xs">Notification</span></button>
        <button className="btn btn-ghost flex-col h-auto gap-1"><Pin size={20}/> <span className="text-xs">Pin Group</span></button>
        <button className="btn btn-ghost flex-col h-auto gap-1"><UserPlus size={20}/> <span className="text-xs">Member</span></button>
        <button className="btn btn-ghost flex-col h-auto gap-1"><Settings size={20}/> <span className="text-xs">Setting</span></button>
      </div>

      <div className="space-y-6 overflow-y-auto">
        <div>
          <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Images</h4><a href="#" className="text-sm text-primary">View All</a></div>
          <p className="text-sm text-gray-500">No images shared yet.</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Files</h4><a href="#" className="text-sm text-primary">View All</a></div>
          <p className="text-sm text-gray-500">No files shared yet.</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Links</h4><a href="#" className="text-sm text-primary">View All</a></div>
          <p className="text-sm text-gray-500">No links shared yet.</p>
        </div>
      </div>
    </aside>
  );
};