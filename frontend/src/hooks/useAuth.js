// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to provide auth context.
 * This is a best practice to avoid importing useContext and AuthContext in every component.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};