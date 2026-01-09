/**
 * TelegramAccountSettings - Manage Telegram account linking
 *
 * Displayed in user settings/profile page.
 * Allows users to link or unlink their Telegram account.
 */
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { TelegramLogin } from './TelegramLoginButton';
import type { TelegramUser } from '../../types';

export const TelegramAccountSettings: React.FC = () => {
  const { user, linkTelegram, unlinkTelegram, isLoading, error, clearError } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);

  const handleLink = async (telegramUser: TelegramUser) => {
    clearError();
    try {
      await linkTelegram(telegramUser);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleUnlinkClick = () => {
    // Check if user has password auth
    if (user?.auth_provider === 'telegram') {
      showNotification('warning', 'Please set up email and password before unlinking Telegram');
      return;
    }
    setShowUnlinkConfirm(true);
  };

  const handleUnlinkConfirm = async () => {
    setShowUnlinkConfirm(false);
    clearError();
    try {
      await unlinkTelegram();
    } catch (err) {
      // Error handled by store
    }
  };

  if (!user) return null;

  const hasTelegram = !!user.telegram_id;
  const canUnlink = user.auth_provider === 'both' || user.email;

  return (
    <div className="telegram-settings">
      <h3 className="telegram-settings-title">Telegram Account</h3>

      {error && (
        <div className="telegram-settings-error">
          {error}
        </div>
      )}

      {hasTelegram ? (
        <div className="telegram-linked">
          <div className="telegram-info">
            {user.telegram_photo_url && (
              <img
                src={user.telegram_photo_url}
                alt="Telegram avatar"
                className="telegram-avatar"
              />
            )}
            <div className="telegram-details">
              <span className="telegram-username">
                @{user.telegram_username || 'Linked'}
              </span>
              <span className="telegram-status">Connected</span>
            </div>
          </div>

          {showUnlinkConfirm ? (
            <div className="telegram-unlink-confirm">
              <p className="telegram-confirm-text">Unlink your Telegram account?</p>
              <div className="telegram-confirm-buttons">
                <button
                  onClick={handleUnlinkConfirm}
                  disabled={isLoading}
                  className="telegram-unlink-button"
                >
                  {isLoading ? 'Unlinking...' : 'Yes, Unlink'}
                </button>
                <button
                  onClick={() => setShowUnlinkConfirm(false)}
                  disabled={isLoading}
                  className="telegram-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUnlinkClick}
              disabled={isLoading || !canUnlink}
              className="telegram-unlink-button"
            >
              Unlink Telegram
            </button>
          )}

          {!canUnlink && !showUnlinkConfirm && (
            <p className="telegram-warning">
              Set up email and password before unlinking Telegram
            </p>
          )}
        </div>
      ) : (
        <div className="telegram-not-linked">
          <p className="telegram-description">
            Link your Telegram account for easier login and to import your profile.
          </p>
          <TelegramLogin onAuth={handleLink} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default TelegramAccountSettings;
