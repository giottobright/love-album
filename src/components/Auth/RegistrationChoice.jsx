import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function RegistrationChoice({ telegramId }) {
  const { createNewAccount, setShowJoinForm } = useAuth();

  return (
    <div className="registration-modal">
      <h2>Добро пожаловать!</h2>
      <p>Выберите, как продолжить:</p>
      <div className="registration-buttons">
        <button onClick={() => createNewAccount(telegramId)}>
          Создать новый аккаунт
        </button>
        <button onClick={() => setShowJoinForm(true)}>
          Присоединиться к партнеру (пока не работает)
        </button>
      </div>
    </div>
  );
}


export default RegistrationChoice;