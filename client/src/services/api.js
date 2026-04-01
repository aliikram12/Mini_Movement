import axios from 'axios';

const API = axios.create({ baseURL: '/api', withCredentials: true });

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try { const { state } = JSON.parse(stored); if (state?.token) config.headers.Authorization = `Bearer ${state.token}`; } catch {}
  }
  return config;
});

API.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.state.token = data.accessToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(original);
      } catch { localStorage.removeItem('auth-storage'); }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (d) => API.post('/auth/register', d);
export const loginUser = (d) => API.post('/auth/login', d);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (d) => API.put('/auth/profile', d);
export const getUsers = () => API.get('/auth/users');

// Products
export const getProducts = (p) => API.get('/products', { params: p });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (d) => API.post('/products', d);
export const updateProduct = (id, d) => API.put(`/products/${id}`, d);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const createOrder = (d) => API.post('/orders', d);
export const getMyOrders = () => API.get('/orders/my');
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, d) => API.put(`/orders/${id}`, d);
export const getOrderStats = () => API.get('/orders/stats');

// Custom Orders
export const createCustomOrder = (d) => API.post('/custom-orders', d, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyCustomOrders = () => API.get('/custom-orders/my');
export const getAllCustomOrders = () => API.get('/custom-orders');
export const updateCustomOrderStatus = (id, d) => API.put(`/custom-orders/${id}`, d);
export const getCustomOrderStats = () => API.get('/custom-orders/stats');

// Payments
export const createCheckoutSession = (d) => API.post('/payments/create-checkout-session', d);
export const createPaymentIntent = (d) => API.post('/payments/create-payment-intent', d);

export default API;
