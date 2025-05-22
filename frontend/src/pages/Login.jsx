import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Refs for animations
  const formContainerRef = useRef(null);
  const formTitleRef = useRef(null);
  const formFieldsRef = useRef(null);
  const formErrorRef = useRef(null);
  const submitButtonRef = useRef(null);
  const registerSectionRef = useRef(null);

  // Animation on component mount - simplified to ensure content is visible
  useEffect(() => {
    // Make sure all elements are visible first
    gsap.set(
      [
        formContainerRef.current,
        formTitleRef.current,
        formFieldsRef.current,
        submitButtonRef.current,
        registerSectionRef.current,
      ],
      { opacity: 1 }
    );

    // Container animation - subtle fade in
    gsap.fromTo(
      formContainerRef.current,
      { opacity: 0.95 },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
      }
    );

    // Title animation - subtle movement
    gsap.fromTo(
      formTitleRef.current,
      { opacity: 0.95, y: -5 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.1,
        ease: "power1.out",
      }
    );

    // Form fields animation - subtle fade in
    if (formFieldsRef.current) {
      gsap.fromTo(
        formFieldsRef.current.children,
        { opacity: 0.95 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.2,
          ease: "power1.out",
        }
      );
    }

    // Button animation - subtle scale
    gsap.fromTo(
      submitButtonRef.current,
      { opacity: 0.95, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.3,
        ease: "power1.out",
      }
    );

    // Register section animation - subtle fade in
    gsap.fromTo(
      registerSectionRef.current,
      { opacity: 0.95 },
      {
        opacity: 1,
        duration: 0.3,
        delay: 0.4,
        ease: "power1.out",
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");

      // Animate error message - simplified to be more subtle
      if (formErrorRef.current) {
        // Make sure error message is visible
        gsap.set(formErrorRef.current, { opacity: 1 });

        // Subtle shake animation
        const tl = gsap.timeline();
        tl.to(formErrorRef.current, {
          x: -3,
          duration: 0.05,
          ease: "power1.out",
        })
          .to(formErrorRef.current, {
            x: 3,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: -2,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: 2,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: 0,
            duration: 0.05,
            ease: "power1.out",
          });
      }

      // Shake the form fields that are empty - more subtle animation
      const emptyFields = [];
      if (!formData.email) emptyFields.push(document.getElementById("email"));
      if (!formData.password)
        emptyFields.push(document.getElementById("password"));

      // Make sure fields are visible
      gsap.set(emptyFields, { opacity: 1 });

      // Subtle shake animation
      gsap.to(emptyFields, {
        x: [-3, 3, -2, 2, 0],
        duration: 0.3,
        ease: "power1.inOut",
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      // Animate button while submitting - simplified to be more subtle
      // Make sure button is visible
      gsap.set(submitButtonRef.current, { opacity: 1 });

      // Subtle button animation
      gsap.to(submitButtonRef.current, {
        scale: 0.98,
        duration: 0.1,
        ease: "power1.out",
      });

      const result = await login(formData);

      if (result.success) {
        // Success animation - simplified to be more subtle
        // Make sure form container is visible
        gsap.set(formContainerRef.current, { opacity: 1 });

        // Subtle success animation
        gsap.to(formContainerRef.current, {
          scale: 1.01,
          boxShadow: "0 15px 30px -8px rgba(79, 70, 229, 0.3)",
          duration: 0.3,
          ease: "power1.out",
          onComplete: () => {
            // Navigate after animation completes
            navigate("/dashboard");
          },
        });
      } else {
        setFormError(result.error || "Login failed");

        // Animate error message - simplified to be more subtle
        if (formErrorRef.current) {
          // Make sure error message is visible
          gsap.set(formErrorRef.current, { opacity: 1 });

          // Subtle shake animation
          const tl = gsap.timeline();
          tl.to(formErrorRef.current, {
            x: -3,
            duration: 0.05,
            ease: "power1.out",
          })
            .to(formErrorRef.current, {
              x: 3,
              duration: 0.05,
              ease: "power1.out",
            })
            .to(formErrorRef.current, {
              x: -2,
              duration: 0.05,
              ease: "power1.out",
            })
            .to(formErrorRef.current, {
              x: 2,
              duration: 0.05,
              ease: "power1.out",
            })
            .to(formErrorRef.current, {
              x: 0,
              duration: 0.05,
              ease: "power1.out",
            });
        }
      }
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);

      // Animate error message - simplified to be more subtle
      if (formErrorRef.current) {
        // Make sure error message is visible
        gsap.set(formErrorRef.current, { opacity: 1 });

        // Subtle shake animation
        const tl = gsap.timeline();
        tl.to(formErrorRef.current, {
          x: -3,
          duration: 0.05,
          ease: "power1.out",
        })
          .to(formErrorRef.current, {
            x: 3,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: -2,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: 2,
            duration: 0.05,
            ease: "power1.out",
          })
          .to(formErrorRef.current, {
            x: 0,
            duration: 0.05,
            ease: "power1.out",
          });
      }
    } finally {
      setIsSubmitting(false);

      // Reset button animation if not navigating away - simplified
      if (submitButtonRef.current) {
        // Make sure button is visible
        gsap.set(submitButtonRef.current, { opacity: 1 });

        // Subtle reset animation
        gsap.to(submitButtonRef.current, {
          scale: 1,
          duration: 0.1,
          ease: "power1.out",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div
        ref={formContainerRef}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-indigo-100"
      >
        <h2
          ref={formTitleRef}
          className="text-3xl font-bold text-center text-indigo-600 mb-8"
        >
          Login to Your Account
        </h2>

        {formError && (
          <div
            ref={formErrorRef}
            className="bg-red-50 text-danger p-4 rounded-md border-l-4 border-danger mb-6"
          >
            {formError}
          </div>
        )}

        <form ref={formFieldsRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            ref={submitButtonRef}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div ref={registerSectionRef} className="mt-8 text-center">
          <p className="text-gray-600 mb-3">Don't have an account?</p>
          <Link
            to="/register"
            className="inline-block bg-purple-500 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
