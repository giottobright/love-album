import React, { createContext, useState, useContext } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [showRegistrationChoice, setShowRegistrationChoice] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [registrationTelegramId, setRegistrationTelegramId] = useState(null);

  // Добавляем функцию joinWithCode – пока не реализовано, выводим заглушку
  const joinWithCode = async (telegramId, inviteCode, partnerUsername) => {
    console.log("joinWithCode вызван с", telegramId, inviteCode, partnerUsername);
    // Пока что логика не реализована
    return Promise.resolve();
  };

  const createNewAccount = async (telegramId) => {
    try {
      const response = await api.createAccount(telegramId);
      if (response.token) {
        setAuth({ token: response.token, accountId: response.user.account_id });
        api.setAuthToken(response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('accountId', response.user.account_id);
        setShowRegistrationChoice(false);
      }
      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      createNewAccount,
      joinWithCode,
      showRegistrationChoice,
      setShowRegistrationChoice,
      showJoinForm,
      setShowJoinForm,
      registrationTelegramId,
      setRegistrationTelegramId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);