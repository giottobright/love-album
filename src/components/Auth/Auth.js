import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import RegistrationChoice from './RegistrationChoice';
import JoinPartnerForm from './JoinPartnerForm';

function Auth({ children }) {
  const {
    auth,
    setAuth,
    showRegistrationChoice,
    setShowRegistrationChoice,
    showJoinForm,
    registrationTelegramId,
    setRegistrationTelegramId
  } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedAccountId = localStorage.getItem('accountId');
      
      if (savedToken && savedAccountId) {
        api.setAuthToken(savedToken);
        setAuth({ token: savedToken, accountId: savedAccountId });
        return;
      }
      
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        try {
          const userExists = await api.checkUserExists(telegramId);
          
          if (!userExists) {
            setRegistrationTelegramId(telegramId);
            setShowRegistrationChoice(true);
            return;
          }
          
          const { token, accountId } = await api.auth(telegramId);
          setAuth({ token, accountId });
          api.setAuthToken(token);
          localStorage.setItem('authToken', token);
          localStorage.setItem('accountId', accountId);
        } catch (error) {
          console.error('Ошибка авторизации через Telegram:', error);
        }
      } else if (process.env.NODE_ENV !== 'production') {
        const testToken = '4e26302ea670d1f070f75d36b123115e4bcc1e05f64ccb472bc9f3a4629c4f5d02897adf8539a2bcf7b75b2e7ccd729b8893a464357f50f338811aba5a801bcc';
        const testAccountId = '12345';
        localStorage.setItem('authToken', testToken);
        localStorage.setItem('accountId', testAccountId);
        api.setAuthToken(testToken);
        setAuth({ token: testToken, accountId: testAccountId });
      }
    };
  
    initAuth();
  }, [setAuth, setRegistrationTelegramId, setShowRegistrationChoice]);

  if (showRegistrationChoice) {
    return <RegistrationChoice telegramId={registrationTelegramId} />;
  }

  if (showJoinForm) {
    return <JoinPartnerForm telegramId={registrationTelegramId} />;
  }

  if (!auth) {
    return <div>Загрузка...</div>;
  }

  return children;
}

export default Auth;