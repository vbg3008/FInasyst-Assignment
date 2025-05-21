import axios from "axios";
import { API_URL, isDevelopment } from "./env";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log requests in development mode
if (isDevelopment()) {
  api.interceptors.request.use((request) => {
    console.log(
      "Starting API Request:",
      request.method?.toUpperCase(),
      request.url
    );
    return request;
  });
}

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

// Account API calls
export const accountAPI = {
  getBalance: () => api.get("/account/balance"),
  deposit: (amount) => api.post("/account/deposit", { amount }),
};

// Transaction API calls
export const transactionAPI = {
  initiate: (transactionData) =>
    api.post("/transactions/initiate", transactionData),
  getHistory: () => api.get("/transactions/history"),
  getById: (id) => api.get(`/transactions/${id}`),
};

export default api;
