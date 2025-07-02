//The bottom input form with file upload

'use client';

import { useState, useRef } from 'react';
import { Smile, Mic, Paperclip, Send } from 'lucide-react';
import { MessageType, Message } from '@/types/chat';
import { uploadChatFile } from '@/lib/api';
import toast from 'react-hot-toast';

interface MessageInputProps {
  onSendMessage: (content: string | null, type: Message['type'], mediaUrl: string | null) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Uploading file...');

    try {
      const { filePath } = await uploadChatFile(file);
      
      let type: MessageType = MessageType.FILE;
      if (file.type.startsWith('image/')) type = MessageType.IMAGE;
      if (file.type.startsWith('video/')) type = MessageType.VIDEO;
      
      onSendMessage(file.name, type, filePath);
      toast.success('File sent!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed.', { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset the file input so the same file can be selected again
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text, MessageType.TEXT, null);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSendText} className="p-4 border-t bg-base-100 flex-shrink-0">
      <div className="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="input bg-transparent w-full focus:outline-none"
          disabled={isUploading}
        />
        <button type="button" className="btn btn-ghost btn-circle" disabled={isUploading}><Smile /></button>
        <button type="button" className="btn btn-ghost btn-circle" disabled={isUploading} onClick={() => fileInputRef.current?.click()}><Paperclip /></button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button type="submit" className="btn btn-primary btn-circle" disabled={isUploading}>
          {isUploading ? <span className="loading loading-spinner loading-xs"></span> : <Send size={20} />}
        </button>
      </div>
    </form>
  );
};