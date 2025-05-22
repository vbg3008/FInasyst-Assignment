import { useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

const Layout = ({ children }) => {
  const location = useLocation();
  const mainRef = useRef(null);
  const footerRef = useRef(null);

  // Apply page transition animation when route changes - simplified to avoid white screen
  useEffect(() => {
    if (mainRef.current) {
      // Set initial opacity to 1 to ensure content is visible
      gsap.set(mainRef.current, { opacity: 1 });

      // Simple fade-in animation that won't hide content
      gsap.fromTo(
        mainRef.current,
        { opacity: 0.8 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
        }
      );
    }
  }, [location.pathname]);

  // Apply footer animation on initial load - simplified
  useEffect(() => {
    if (footerRef.current) {
      // Set initial opacity to 1 to ensure footer is visible
      gsap.set(footerRef.current, { opacity: 1 });

      // Simple animation that won't hide the footer
      gsap.fromTo(
        footerRef.current,
        { y: 10, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main
        ref={mainRef}
        className="flex-grow container mx-auto px-4 py-8 max-w-7xl"
      >
        {children}
      </main>
      <footer
        ref={footerRef}
        className="bg-gradient-to-r text-center from-indigo-600 to-purple-600 text-white py-8 mt-auto"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
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
              </h3>
              <p className="text-indigo-100">Your secure banking solution</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-indigo-100">
                &copy; {new Date().getFullYear()} BankBalance. All rights
                reserved.
              </p>
              <div className="mt-2 flex space-x-4 justify-center md:justify-end">
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-indigo-100 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
