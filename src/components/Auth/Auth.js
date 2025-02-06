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
            // Устанавливаем тестовый токен вручную
            const testToken = '4e26302ea670d1f070f75d36b123115e4bcc1e05f64ccb472bc9f3a4629c4f5d02897adf8539a2bcf7b75b2e7ccd729b8893a464357f50f338811aba5a801bcc';
            const testAccountId = '12345';           // замените на тестовый идентификатор
            localStorage.setItem('authToken', testToken);
            localStorage.setItem('accountId', testAccountId);
            api.setAuthToken(testToken);
            setAuth({ token: testToken, accountId: testAccountId });
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