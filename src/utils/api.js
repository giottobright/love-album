const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3014';

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

  async checkHealth() {
    return this.fetchWithError('/api/health');
  },

  async checkServerStatus() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Ошибка проверки статуса сервера:', error);
      return false;
    }
  },

  async uploadPhoto(formData) {
    return this.fetchWithError('/api/photos', {
      method: 'POST',
      body: formData,
    });
  },

  async fetchPhotos(monthKey) {
    return this.fetchWithError(`/api/photos?month=${monthKey}`);
  }
};