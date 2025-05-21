import { createContext } from "react";

/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application
 * @type {React.Context}
 */
const AuthContext = createContext(null);

export { AuthContext };
