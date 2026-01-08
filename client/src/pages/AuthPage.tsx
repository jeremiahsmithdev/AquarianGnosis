import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import '../styles/auth.css';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, getCurrentUser } = useAuthStore();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Check if user is already authenticated on component mount
    // If so, redirect immediately - user shouldn't be on auth page
    if (localStorage.getItem('access_token') && !hasRedirected.current) {
      getCurrentUser().then(() => {
        // After verifying auth, redirect to home
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          onSuccess?.();
        }
      });
    }
  }, [getCurrentUser, onSuccess]);

  // Redirect authenticated users who land here directly
  useEffect(() => {
    if (isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      onSuccess?.();
    }
  }, [isAuthenticated, onSuccess]);

  const handleSwitchToRegister = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return (
    <div className="auth-page">
      {isLogin ? (
        <LoginForm
          onSwitchToRegister={handleSwitchToRegister}
          onSuccess={onSuccess}
        />
      ) : (
        <RegisterForm
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};