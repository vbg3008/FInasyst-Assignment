import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accountAPI } from "../utils/api";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch current balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await accountAPI.getBalance();
        setCurrentBalance(response.data.balance);
        setError(null);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to load account balance. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleAmountChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await accountAPI.deposit(parseFloat(amount));

      setSuccess(`Successfully deposited $${parseFloat(amount).toFixed(2)}`);
      setCurrentBalance(response.data.account.balance);
      setAmount("");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Deposit error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process deposit. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">
          Loading account information...
        </span>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Deposit Funds
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 text-center">
          <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
          <div className="text-4xl font-bold text-primary mt-1">
            ${currentBalance.toFixed(2)}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-danger p-4 rounded-md border-l-4 border-danger mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-secondary p-4 rounded-md border-l-4 border-secondary mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deposit Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                disabled={submitting}
                className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium shadow-md border border-indigo-500"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Deposit Funds"
              )}
            </button>

            <button
              type="button"
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium shadow-md border border-gray-200"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Deposit;
