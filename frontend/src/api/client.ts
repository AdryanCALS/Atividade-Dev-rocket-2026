import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Ocorreu um erro inesperado ao comunicar com o servidor.';
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail.map((d: { msg?: string }) => d.msg || JSON.stringify(d)).join('; ');
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

