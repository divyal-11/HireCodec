'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Code2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSocket } from '@/lib/socket';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'code' | 'system';
  sentAt: string;
}

interface ChatDrawerProps {
  roomId: string;
  onSendMessage: (content: string, type?: 'text' | 'code') => void;
}

export function ChatDrawer({ roomId, onSendMessage }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on('chat:message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chat:message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim(), isCodeMode ? 'code' : 'text');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-editor-surface border-l border-t border-editor-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-editor-border bg-editor-bg">
        <MessageSquare className="w-4 h-4 text-editor-comment" />
        <span className="text-xs font-medium text-editor-text">Chat</span>
        <span className="text-[10px] text-editor-comment ml-auto">
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-editor-comment opacity-40">
            <p className="text-xs text-center">
              No messages yet.
              <br />
              Start a conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "animate-fade-in",
              msg.type === 'system' && "text-center"
            )}
          >
            {msg.type === 'system' ? (
              <span className="text-[10px] text-editor-comment italic px-3 py-1 rounded-full bg-editor-bg">
                {msg.content}
              </span>
            ) : (
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-brand-primary">
                    {msg.senderName}
                  </span>
                  <span className="text-[9px] text-editor-comment">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {msg.type === 'code' ? (
                  <pre className="bg-editor-bg rounded-md p-2 text-[11px] font-mono text-editor-text border border-editor-border overflow-x-auto">
                    {msg.content}
                  </pre>
                ) : (
                  <p className="text-xs text-editor-text/80 leading-relaxed">
                    {msg.content}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-editor-border bg-editor-bg">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setIsCodeMode(!isCodeMode)}
            className={cn(
              "p-1.5 rounded transition-colors",
              isCodeMode
                ? "text-brand-accent bg-brand-accent/10"
                : "text-editor-comment hover:text-editor-text"
            )}
            title={isCodeMode ? 'Switch to text' : 'Switch to code'}
          >
            <Code2 className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isCodeMode ? 'Share code snippet...' : 'Type a message...'}
              className={cn(
                "w-full bg-editor-surface border border-editor-border rounded-lg px-3 py-2 text-xs",
                "text-editor-text placeholder:text-editor-comment resize-none",
                "focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20",
                isCodeMode && "font-mono"
              )}
              rows={1}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "p-2 rounded-lg transition-all",
              input.trim()
                ? "bg-brand-primary text-white hover:bg-brand-primary-dark"
                : "bg-editor-surface text-editor-comment cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
