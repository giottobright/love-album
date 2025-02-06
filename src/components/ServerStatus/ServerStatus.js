import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const ServerStatus = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await api.checkHealth();
      setStatus(response);
      setError(null);
    } catch (err) {
      setError('Ошибка подключения к серверу');
      setStatus(null);
    }
  };

  return (
    <div className="server-status">
      <h3>Статус сервера:</h3>
      {status && (
        <div className="status-info">
          <p>Статус: {status.status}</p>
          <p>Время: {new Date(status.timestamp).toLocaleString()}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <button onClick={checkServerStatus}>Проверить статус</button>
    </div>
  );
};

export default ServerStatus;