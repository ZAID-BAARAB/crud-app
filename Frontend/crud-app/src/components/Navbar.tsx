import React, { useState } from "react";
import { Link } from "react-router-dom";
import hahnLogo from "../assets/images/hahnLogo.png";
import { logout } from "../services/authService";
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY, REFRESH_TOKEN_KEY } from "../constants/storageKeys";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Get isAuthenticated from localStorage
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY) && !!localStorage.getItem(REFRESH_TOKEN_KEY);
  // Get currentUser from localStorage
  const currentUser = localStorage.getItem(CURRENT_USER_KEY) ? JSON.parse(localStorage.getItem(CURRENT_USER_KEY)!) : null;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src={hahnLogo}
              className="h-8"
              alt="Hahn Software Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Hahn Software
            </span>
          </Link>
          {currentUser && (
            <span className="ml-4 text-green-300 font-semibold text-lg drop-shadow-sm dark:text-green-200">
              Welcome {currentUser.firstname}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-language"
          aria-expanded={isOpen}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`$${isOpen ? "flex" : "hidden"} items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-language"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700"
              >
                About
              </Link>
            </li>
            {!isAuthenticated ? (
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={logout}
                  className="mr-5 block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


