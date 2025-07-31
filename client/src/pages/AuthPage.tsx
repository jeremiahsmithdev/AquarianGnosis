import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check if user is already authenticated on component mount
    if (localStorage.getItem('access_token')) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

  useEffect(() => {
    // Redirect if user becomes authenticated
    if (isAuthenticated) {
      onSuccess?.();
    }
  }, [isAuthenticated, onSuccess]);

  const handleSwitchToRegister = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  if (isAuthenticated) {
    return (
      <div className="auth-loading">
        <p>Redirecting...</p>
      </div>
    );
  }

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