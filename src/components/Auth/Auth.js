import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

function Auth({ children }) {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      // Проверяем, есть ли сохранённый токен
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        api.setAuthToken(savedToken);
        return;
      }

      // Проверяем, запущено ли приложение в Telegram
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        if (tg.initDataUnsafe?.user?.id) {
          const telegramId = tg.initDataUnsafe.user.id.toString();
          
          try {
            const { token, accountId } = await api.auth(telegramId);
            setAuth({ token, accountId });
            api.setAuthToken(token);
          } catch (error) {
            console.error('Ошибка авторизации:', error);
          }
        }
      } else {
        // Если приложение запущено не в Telegram, можно использовать тестовый токен
        if (process.env.NODE_ENV !== 'production') {
          try {
            const { token, accountId } = await api.getTestToken();
            setAuth({ token, accountId });
            api.setAuthToken(token);
          } catch (error) {
            console.error('Ошибка получения тестового токена:', error);
          }
        }
      }
    };

    initAuth();
  }, [setAuth]);

  // Показываем загрузку только если нет токена
  if (!api.token) {
    return <div>Загрузка...</div>;
  }

  return children;
}

export default Auth;