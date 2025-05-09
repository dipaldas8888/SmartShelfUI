import { Link } from "react-router-dom";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-center text-6xl font-extrabold text-gray-900">
            404
          </h1>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
