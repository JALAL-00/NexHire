'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Send, Bot, User, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const prevMessagesLength = usePrevious(messages.length);

  useEffect(() => {
    if (prevMessagesLength !== undefined && messages.length > prevMessagesLength) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, prevMessagesLength]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const token = Cookies.get('auth_token');
    if (!token) {
      const errorMessage: Message = { sender: 'ai', text: 'Authentication error. Please log in.' };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/ai/assistant',
        { userInput: currentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const aiMessage: Message = { sender: 'ai', text: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- THIS IS THE FIX ---
  // We create a robust flexbox container that correctly calculates its height
  // to fill the space BELOW your main navbar. A typical navbar height is around 72px.
  // This avoids layout conflicts and the need for a fixed footer.
  return (
    <div 
      className="flex flex-col w-full bg-base-200 text-base-content" 
      style={{ height: 'calc(100vh - 72px)' }} // Adjust 72px if your navbar is taller/shorter
    >
      {/* Main chat area grows to fill available space and is scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-5 bg-primary/10 rounded-full mb-4">
                <Bot size={48} className="text-primary" />
              </div>
              <h1 className="text-4xl font-semibold text-gray-700">
                Nexi - Your AI Career Assistant.
              </h1>
              <p className="text-lg text-gray-500 mt-2">How can I help you today?</p>
            </div>
          )}

          {/* Conversation */}
          <div className="space-y-8">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`p-4 rounded-xl max-w-2xl shadow-sm ${msg.sender === 'ai' ? 'bg-base-100' : 'bg-primary text-primary-content'}`}>
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center flex-shrink-0"><Bot size={20} /></div>
                <div className="p-4 rounded-xl bg-base-100 shadow-sm"><span className="loading loading-dots loading-md"></span></div>
              </div>
            )}
            {/* This ref is still used to scroll to the bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Footer is now a normal flex item, not fixed */}
      <footer className="p-4 bg-base-200 border-t border-base-300">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto bg-base-100 p-3 rounded-2xl shadow-lg border border-base-300">
          <div className="relative">
            <input
              type="text"
              className="input bg-transparent w-full focus:outline-none pr-24"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button type="button" className="btn btn-ghost btn-sm btn-circle"><Mic size={18} /></button>
              <button type="submit" className="btn btn-primary btn-sm btn-circle" disabled={isLoading || !input.trim()}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
}