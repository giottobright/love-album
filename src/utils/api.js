// love-album/src/utils/api.js
class Api {
    constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3021';
      this.token = localStorage.getItem('authToken');
    }
    
    setAuthToken(token) {
      this.token = token;
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
      try {
        console.log('Отправка запроса:', `${this.baseUrl}${endpoint}`);
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...this.getHeaders(isFormData),
            ...(options.headers || {}),
          },
        });
    
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Получен ответ:', data);
        return data;
      } catch (error) {
        console.error(`Ошибка запроса к ${this.baseUrl}${endpoint}:`, error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Ошибка подключения к серверу');
        }
        throw error;
      }
    }
    
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
    
    async getTestToken() {
      if (process.env.NODE_ENV !== 'production') {
        return this.fetchWithError('/api/auth/test-token');
      }
      throw new Error('Метод доступен только в режиме разработки');
    }
    
    // Метод загрузки фото
    async uploadPhoto(formData) {
        return this.fetchWithError('/api/photos', {
          method: 'POST',
          body: formData
        });
      }
    
    async fetchPhotos(monthKey) {
      return this.fetchWithError(`/api/photos?monthKey=${encodeURIComponent(monthKey)}`);
    }
    
    async checkHealth() {
      return this.fetchWithError('/api/health');
    }
  }
  
  export const api = new Api();