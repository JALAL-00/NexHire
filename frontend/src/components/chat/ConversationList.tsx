//The Left Column
'use client';

import { Search } from 'lucide-react';
import { ChatUser, Conversation } from '@/types/chat'; // We'll create this type file
import { AvatarFallback } from './AvatarFallback';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ConversationListProps {
  users: ChatUser[];
  activeConversation: Conversation | null;
  currentUserId: number | null;
  onUserClick: (userId: number) => void;
}

export const ConversationList = ({ users, activeConversation, currentUserId, onUserClick }: ConversationListProps) => {
  return (
    <aside className="w-full md:w-1/4 xl:w-1/5 flex flex-col border-r bg-base-100">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="form-control relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search" className="input input-bordered w-full pl-10" />
        </div>
      </div>
      
      <div className="tabs tabs-boxed p-2 bg-base-200 m-2">
        <a className="tab tab-active flex-1">Inbox</a>
        <a className="tab flex-1">Explore</a>
      </div>

      <div className="p-2">
        <button className="btn btn-primary btn-block">Create New Group</button>
      </div>
      
      <ul className="overflow-y-auto flex-grow">
        {users.map(user => {
          const otherParticipant = activeConversation?.participants?.find(p => p.id !== currentUserId);
          const isActive = otherParticipant?.id === user.id;
          
          return (
            <li
              key={user.id}
              onClick={() => onUserClick(user.id)}
              className={`p-3 hover:bg-primary/10 cursor-pointer flex items-center gap-3 transition-colors ${
                isActive ? 'bg-primary/20' : ''
              }`}
            >
              <div className="avatar">
                <div className="w-12 rounded-full">
                  {user.profilePicture ? (
                    <img src={`${API_URL}/uploads/${user.profilePicture}`} alt={user.firstName} />
                  ) : (
                    <AvatarFallback name={`${user.firstName} ${user.lastName}`} />
                  )}
                </div>
              </div>
              <div className="flex-grow overflow-hidden">
                <p className={`font-semibold truncate ${isActive ? 'text-primary' : ''}`}>
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">Last message placeholder...</p>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-400">
                <span>Just Now</span>
                {/* 
                <div className="badge badge-primary badge-sm mt-1">2</div>
                */}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};