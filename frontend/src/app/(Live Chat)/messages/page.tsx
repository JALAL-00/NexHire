'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { getChatUsers, getOrCreateConversation, getMessageHistory } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ConversationDetails } from '@/components/chat/ConversationDetails';
import { Conversation, Message, ChatUser, MessageType } from '@/types/chat';

function MessagesContent() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversationId');

  const handleSelectConversation = useCallback(async (userId: number) => {
    try {
      const conversation = await getOrCreateConversation(userId);
      setActiveConversation(conversation);
      router.push(`/messages?conversationId=${conversation.id}`, { scroll: false });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [router]);

  // --- EFFECT 1: Runs ONCE to establish socket connection ---
  useEffect(() => {
    // Prevent re-connecting if already connected
    if (socketRef.current) return;

    // Fetch initial user data
    getChatUsers().then(setUsers).catch(err => console.error('Failed to fetch users:', err));
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (e) { console.error('Failed to parse auth token:', e); }
    }

    // Connect the socket with proper production URL handling
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    console.log('🔌 Connecting to Socket.IO server:', API_URL);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔑 Token available:', !!token);
    console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'none');

    const socket = io(API_URL, {
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });

    // Add connection event handlers for debugging
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      console.error('Error details:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
    });

    // Add authentication event listeners
    socket.on('authenticated', (data) => {
      console.log('✅ Authenticated successfully:', data);
    });

    socket.on('authError', (error) => {
      console.error('❌ Authentication error from server:', error);
      alert(`Authentication failed: ${error.message}. Please log in again.`);
    });

    socketRef.current = socket;

    // Define the message handler
    const handleNewMessage = (message: Message) => {
      // Use the URL to determine the active conversation, not component state
      const currentConvoId = new URLSearchParams(window.location.search).get('conversationId');
      if (currentConvoId && message.conversation.id.toString() === currentConvoId) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    // Attach listener
    socket.on('newMessage', handleNewMessage);

    // Cleanup on component unmount
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // Empty dependency array ensures this runs only once.

  // --- EFFECT 2: Runs when the conversationId in the URL changes ---
  useEffect(() => {
    // If there's no ID in the URL, clear the chat window
    if (!conversationIdFromUrl) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    // --- FIX: Wait for the socket to be connected before proceeding ---
    if (!socketRef.current) return;

    const loadConversation = async () => {
      try {
        // Join the socket room for this conversation
        socketRef.current?.emit('joinRoom', Number(conversationIdFromUrl));
        // Fetch the message history
        const history = await getMessageHistory(Number(conversationIdFromUrl));
        setMessages(history);

        // A better way to get conversation details from the user list
        const otherParticipantId = history[0]?.sender.id !== currentUserId
          ? history[0]?.sender.id
          : history.find(m => m.sender.id !== currentUserId)?.sender.id;

        if (otherParticipantId) {
          const convo = await getOrCreateConversation(otherParticipantId);
          setActiveConversation(convo);
        }

      } catch (error) {
        console.error("Failed to load conversation history:", error);
        router.push('/messages');
      }
    };

    loadConversation();

  }, [conversationIdFromUrl, currentUserId, router]);

  const handleSendMessage = (content: string | null, type: MessageType, mediaUrl: string | null) => {
    if (activeConversation && socketRef.current) {
      socketRef.current.emit('sendMessage', {
        conversationId: activeConversation.id,
        content,
        type,
        mediaUrl,
      });
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      <ConversationList
        users={users}
        activeConversation={activeConversation}
        currentUserId={currentUserId}
        onUserClick={handleSelectConversation}
      />
      <ChatWindow
        activeConversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
      <ConversationDetails
        activeConversation={activeConversation}
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}