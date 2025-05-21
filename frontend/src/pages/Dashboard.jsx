import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { accountAPI, transactionAPI } from "../utils/api";

const Dashboard = () => {
  // We don't need user data for this component
  useAuth(); // Keep the hook to ensure authentication
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch account balance and recent transactions
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch account balance
        const accountResponse = await accountAPI.getBalance();
        setAccount(accountResponse.data);

        // Fetch recent transactions
        const transactionsResponse = await transactionAPI.getHistory();
        // Get only the 5 most recent transactions
        setTransactions(transactionsResponse.data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-danger p-4 rounded-md border-l-4 border-danger max-w-3xl mx-auto my-8">
        {error}
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Account Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Overview
          </h2>
          {account ? (
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">
                  Current Balance
                </h3>
                <div className="text-4xl font-bold text-primary mt-1">
                  ${account.balance.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Account Number:</span>{" "}
                  <span className="font-mono">{account.accountNumber}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Account Type:</span>{" "}
                  <span className="capitalize">{account.accountType}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/deposit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-center cursor-pointer font-medium shadow-md border border-indigo-500"
                >
                  Deposit Funds
                </Link>
                <Link
                  to="/withdraw"
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center cursor-pointer font-medium shadow-md border border-gray-200"
                >
                  Withdraw Funds
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No account information available.</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          {transactions.length > 0 ? (
            <div>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center border-b border-gray-100 pb-3"
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center mr-3
                      ${
                        transaction.type === "deposit"
                          ? "bg-green-100 text-green-600"
                          : transaction.type === "withdrawal"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                    >
                      {transaction.type === "deposit" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : transaction.type === "withdrawal" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                          <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">
                          {transaction.type}
                        </span>
                        <span
                          className={`font-semibold ${
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : transaction.type === "withdrawal"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {transaction.type === "deposit"
                            ? "+"
                            : transaction.type === "withdrawal"
                            ? "-"
                            : ""}
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          {transaction.description ||
                            `${transaction.type} transaction`}
                        </span>
                        <span>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/transactions"
                className="block text-center text-primary hover:text-primary-dark font-medium mt-4 cursor-pointer"
              >
                View All Transactions
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">No recent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
