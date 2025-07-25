import { } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from "./pages/Home";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddProduct from './pages/AddProduct';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import './icons/fontawesome';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/addProduct" element={<AddProduct />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App
