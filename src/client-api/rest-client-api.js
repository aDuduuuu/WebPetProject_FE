// rest-client-api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Hàm đăng ký người dùng
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { EC: 500, EM: "Server error" };
  }
};

// Hàm đăng nhập người dùng
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/authentication`, loginData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { EC: 500, EM: "Server error" };
  }
};

// Hàm xác thực email
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify-email`, { params: { token } });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { EC: 500, EM: "Server error" };
  }
};

// Hàm lấy thông tin người dùng
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { EC: 500, EM: "Server error" };
  }
};

// Get paginated list of dog breeds with filters
export const getDogBreeds = async (page = 1, limit = 20, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/dogbreeds`, {
      params: { page, limit, ...filters },  // Merge filters with pagination params
    });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { EC: 500, EM: "Server error" };
  }
};

export const getDogBreedByName = async (breedName) => {
  try {
    const response = await axios.get(`${API_URL}/dogbreeds?name=${breedName}`);
    console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { EC: 500, EM: "Error fetching breed details" };
  }
};

// client-api/rest-client-api.js
export const getDogBreedById = async (breedId) => {
  try {
    const response = await axios.get(`${API_URL}/dogbreeds/${breedId}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { EC: 500, EM: "Error fetching breed details" };
  }
};