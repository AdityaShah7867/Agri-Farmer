import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-3xl font-semibold text-gray-600">Page not found</p>
        <p className="mt-4 text-lg text-gray-500">Oops! The page you are looking for doesn't exist.</p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
