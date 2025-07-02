//To render different message types

'use client';

import { Message } from '@/types/chat';
import { AvatarFallback } from './AvatarFallback';
import { File, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MessageBubbleProps {
  message: Message;
  currentUserId: number;
}

export const MessageBubble = ({ message, currentUserId }: MessageBubbleProps) => {
  const isSender = message.sender.id === currentUserId;

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <Image
            src={`${API_URL}/${message.mediaUrl}`}
            alt="Sent image"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        );
      case 'video':
        return (
          <video controls width="300" className="rounded-lg">
            <source src={`${API_URL}/${message.mediaUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'file':
        return (
          <a
            href={`${API_URL}/${message.mediaUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-base-300 rounded-lg hover:bg-base-content/20"
          >
            <File size={24} />
            <span className="font-semibold">{message.content || 'Download File'}</span>
          </a>
        );
      case 'text':
      default:
        return (
          <div className={`chat-bubble ${isSender ? 'chat-bubble-primary' : ''}`}>
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {message.sender.profilePicture ? (
            <img src={`${API_URL}/uploads/${message.sender.profilePicture}`} alt={message.sender.firstName} />
          ) : (
            <AvatarFallback name={`${message.sender.firstName} ${message.sender.lastName}`} />
          )}
        </div>
      </div>
      <div className="chat-header text-xs opacity-70">
        {message.sender.firstName}
        <time className="text-xs opacity-50 ml-2">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      {renderContent()}
    </div>
  );
};