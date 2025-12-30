import { Mail, ChevronLeft, Clock, Trash2, Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';

export interface Message {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  sender: string;
  priority: 'low' | 'normal' | 'high';
}

interface MessagesScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
}

export function MessagesScreen({ messages, setMessages, onBack }: MessagesScreenProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const unreadCount = messages.filter(m => !m.read).length;

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read
    if (!message.read) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setSelectedMessage(null);
    }
  };

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-[#ef4444]';
      case 'normal':
        return 'text-[#4a90e2]';
      case 'low':
        return 'text-[#a8a8b8]';
      default:
        return 'text-[#a8a8b8]';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#ef4444]/20 border-[#ef4444]/30';
      case 'normal':
        return 'bg-[#4a90e2]/20 border-[#4a90e2]/30';
      case 'low':
        return 'bg-[#a8a8b8]/20 border-[#a8a8b8]/30';
      default:
        return 'bg-[#a8a8b8]/20 border-[#a8a8b8]/30';
    }
  };

  if (selectedMessage) {
    return (
      <div className="h-full bg-[#1a1a2e] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] p-5">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setSelectedMessage(null)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h2 className="text-white">{selectedMessage.title}</h2>
              <p className="text-white/80 text-xs">From: {selectedMessage.sender}</p>
            </div>
            <button
              onClick={() => handleDeleteMessage(selectedMessage.id)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className={`bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-xl p-4 border ${getPriorityBg(selectedMessage.priority)} mb-4`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#a8a8b8]" />
              <span className="text-[#a8a8b8] text-xs">{selectedMessage.timestamp}</span>
              <span className={`text-xs uppercase px-2 py-1 rounded ${getPriorityColor(selectedMessage.priority)} bg-white/5 ml-auto`}>
                {selectedMessage.priority}
              </span>
            </div>
            <div className="text-[#e8e8e8] leading-relaxed whitespace-pre-wrap">
              {selectedMessage.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1a1a2e] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] p-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Message Center</h2>
            <p className="text-white/80 text-xs">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All messages read'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-white/80 text-xs hover:text-white transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Mail className="w-16 h-16 text-[#a8a8b8]/30 mb-4" />
            <p className="text-[#a8a8b8]">No messages yet</p>
            <p className="text-[#a8a8b8]/60 text-xs mt-2">Messages from the admin will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`w-full text-left bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-xl p-4 border transition-all hover:scale-[1.02] ${
                  message.read 
                    ? 'border-white/10 opacity-70' 
                    : getPriorityBg(message.priority)
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.read ? 'bg-white/5' : 'bg-[#4a90e2]/20'
                  }`}>
                    {message.read ? (
                      <CheckCheck className="w-5 h-5 text-[#a8a8b8]" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#4a90e2]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`${message.read ? 'text-[#a8a8b8]' : 'text-[#e8e8e8]'} truncate`}>
                        {message.title}
                      </h3>
                      {!message.read && (
                        <span className="w-2 h-2 bg-[#4a90e2] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[#a8a8b8] text-xs mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[#a8a8b8]/60 text-[10px]">{message.sender}</span>
                      <span className="text-[#a8a8b8]/60 text-[10px]">•</span>
                      <span className="text-[#a8a8b8]/60 text-[10px]">{message.timestamp}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${getPriorityColor(message.priority)} bg-white/5 ml-auto`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
