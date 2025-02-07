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

    console.log("✅ useEffect запущен!");
    const initAuth = async () => {
      console.log("🚀 Запускаем initAuth!");
      const savedToken = localStorage.getItem('authToken');
      const savedAccountId = localStorage.getItem('accountId');
  
      if (savedToken && savedAccountId) {
        api.setAuthToken(savedToken);
        setAuth({ token: savedToken, accountId: savedAccountId });
        return;
      }
  
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        console.log("🟢 window.Telegram.WebApp:", window.Telegram?.WebApp);
console.log("🟡 window.Telegram.WebApp.initDataUnsafe:", window.Telegram?.WebApp?.initDataUnsafe);

        const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        console.log("🔹 Telegram ID найден:", telegramId);
  
        try {
          console.log("📢 Отправляем в API Telegram ID:", telegramId);
          const response = await api.auth(telegramId);
          console.log("🔹 Ответ API:", response);
  
          if (!response.exists) {
            console.log("🔸 Пользователь не найден, показываем окно регистрации");
            setRegistrationTelegramId(telegramId);
            console.log("🛑 Должно открыться окно регистрации!"); 
            setShowRegistrationChoice(true);
            
            return;
          }
  
          console.log("✅ Пользователь найден, выполняем авторизацию");
          setAuth({ token: response.token, accountId: response.accountId });
          api.setAuthToken(response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('accountId', response.accountId);
        } catch (error) {
          console.error("❌ Ошибка авторизации через Telegram:", error);
        }
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
