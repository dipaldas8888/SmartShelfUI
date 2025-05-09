import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      // This would typically be a /me endpoint
      // For now just decode the token or assume the user is authenticated
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/authenticate", {
        username,
        password,
      });
      const { token } = response.data;

      localStorage.setItem("token", token);
      setIsAuthenticated(true);

      // Optionally fetch user data here
      await fetchUserData();

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      return false;
    }
  };

  const register = async (username, password, role) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", {
        username,
        password,
        role,
      });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
