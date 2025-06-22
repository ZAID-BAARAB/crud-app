/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from "framer-motion";
import skyPayLogo from "../assets/images/skypayme_logo.jpg";
import Footer from '../components/Footer';
import { registerUser } from '../services/authService';


const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.password.trim()) newErrors.password = 'Password is required.';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await registerUser(
          form.firstName,
          form.lastName,
          form.email,
          form.password,
          'USER'
        );
        // Optionally, show a success message or redirect
      } catch (err: any) {
        setErrors({ ...errors, submit: err.message || 'Registration failed' });
      }
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
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1E293B] p-8 rounded-lg shadow-lg">
          {/* Form Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-400 mb-6">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:underline">Sign in.</a>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block mb-1 text-sm">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-1 text-sm">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Create account
              </button>
            </form>

            {errors.submit && <p className="text-red-400 text-sm mt-4 text-center">{errors.submit}</p>}

            <div className="my-6 flex items-center justify-center text-gray-400">
              <span className="border-t border-gray-600 w-1/5"></span>
              <span className="px-3 text-sm">or</span>
              <span className="border-t border-gray-600 w-1/5"></span>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center border border-gray-600 py-2 rounded-md hover:bg-gray-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign up with Google
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

export default SignUp;
