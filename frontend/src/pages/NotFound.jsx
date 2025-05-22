import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const NotFound = () => {
  const numberRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Make sure all elements are visible first
    gsap.set([numberRef.current, textRef.current, buttonRef.current], {
      opacity: 1,
    });

    // Animate the 404 number with a subtle effect
    gsap.fromTo(
      numberRef.current,
      { opacity: 0.9, scale: 0.95 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power1.out",
      }
    );

    // Animate the text content with subtle movement
    gsap.fromTo(
      textRef.current.children,
      { opacity: 0.9, y: 5 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.2,
        ease: "power1.out",
      }
    );

    // Animate the button with subtle fade in
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0.9, scale: 0.98 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay: 0.4,
        ease: "power1.out",
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 ref={numberRef} className="text-9xl font-bold text-primary">
          404
        </h1>
        <div ref={textRef}>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          ref={buttonRef}
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
