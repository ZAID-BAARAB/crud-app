// Home.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ProductItem from "../components/ProductItem";

// Product type definition
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: 25.99,
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard",
      price: 89.99,
    },
    {
      id: 3,
      name: "USB-C Hub",
      description: "Multi-port USB-C hub for laptops",
      price: 45.0,
    },
    {
      id: 4,
      name: "Webcam",
      description: "1080p HD USB webcam",
      price: 55.0,
    },
    {
      id: 5,
      name: "Headphones",
      description: "Noise-cancelling headphones",
      price: 120.0,
    },
  ]);

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product List</h2>
          <Link
            to="/addProduct"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} onDelete={deleteProduct} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No products available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
