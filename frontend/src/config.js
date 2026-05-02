// Central API configuration
// In development: http://localhost:5000/api
// In production: set VITE_API_URL environment variable

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_BASE;
