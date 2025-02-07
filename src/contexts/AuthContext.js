// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
      const saved = localStorage.getItem('auth');
      return saved ? JSON.parse(saved) : null;
  });

  const [inviteCode, setInviteCode] = useState(null);

  useEffect(() => {
      if (auth) {
          localStorage.setItem('auth', JSON.stringify(auth));
      } else {
          localStorage.removeItem('auth');
      }
  }, [auth]);

  const generateInviteCode = async () => {
      try {
          const response = await api.fetchWithError('/api/auth/invite-code', {
              method: 'POST'
          });
          setInviteCode(response.inviteCode);
          return response.inviteCode;
      } catch (error) {
          console.error('Error generating invite code:', error);
          throw error;
      }
  };

  const joinWithCode = async (telegramId, code) => {
      try {
          const response = await api.fetchWithError('/api/auth/join', {
              method: 'POST',
              body: JSON.stringify({ telegramId, inviteCode: code })
          });
          
          if (response.token) {
              setAuth({ token: response.token, accountId: response.user.account_id });
              api.setAuthToken(response.token);
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('accountId', response.user.account_id);
          }
          
          return response;
      } catch (error) {
          console.error('Error joining with code:', error);
          throw error;
      }
  };

  return (
      <AuthContext.Provider value={{ 
          auth, 
          setAuth, 
          inviteCode,
          generateInviteCode,
          joinWithCode
      }}>
          {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);