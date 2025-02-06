// src/utils/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = {
  // Базовая функция для выполнения запросов
  async fetchWithError(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Проверка здоровья сервера
  async checkHealth() {
    return this.fetchWithError('/api/health');
  },

  // Здесь можно добавить другие методы для работы с API
};