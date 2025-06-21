import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductService } from "../services/productService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<string>("");
  
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productRequest", new Blob([JSON.stringify({
        name,
        price: Number(price),
        description,
        stockQuantity: Number(stockQuantity)
      })], { type: "application/json" }));

      if (photoFile) {
        formData.append("productPhotoFile", photoFile);
      }

      await ProductService.createProduct(formData);
      setSuccess(true);
      navigate("/"); // Or redirect to product list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to add product");
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
      <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

          {error && <p className="text-red-400 mb-4">{error}</p>}
          {success && <p className="text-green-400 mb-4">Product added successfully!</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                className="w-full bg-gray-700 text-white p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                className="w-full bg-gray-700 text-white p-2 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Stock Quantity</label>
              <input
                type="number"
                className="w-full bg-gray-700 text-white p-2 rounded"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                className="w-full bg-gray-700 text-white p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="block mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-gray-700 text-white p-2 rounded"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Publishing..." : "Publish Product"}
            </button>
          </form>
        </div>
      </div>
      <div >
        <Footer/>
      </div>
    </motion.div>
  );
};

export default AddProduct;
