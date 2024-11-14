// rest-client-api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Hàm đăng ký người dùng
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Hàm đăng nhập người dùng
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/authentication`, loginData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Hàm xác thực email
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/register/verify-email`, { params: { token } });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
