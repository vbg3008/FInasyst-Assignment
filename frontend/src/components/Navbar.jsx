import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint in Tailwind
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-white text-xl font-bold flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              BankBalance
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Transactions
                </Link>
                <span className="text-indigo-100 px-3 py-2 text-sm font-medium">
                  Hello, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium border border-indigo-300 transition-colors duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-200 cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-indigo-100 focus:outline-none p-2 rounded-md transition-colors duration-200 hover:bg-indigo-700 border border-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close main menu" : "Open main menu"}
              </span>
              {/* Toggle between hamburger and X icon */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        ref={menuRef}
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMenuOpen
            ? "opacity-100 max-h-[500px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-10 pb-3 space-y-1 sm:px-3 bg-indigo-700 shadow-inner relative">
          {/* Menu title */}
          <h2 className="text-white font-bold text-lg absolute top-2 left-2">
            Menu
          </h2>

          {/* Close button for mobile menu */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-2 right-2 text-white hover:text-white focus:outline-none p-2 rounded-md transition-all duration-200 hover:bg-red-700 cursor-pointer bg-red-600 shadow-md border-2 border-white hover:scale-110"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium transform transition-all duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "100ms" }}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className="text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium transform transition-all duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "200ms" }}
              >
                Transactions
              </Link>
              <div
                className="text-indigo-100 block px-3 py-2 rounded-md text-base font-medium transform transition-all duration-300 ease-in-out"
                style={{ animationDelay: "300ms" }}
              >
                Hello, {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium cursor-pointer transform transition-all duration-300 ease-in-out"
                style={{ animationDelay: "400ms" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium transform transition-all duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "100ms" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium my-2 shadow-md transform transition-all duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: "200ms" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
