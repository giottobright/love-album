import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function RegistrationChoice({ telegramId }) {
  const { createNewAccount, setShowJoinForm } = useAuth();

  return (
    <div className="registration-modal">
      <h2>Добро пожаловать!</h2>
      <p>Выберите тип регистрации:</p>
      <div className="registration-buttons">
        <button onClick={() => createNewAccount(telegramId)}>
          Создать новый аккаунт
        </button>
        <button onClick={() => setShowJoinForm(true)}>
          Присоединиться к партнеру
        </button>
      </div>
    </div>
  );
}

export default RegistrationChoice;