import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { transactionAPI } from "../utils/api";

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch transaction details
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await transactionAPI.getById(id);
        setTransaction(response.data);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">
          Loading transaction details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-50 text-danger p-4 rounded-md border-l-4 border-danger mb-6">
          {error}
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors cursor-pointer"
          onClick={() => navigate("/transactions")}
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-xl font-semibold text-gray-800 mb-4">
          Transaction not found
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors cursor-pointer"
          onClick={() => navigate("/transactions")}
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  // Determine color based on transaction type
  const getTypeColor = (type) => {
    switch (type) {
      case "deposit":
        return "text-green-600 bg-green-50 border-green-200";
      case "withdrawal":
        return "text-red-600 bg-red-50 border-red-200";
      case "transfer":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Determine color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Transaction Details
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with type and status */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-b border-gray-200">
          <div
            className={`px-4 py-2 rounded-full font-medium capitalize ${getTypeColor(
              transaction.type
            )}`}
          >
            {transaction.type}
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                transaction.status
              )}`}
            >
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Amount section */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Amount</h2>
          <div
            className={`text-4xl font-bold ${
              transaction.type === "deposit"
                ? "text-green-600"
                : transaction.type === "withdrawal"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            ${transaction.amount.toFixed(2)}
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Transaction ID
            </div>
            <div className="font-mono text-gray-800 break-all">
              {transaction.transactionId || transaction._id}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Reference
            </div>
            <div className="font-mono text-gray-800">
              {transaction.reference}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Date</div>
            <div className="text-gray-800">
              {new Date(transaction.createdAt).toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Description
            </div>
            <div className="text-gray-800">
              {transaction.description || `${transaction.type} transaction`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <Link
            to="/transactions"
            className="inline-flex items-center text-primary hover:text-primary-dark cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
