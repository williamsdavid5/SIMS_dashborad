import axios from 'axios';

const api = axios.create({
    // O Vite usa import.meta.env em vez de process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
});

export default api;