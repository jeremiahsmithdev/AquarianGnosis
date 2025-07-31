import React, { useState, useEffect, useRef } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';

interface MessageThreadProps {
  recipientId: string;
  recipientUsername: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ recipientId, recipientUsername }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    getMessages,
    sendMessage,
    markMessageRead,
    clearError,
  } = useMessageStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (recipientId) {
      getMessages(recipientId);
    }
  }, [recipientId, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark received messages as read
    messages.forEach(message => {
      if (message.sender_id === recipientId && !message.is_read) {
        markMessageRead(message.id);
      }
    });
  }, [messages, recipientId, markMessageRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);
    clearError();
    
    try {
      await sendMessage({
        recipient_id: recipientId,
        content: messageText
      });
    } catch (error) {
      // Error is handled by the store
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="message-thread loading">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          Loading conversation...
        </div>
      </div>
    );
  }

  return (
    <div className="message-thread">
      <div className="thread-header">
        <div className="recipient-info">
          <div className="recipient-avatar">
            {recipientUsername.charAt(0).toUpperCase()}
          </div>
          <div className="recipient-details">
            <h3>{recipientUsername}</h3>
            <span className="conversation-label">Conversation</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-conversation">
            <p>Start your conversation with {recipientUsername}</p>
            <small>Send a message to begin connecting</small>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${
                  message.sender_id === user?.id ? 'sent' : 'received'
                }`}
              >
                <div className="message-bubble">
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-meta">
                    <span className="message-time">
                      {formatMessageTime(message.created_at)}
                    </span>
                    {message.sender_id === user?.id && (
                      <span className={`message-status ${message.is_read ? 'read' : 'delivered'}`}>
                        {message.is_read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${recipientUsername}...`}
            disabled={isSending}
            className="message-input"
            maxLength={5000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="send-button"
          >
            {isSending ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};