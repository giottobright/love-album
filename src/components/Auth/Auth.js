import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

function Auth({ children }) {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      // Если токен уже сохранён, используем его и устанавливаем состояние аутентификации
      const savedToken = localStorage.getItem('authToken');
      const savedAccountId = localStorage.getItem('accountId');
      if (savedToken && savedAccountId) {
        api.setAuthToken(savedToken);
        setAuth({ token: savedToken, accountId: savedAccountId });
        return;
      }

      // Если приложение запущено в Telegram, пробуем авторизоваться через Telegram WebApp
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user?.id) {
        const tg = window.Telegram.WebApp;
        const telegramId = tg.initDataUnsafe.user.id.toString();
        try {
          const { token, accountId } = await api.auth(telegramId);
          setAuth({ token, accountId });
          api.setAuthToken(token);
          localStorage.setItem('authToken', token);
          localStorage.setItem('accountId', accountId);
        } catch (error) {
          console.error('Ошибка авторизации через Telegram:', error);
        }
      } else {
        // Если не в Telegram и в режиме разработки — используем тестовый токен
        if (process.env.NODE_ENV !== 'production') {
          try {
            const { token, accountId } = await api.getTestToken();
            setAuth({ token, accountId });
            api.setAuthToken(token);
            localStorage.setItem('authToken', token);
            localStorage.setItem('accountId', accountId);
          } catch (error) {
            console.error('Ошибка получения тестового токена:', error);
          }
        }
      }
    };

    initAuth();
  }, [setAuth]);

  // Если аутентификация ещё не завершена, показываем "Загрузка..."
  if (!auth) {
    return <div>Загрузка...</div>;
  }

  return children;
}

export default Auth;