import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import skyPayLogo from "../assets/images/skypayme_logo.jpg";
import { authenticateUser } from '../services/authService';
import Footer from '../components/Footer';


const Login: React.FC = () => {

   const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
     const { accessToken, refreshToken } = await authenticateUser(email, password);
     console.log('Access Token:', accessToken);
      console.log('Access Token:', refreshToken);

      // on success, redirect
      navigate('/');
    } catch (err: unknown) {
      // display error message
      if (typeof err === 'object' && err !== null) {
        // Try to extract error message from known error shapes
        const errorMessage =
          // axios error shape
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.message ||
          // generic error shape
          (err as { message?: string }).message ||
          'Login failed';
        setError(errorMessage);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      {error && (
        <div className="mb-4 w-full max-w-6xl mx-auto bg-red-500 text-white text-center py-2 px-4 rounded shadow-lg animate-pulse">
          {error}
        </div>
      )}
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1E293B] p-8 rounded-lg shadow-lg">
          {/* Form Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 mb-6">
              Start your website in seconds. Don’t have an account?{' '}
              <Link
                to="/signUp"
                className="text-blue-400 hover:underline"
              > Sign up.
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <label className="inline-flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md transition
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'}
                  text-white`}
              >
                {loading ? 'Signing in…' : 'Sign in to your account'}
              </button>
            </form>
            <div className="my-6 flex items-center justify-center text-gray-400">
              <span className="border-t border-gray-600 w-1/5"></span>
              <span className="px-3 text-sm">or</span>
              <span className="border-t border-gray-600 w-1/5"></span>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center border border-gray-600 py-2 rounded-md hover:bg-gray-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
          {/* Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <img
              src={skyPayLogo}
              alt="Illustration"
              className="w-3/4"
            />
          </div>
        </div>
      </div>
          <div >
          <Footer/>
        </div>
    </motion.div>
  );
};

export default Login;
