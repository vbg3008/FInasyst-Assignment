# BankBalance Frontend

A React application for managing bank accounts and transactions.

## Environment Variables

This application uses environment variables with dotenv for configuration. Create a `.env` file in the root of the frontend directory with the following variables:

```
# API URL for backend services
VITE_API_URL=http://localhost:5000/api

# Application name
VITE_APP_NAME=BankBalance

# Other environment variables
VITE_DEBUG=true
```

Different environments can be configured using:

- `.env` - Default environment variables
- `.env.development` - Development environment (used with `npm run dev`)
- `.env.production` - Production environment (used with `npm run build`)

### How Environment Variables Work in This Project

1. The dotenv package is used to load environment variables
2. In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code
3. All environment variables are centralized in `src/utils/env.js` for easier maintenance
4. Access environment variables through the env.js utility instead of directly using `import.meta.env`

Example usage:

```javascript
import { API_URL, APP_NAME, isDevelopment } from "./utils/env";

// Use environment variables in your code
console.log(
  `Running ${APP_NAME} in ${
    isDevelopment() ? "development" : "production"
  } mode`
);
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Technologies

- React 19
- Vite 6
- Tailwind CSS 4
- Axios for API requests
- React Router for navigation
- Dotenv for environment variables
