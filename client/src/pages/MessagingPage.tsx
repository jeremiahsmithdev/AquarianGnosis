import React, { useState, useEffect } from 'react';
import { ConversationList } from '../components/messaging/ConversationList';
import { MessageThread } from '../components/messaging/MessageThread';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import '../styles/messaging.css';

interface MessagingPageProps {
  onNavigate: (page: string) => void;
  initialRecipientId?: string;
  initialRecipientUsername?: string;
}

export const MessagingPage: React.FC<MessagingPageProps> = ({ 
  onNavigate, 
  initialRecipientId, 
  initialRecipientUsername 
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    username: string;
  } | null>(null);
  
  const { isAuthenticated } = useAuthStore();
  const { setCurrentConversation } = useMessageStore();

  // Set initial recipient if provided
  useEffect(() => {
    if (initialRecipientId && initialRecipientUsername) {
      setSelectedRecipient({
        id: initialRecipientId,
        username: initialRecipientUsername
      });
    }
  }, [initialRecipientId, initialRecipientUsername]);

  const handleConversationSelect = (userId: string, username: string) => {
    setSelectedRecipient({ id: userId, username });
    setCurrentConversation({ 
      user_id: userId, 
      username, 
      latest_message: null, 
      latest_message_time: null, 
      unread_count: 0 
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="messaging-page">
        <div className="messaging-header">
          <div className="header-content">
            <h1>Messages</h1>
            <button onClick={() => onNavigate('landing')} className="back-button">
              ← Back to Home
            </button>
          </div>
        </div>
        
        <div className="auth-required-messaging">
          <div className="auth-prompt">
            <h2>Sign In Required</h2>
            <p>Please sign in to access your messages and connect with the gnostic community.</p>
            <button 
              onClick={() => onNavigate('auth')}
              className="sign-in-button"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-page">
      <div className="messaging-header">
        <div className="header-content">
          <h1>Messages</h1>
          <div className="header-actions">
            <button onClick={() => onNavigate('map')} className="map-button">
              🗺️ Find People
            </button>
            <button onClick={() => onNavigate('landing')} className="back-button">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="messaging-content">
        <div className="messaging-layout">
          <div className="conversations-panel">
            <ConversationList onConversationSelect={handleConversationSelect} />
          </div>
          
          <div className="messages-panel">
            {selectedRecipient ? (
              <MessageThread
                recipientId={selectedRecipient.id}
                recipientUsername={selectedRecipient.username}
              />
            ) : (
              <div className="no-conversation-selected">
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <h3>Select a Conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                  <div className="getting-started">
                    <p>New to the community?</p>
                    <button 
                      onClick={() => onNavigate('map')}
                      className="find-people-button"
                    >
                      Find People on the Map
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .messaging-page {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
                      url('/assets/banyan.jpg') center/cover fixed;
        }

        .messaging-header {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          color: white;
          padding: 30px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-content h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .map-button,
        .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .map-button:hover,
        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .auth-required-messaging {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 40px;
        }

        .auth-prompt {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .auth-prompt h2 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 24px;
        }

        .auth-prompt p {
          margin: 0 0 24px 0;
          color: #4b5563;
          font-size: 16px;
          line-height: 1.5;
        }

        .sign-in-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sign-in-button:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .messaging-content {
          padding: 40px;
        }

        .messaging-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          height: 600px;
        }

        .conversations-panel,
        .messages-panel {
          height: 100%;
        }

        .no-conversation-selected {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 20px;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          color: #64748b;
          font-size: 16px;
        }

        .getting-started {
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .getting-started p {
          margin: 0 0 16px 0;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
        }

        .find-people-button {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .find-people-button:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .messaging-header {
            padding: 20px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .messaging-content {
            padding: 20px;
          }

          .messaging-layout {
            grid-template-columns: 1fr;
            grid-template-rows: 300px 1fr;
            height: auto;
            gap: 20px;
          }

          .conversations-panel {
            order: 1;
          }

          .messages-panel {
            order: 2;
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
};