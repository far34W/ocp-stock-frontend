import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/login', data);
export const logout = () => API.post('/logout');
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const updatePassword = (data) => API.put('/profile/password', data);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');
export const getTransferChart = () => API.get('/dashboard/transfers-chart');
export const getCategoryDistribution = () => API.get('/dashboard/categories');
export const getRecentArticles = () => API.get('/dashboard/recent-articles');
export const getRecentMovements = () => API.get('/dashboard/recent-movements');
export const getTopTransferred = () => API.get('/dashboard/top-transferred');
export const getStockAlerts = () => API.get('/dashboard/alerts');

// Articles
export const getArticles = (params) => API.get('/articles', { params });
export const getArticle = (id) => API.get(`/articles/${id}`);
export const createArticle = (data) => API.post('/articles', data);
export const updateArticle = (id, data) => API.put(`/articles/${id}`, data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);
export const restoreArticle = (id) => API.put(`/articles/${id}/restore`);
export const forceDeleteArticle = (id) => API.delete(`/articles/${id}/force`);
export const getTrashedArticles = () => API.get('/articles/trashed');
export const scanArticle = (code) => API.get(`/articles/scan/${code}`);

// Transfers
export const transferArticle = (id, data) => API.post(`/articles/${id}/transfer`, data);
export const getTransfers = (params) => API.get('/transfers', { params });
export const getTransfer = (id) => API.get(`/transfers/${id}`);
export const deleteTransfer = (id) => axios.delete(`/transfers/${id}`);

// Categories
export const getCategories = () => API.get('/categories');
export const getCategory = (id) => API.get(`/categories/${id}`);
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Users
export const getUsers = () => API.get('/users');
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;
