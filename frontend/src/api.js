import axios from 'axios';

// This establishes the connection to your Python Flask server
const API = axios.create({
    baseURL: 'http://127.0.0.1:5000', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// This sends your login token automatically with every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;