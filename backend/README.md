# BankBalance API

A RESTful API for a banking application with user authentication, account management, and transaction processing.

## Features

- User authentication (register, login)
- Account management (balance checking, deposits)
- Transaction processing (deposits, withdrawals, transfers)
- ACID-compliant financial transactions

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
  - Request: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - Response: User data with JWT token and new account details

- **POST /api/auth/login** - Authenticate and log in a user
  - Request: `{ "email": "john@example.com", "password": "password123" }`
  - Response: User data with JWT token and account details

- **GET /api/auth/profile** - Fetch user profile (requires authentication)
  - Response: User profile data with account details

### Account Management

- **GET /api/account/balance** - Fetch the user's account balance
  - Response: Account details including balance

- **POST /api/account/deposit** - Add funds to the account
  - Request: `{ "amount": 1000 }`
  - Response: Updated account details and transaction record

### Transaction Management

- **POST /api/transactions/initiate** - Initiate a new transaction
  - Request: `{ "type": "deposit|withdrawal|transfer", "amount": 500, "description": "Optional description" }`
  - Response: Transaction details and updated account balance

- **GET /api/transactions/history** - Fetch transaction history
  - Response: List of user's transactions

- **GET /api/transactions/:id** - Get details of a specific transaction
  - Response: Detailed transaction information

## ACID Properties Implementation

This API implements ACID (Atomicity, Consistency, Isolation, Durability) properties for all financial transactions to ensure data integrity and reliability:

### Atomicity
- MongoDB transactions are used to ensure that all operations within a transaction either complete successfully or fail entirely
- If any part of a transaction fails, all changes are rolled back using `session.abortTransaction()`
- Example: When depositing funds, both the account balance update and transaction record creation must succeed together

### Consistency
- Validation checks ensure that account balances never go negative
- Business rules are enforced (e.g., sufficient funds for withdrawals)
- Data types and constraints are validated before processing

### Isolation
- MongoDB sessions are used to isolate concurrent transactions
- Each transaction operates on its own snapshot of the data
- Changes made by one transaction are not visible to other transactions until committed

### Durability
- Transactions are committed to the database using `session.commitTransaction()`
- Once committed, data changes persist even in the event of system failures
- MongoDB's journaling ensures that committed transactions are durable

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Run the server: `npm start` or `npm run dev` for development

## Sample Data

You can populate the database with sample data using:

```
npm run data:import
```

To remove all data:

```
npm run data:destroy
```

## Testing the API

Run the automated API tests:

```
npm run test:api
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- MongoDB transactions for ACID compliance
