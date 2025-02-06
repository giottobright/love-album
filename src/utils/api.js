class Api {
    constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3013';
      this.token = localStorage.getItem('authToken');
    }
  
    setAuthToken(token) {
      this.token = token;
      localStorage.setItem('authToken', token);
    }
  
    clearAuthToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    }
  
    getHeaders(isFormData = false) {
      const headers = {};
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      return headers;
    }
  
    async fetchWithError(endpoint, options = {}) {
      const isFormData = options.body instanceof FormData;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...(options.headers || {}),
        },
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
  
      return response.json();
    }
  
    // Авторизация
    async auth(telegramId) {
      const response = await this.fetchWithError('/api/auth/telegram', {
        method: 'POST',
        body: JSON.stringify({ telegramId })
      });
      
      if (response.token) {
        this.setAuthToken(response.token);
      }
      
      return response;
    }
  
    // Проверка здоровья сервера
    async checkHealth() {
      return this.fetchWithError('/api/health');
    }
  
    async checkServerStatus() {
      try {
        const response = await fetch(`${this.baseUrl}/api/health`);
        return response.ok;
      } catch (error) {
        console.error('Ошибка проверки статуса сервера:', error);
        return false;
      }
    }
  
    // Работа с фотографиями
    async uploadPhoto(formData) {
      return this.fetchWithError('/api/photos', {
        method: 'POST',
        body: formData
      });
    }
  
    async fetchPhotos(monthKey) {
      return this.fetchWithError(`/api/photos?month=${monthKey}`);
    }
  
    async updatePhoto(photoId, data) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
  
      return this.fetchWithError(`/api/photos/${photoId}`, {
        method: 'PUT',
        body: formData
      });
    }
  
    async deletePhoto(photoId) {
      return this.fetchWithError(`/api/photos/${photoId}`, {
        method: 'DELETE'
      });
    }
  
    // Для разработки
    async getTestToken() {
      if (process.env.NODE_ENV !== 'production') {
        return this.fetchWithError('/api/auth/test-token');
      }
      throw new Error('Метод доступен только в режиме разработки');
    }
  
    // Связывание аккаунтов
    async linkAccount(targetTelegramId) {
      return this.fetchWithError('/api/accounts/link', {
        method: 'POST',
        body: JSON.stringify({ targetTelegramId })
      });
    }
  }
  
  export const api = new Api();