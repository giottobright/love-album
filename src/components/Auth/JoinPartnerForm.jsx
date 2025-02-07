import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function JoinPartnerForm({ telegramId }) {
  const [inviteCode, setInviteCode] = useState('');
  const [partnerUsername, setPartnerUsername] = useState('');
  const { joinWithCode, setShowJoinForm } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await joinWithCode(telegramId, inviteCode, partnerUsername);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="join-form-modal">
      <h2>Присоединиться к партнеру</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Код приглашения"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="@username партнера"
          value={partnerUsername}
          onChange={(e) => setPartnerUsername(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit">Присоединиться</button>
          <button type="button" onClick={() => setShowJoinForm(false)}>
            Назад
          </button>
        </div>
      </form>
    </div>
  );
}

export default JoinPartnerForm;