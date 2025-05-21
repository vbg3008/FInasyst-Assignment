/**
 * Environment variables utility
 *
 * This file centralizes access to environment variables used in the application.
 * All environment variables should be accessed through this file to ensure
 * consistent fallback values and easier maintenance.
 */

// In Vite, environment variables are exposed on the special import.meta.env object
// and need to be prefixed with VITE_
// See: https://vitejs.dev/guide/env-and-mode.html

// API URL for backend services
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Application name
export const APP_NAME = import.meta.env.VITE_APP_NAME || "BankBalance";

// Debug mode
export const DEBUG = import.meta.env.VITE_DEBUG === "true";

// Environment mode
export const NODE_ENV = import.meta.env.MODE || "development";

// Helper function to check if we're in production
export const isProduction = () => NODE_ENV === "production";

// Helper function to check if we're in development
export const isDevelopment = () =>
  NODE_ENV === "development" || NODE_ENV === "dev";

// Log environment variables in development mode (but not sensitive ones)
if (isDevelopment() || DEBUG) {
  console.log("Environment Variables:");
  console.log("- Environment:", NODE_ENV);
  console.log("- API URL:", API_URL);
  console.log("- App Name:", APP_NAME);
  console.log("- Debug Mode:", DEBUG);
}
