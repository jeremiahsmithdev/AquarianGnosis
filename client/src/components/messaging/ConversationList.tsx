import React, { useEffect } from 'react';
import { useMessageStore } from '../../stores/messageStore';

interface ConversationListProps {
  onConversationSelect: (userId: string, username: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ onConversationSelect }) => {
  const {
    conversations,
    currentConversation,
    unreadCount,
    isLoading,
    error,
    getConversations,
    getUnreadCount,
    clearError,
  } = useMessageStore();

  useEffect(() => {
    getConversations();
    getUnreadCount();
  }, [getConversations, getUnreadCount]);

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    
    const date = new Date(timeString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (error) {
    return (
      <div className="conversation-list error">
        <div className="error-message">
          {error}
          <button onClick={() => { clearError(); getConversations(); }} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h3>Messages</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>
      
      {isLoading && conversations.length === 0 ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          Loading conversations...
        </div>
      ) : conversations.length === 0 ? (
        <div className="empty-state">
          <p>No conversations yet</p>
          <small>Start a conversation by connecting with someone on the map</small>
        </div>
      ) : (
        <div className="conversation-items">
          {conversations.map((conversation) => (
            <div
              key={conversation.user_id}
              className={`conversation-item ${
                currentConversation?.user_id === conversation.user_id ? 'active' : ''
              }`}
              onClick={() => onConversationSelect(conversation.user_id, conversation.username)}
            >
              <div className="conversation-avatar">
                <div className="avatar-circle">
                  {conversation.username.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header-row">
                  <span className="conversation-username">
                    {conversation.username}
                  </span>
                  <span className="conversation-time">
                    {formatTime(conversation.latest_message_time)}
                  </span>
                </div>
                
                <div className="conversation-preview">
                  <span className="latest-message">
                    {conversation.latest_message || 'No messages yet'}
                  </span>
                  {conversation.unread_count > 0 && (
                    <span className="conversation-unread-badge">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};