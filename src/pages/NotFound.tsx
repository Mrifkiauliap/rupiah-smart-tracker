import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-4">
          Oops! Page not found. Try checking the URL or going back to the
          homepage.
        </p>
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 underline font-semibold"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

