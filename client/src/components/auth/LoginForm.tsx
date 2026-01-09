import React, { useState, FormEvent } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { TelegramLogin } from './TelegramLoginButton';
import type { LoginRequest, TelegramUser } from '../../types';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  
  const { login, loginWithTelegram, isLoading, error, clearError } = useAuthStore();

  const handleTelegramAuth = async (telegramUser: TelegramUser) => {
    clearError();
    try {
      await loginWithTelegram(telegramUser);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-form">
      <div className="form-container">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to connect with the gnostic community</p>

        {/* Telegram Login */}
        <div className="social-login-section">
          <TelegramLogin
            onAuth={handleTelegramAuth}
            disabled={isLoading}
          />
        </div>

        <div className="auth-divider">
          <span>or continue with username</span>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.password}
            className="form-button primary"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="link-button"
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};