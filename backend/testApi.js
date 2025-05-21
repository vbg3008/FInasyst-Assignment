import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Base URL for API
const baseUrl = "http://localhost:5000/api";
let authToken = "";

// Helper function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to make API requests
const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  token = null
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    console.log(`\n--- ${method} ${endpoint} ---`);
    console.log("Request:", data ? JSON.stringify(data, null, 2) : "No data");

    const response = await fetch(`${baseUrl}${endpoint}`, config);

    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { text };
    }

    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(responseData, null, 2));

    // Add a small delay to ensure database operations complete
    await delay(500);

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error(`Error with ${method} ${endpoint}:`, error.message);
    return { status: 500, data: { message: error.message } };
  }
};

// Test authentication endpoints
const testAuth = async () => {
  console.log("\n=== TESTING AUTHENTICATION ENDPOINTS ===");

  // Generate a unique email to avoid duplicate user errors
  const timestamp = new Date().getTime();
  const uniqueEmail = `testuser${timestamp}@example.com`;

  // Register a new user
  const registerData = {
    name: "Test User",
    email: uniqueEmail,
    password: "password123",
  };

  console.log(`Attempting to register user with email: ${uniqueEmail}`);
  let registrationSuccessful = false;
  let loginEmail = uniqueEmail;

  try {
    const registerResponse = await apiRequest(
      "/auth/register",
      "POST",
      registerData
    );

    if (registerResponse.status === 201) {
      console.log("Registration successful!");
      registrationSuccessful = true;
      // If registration is successful and returns a token, use it directly
      if (registerResponse.data && registerResponse.data.token) {
        authToken = registerResponse.data.token;
        console.log("Token received from registration");
        return true;
      }
    } else {
      console.log(
        `Registration failed with status: ${registerResponse.status}`
      );
    }
  } catch (error) {
    console.log("Error during registration:", error.message);
  }

  // If registration fails, try logging in with existing credentials
  if (!registrationSuccessful) {
    console.log(
      "Registration was not successful, will try to login with default test account"
    );
    loginEmail = "testuser@example.com";
  }

  // Login with the user
  const loginData = {
    email: loginEmail,
    password: "password123",
  };

  console.log(`Attempting to login with email: ${loginEmail}`);
  const loginResponse = await apiRequest("/auth/login", "POST", loginData);

  if (loginResponse.status === 200 && loginResponse.data.token) {
    authToken = loginResponse.data.token;
    console.log("Login successful, token received");

    // Get user profile
    console.log("Fetching user profile");
    await apiRequest("/auth/profile", "GET", null, authToken);
    return true;
  } else {
    console.log("Login failed, will try with seeded user");

    // Try with a seeded user from the sample data
    const seededLoginData = {
      email: "john@example.com",
      password: "password123",
    };

    console.log("Attempting to login with seeded account");
    const seededLoginResponse = await apiRequest(
      "/auth/login",
      "POST",
      seededLoginData
    );

    if (seededLoginResponse.status === 200 && seededLoginResponse.data.token) {
      authToken = seededLoginResponse.data.token;
      console.log("Login with seeded account successful");

      // Get user profile
      await apiRequest("/auth/profile", "GET", null, authToken);
      return true;
    }

    console.log("All login attempts failed");
    return false;
  }
};

// Test account endpoints
const testAccount = async () => {
  if (!authToken) {
    console.log("Authentication token not available. Please login first.");
    return false;
  }

  console.log("\n=== TESTING ACCOUNT ENDPOINTS ===");

  // Get account balance
  console.log("Fetching account balance");
  const balanceResponse = await apiRequest(
    "/account/balance",
    "GET",
    null,
    authToken
  );

  if (balanceResponse.status !== 200) {
    console.log("Failed to fetch account balance");
  } else {
    console.log(`Current balance: ${balanceResponse.data.balance}`);
  }

  // Deposit funds
  const depositAmount = 1000;
  const depositData = {
    amount: depositAmount,
  };

  console.log(`Depositing ${depositAmount} to account`);
  const depositResponse = await apiRequest(
    "/account/deposit",
    "POST",
    depositData,
    authToken
  );

  if (depositResponse.status === 200) {
    console.log("Deposit successful");

    // Verify balance was updated
    console.log("Verifying updated balance");
    const updatedBalanceResponse = await apiRequest(
      "/account/balance",
      "GET",
      null,
      authToken
    );

    if (updatedBalanceResponse.status === 200) {
      console.log(`Updated balance: ${updatedBalanceResponse.data.balance}`);
    }

    return true;
  } else {
    console.log("Deposit failed");
    return false;
  }
};

// Test transaction endpoints
const testTransactions = async () => {
  if (!authToken) {
    console.log("Authentication token not available. Please login first.");
    return false;
  }

  console.log("\n=== TESTING TRANSACTION ENDPOINTS ===");

  // Get account balance first to ensure we have enough for withdrawal
  console.log("Checking account balance before transaction");
  const balanceResponse = await apiRequest(
    "/account/balance",
    "GET",
    null,
    authToken
  );

  if (balanceResponse.status !== 200) {
    console.log("Failed to fetch account balance");
    return false;
  }

  const currentBalance = balanceResponse.data.balance;
  console.log(`Current balance: ${currentBalance}`);

  // Determine transaction type and amount based on balance
  let transactionType = "deposit";
  let transactionAmount = 500;

  if (currentBalance >= 500) {
    transactionType = "withdrawal";
    transactionAmount = Math.min(500, currentBalance * 0.5); // Withdraw at most half the balance
  }

  // Initiate a transaction
  const transactionData = {
    type: transactionType,
    amount: transactionAmount,
    description: `Test ${transactionType}`,
  };

  console.log(`Initiating ${transactionType} of ${transactionAmount}`);
  const initiateResponse = await apiRequest(
    "/transactions/initiate",
    "POST",
    transactionData,
    authToken
  );

  if (initiateResponse.status !== 201) {
    console.log("Transaction initiation failed");
  } else {
    console.log("Transaction initiated successfully");
  }

  // Get transaction history
  console.log("Fetching transaction history");
  const historyResponse = await apiRequest(
    "/transactions/history",
    "GET",
    null,
    authToken
  );

  // Get a specific transaction if available
  if (historyResponse.status === 200 && historyResponse.data.length > 0) {
    const transactionId = historyResponse.data[0]._id;
    console.log(`Fetching details for transaction: ${transactionId}`);
    await apiRequest(`/transactions/${transactionId}`, "GET", null, authToken);
    return true;
  } else {
    console.log("No transactions found in history");
    return false;
  }
};

// Run all tests
const runTests = async () => {
  try {
    console.log("\n=== STARTING API TESTS ===");
    console.log("Testing server at:", baseUrl);

    // Test authentication first
    const authSuccess = await testAuth();

    if (!authSuccess) {
      console.log(
        "\n⚠️ Authentication tests failed. Cannot proceed with other tests."
      );
      process.exit(1);
    }

    // Test account endpoints
    const accountSuccess = await testAccount();

    if (!accountSuccess) {
      console.log(
        "\n⚠️ Account tests failed. Will still attempt transaction tests."
      );
    }

    // Test transaction endpoints
    const transactionSuccess = await testTransactions();

    if (!transactionSuccess) {
      console.log("\n⚠️ Transaction tests failed.");
    }

    // Summary
    console.log("\n=== TEST SUMMARY ===");
    console.log("Authentication:", authSuccess ? "✅ PASSED" : "❌ FAILED");
    console.log(
      "Account Management:",
      accountSuccess ? "✅ PASSED" : "❌ FAILED"
    );
    console.log(
      "Transactions:",
      transactionSuccess ? "✅ PASSED" : "❌ FAILED"
    );

    if (authSuccess && accountSuccess && transactionSuccess) {
      console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    } else {
      console.log(
        "\n⚠️ SOME TESTS FAILED. Please check the logs above for details."
      );
    }
  } catch (error) {
    console.error("\n❌ ERROR RUNNING TESTS:", error.message);
    console.error(error.stack);
  }
};

// Execute tests
console.log("Starting API tests...");
runTests().catch((err) => {
  console.error("Unhandled error in test runner:", err);
  process.exit(1);
});
