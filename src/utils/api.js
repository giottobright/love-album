// src/utils/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = {
  async fetchWithError(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        // Для FormData не указываем Content-Type вручную
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async uploadPhoto(formData) {
    return this.fetchWithError('/api/photos', {
      method: 'POST',
      body: formData,
    });
  },
};
