// src/api/axiosInstance.js
import axios from 'axios';

// Create an Axios instance with base URL and config
const axiosInstance = axios.create({
    baseURL: 'http://localhost:1234/api/v1', // Replace with your backend URL
    timeout: 5000, // Optional: request timeout (ms)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Interceptors for requests and responses
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: Add token if using authentication
        // config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
