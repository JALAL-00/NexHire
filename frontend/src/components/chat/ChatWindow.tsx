//The Middle Column

'use client';

import { useRef, useEffect } from 'react';
import { Phone, Video, MoreHorizontal, Smile, Paperclip, Mic } from 'lucide-react';
import { Conversation, Message } from '@/types/chat';
import { AvatarFallback } from './AvatarFallback';
import { MessageBubble } from './MessageBubble'; // We will create this next
import { MessageInput } from './MessageInput';   // And this

interface ChatWindowProps {
  activeConversation: Conversation | null;
  messages: Message[];
  currentUserId: number | null;
  onSendMessage: (content: string | null, type: Message['type'], mediaUrl: string | null) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const ChatWindow = ({ activeConversation, messages, currentUserId, onSendMessage }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation || !currentUserId) {
    return (
      <main className="w-full md:w-1/2 flex items-center justify-center h-full text-gray-500 bg-base-200">
        <p>Select a conversation to start chatting.</p>
      </main>
    );
  }

  const otherParticipant = activeConversation.participants.find(p => p.id !== currentUserId);

  return (
    <main className="w-full md:w-1/2 flex flex-col bg-base-200">
      <header className="flex items-center justify-between p-4 border-b bg-base-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              {otherParticipant?.profilePicture ? (
                <img src={`${API_URL}/uploads/${otherParticipant.profilePicture}`} alt={otherParticipant.firstName} />
              ) : (
                <AvatarFallback name={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`} />
              )}
            </div>
          </div>
          <div>
            <p className="font-bold">{otherParticipant?.firstName} {otherParticipant?.lastName}</p>
            
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-circle"><Phone /></button>
          <button className="btn btn-ghost btn-circle"><Video /></button>
          <button className="btn btn-ghost btn-circle"><MoreHorizontal /></button>
        </div>
      </header>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
};