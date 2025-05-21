import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center px-4 py-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl max-w-5xl mx-auto mb-20 relative overflow-hidden">
        {/* Background pattern */}
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 relative">
          Welcome to BankBalance
        </h1>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
          Your secure banking solution for managing finances with ease.
        </p>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block bg-white text-indigo-600 font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="inline-block bg-white text-indigo-600 font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block bg-purple-500 text-white font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Banking</h3>
            <p className="text-gray-600">
              State-of-the-art security measures to protect your financial data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Transactions</h3>
            <p className="text-gray-600">
              Deposit and withdraw funds with just a few clicks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
            <p className="text-gray-600">
              Keep track of all your financial activities in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
