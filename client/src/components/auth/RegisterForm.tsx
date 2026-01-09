import React, { useState, FormEvent } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { TelegramLogin } from './TelegramLoginButton';
import type { RegisterRequest, TelegramUser } from '../../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { register, loginWithTelegram, isLoading, error, clearError, registrationSuccess, clearRegistrationSuccess } = useAuthStore();

  const handleTelegramAuth = async (telegramUser: TelegramUser) => {
    clearError();
    try {
      // Telegram auth creates account if doesn't exist, or logs in if it does
      await loginWithTelegram(telegramUser);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Username validation
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    // Confirm password validation
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData);
      // Success is handled by the store via registrationSuccess
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSuccessClose = () => {
    clearRegistrationSuccess();
    onSwitchToLogin();
  };

  // Show success screen instead of form after registration
  if (registrationSuccess) {
    return (
      <div className="register-form">
        <div className="form-container success-container">
          <div className="success-icon">✓</div>
          <h2 className="form-title">Welcome to Aquarian Gnosis!</h2>
          <p className="form-subtitle">Your account has been created successfully.</p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>You can now sign in with your credentials.</p>
          <button className="form-button primary" onClick={handleSuccessClose}>
            Continue to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-form">
      <div className="form-container">
        <h2 className="form-title">Join Our Community</h2>
        <p className="form-subtitle">Create an account to connect with gnostics worldwide</p>

        {/* Telegram Signup */}
        <div className="social-login-section">
          <TelegramLogin
            onAuth={handleTelegramAuth}
            disabled={isLoading}
          />
        </div>

        <div className="auth-divider">
          <span>or register with email</span>
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
              className={`form-input ${validationErrors.username ? 'error' : ''}`}
              placeholder="Choose a username"
              disabled={isLoading}
            />
            {validationErrors.username && (
              <span className="field-error">{validationErrors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
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
              className={`form-input ${validationErrors.password ? 'error' : ''}`}
              placeholder="Create a password"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {validationErrors.confirmPassword && (
              <span className="field-error">{validationErrors.confirmPassword}</span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.email || !formData.password || !confirmPassword}
            className="form-button primary"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};