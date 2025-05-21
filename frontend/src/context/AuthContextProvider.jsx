import { useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import { AuthContext } from "./AuthContext";

/**
 * Authentication Provider Component
 *
 * Provides authentication state and methods to the application
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setLoading(true);
          const response = await authAPI.getProfile();
          setUser(response.data);
          setError(null);
        } catch (err) {
          console.error("Failed to load user:", err);
          setError("Session expired. Please login again.");
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (registrationData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(registrationData);
      const { token: newToken, ...userInfo } = response.data;

      // Save token to localStorage and state
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userInfo);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { token: newToken, ...userInfo } = response.data;

      // Save token to localStorage and state
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userInfo);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
