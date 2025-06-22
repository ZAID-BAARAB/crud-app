/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      if (file.size > 1024 * 1024) {
        setInputErrors(prev => ({ ...prev, photo: "Image size should not exceed 1MB" }));
      } else {
        setInputErrors(prev => {
          const rest = { ...prev };
          delete rest.photo;
          return rest;
        });
      }
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleClick = () => fileInputRef.current?.click();

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = "Name cannot be empty";
    if (Number(price) < 0) errors.price = "Price cannot be less than 0";
    if (Number(stockQuantity) < 0) errors.stock = "Stock quantity cannot be less than 0";
    if (photoFile && photoFile.size > 1024 * 1024) errors.photo = "Image size should not exceed 1MB";
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;
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
              {inputErrors.name && (
                <p className="text-red-400 text-xs mt-1">{inputErrors.name}</p>
              )}
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
              {inputErrors.price && (
                <p className="text-red-400 text-xs mt-1">{inputErrors.price}</p>
              )}
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
              {inputErrors.stock && (
                <p className="text-red-400 text-xs mt-1">{inputErrors.stock}</p>
              )}
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
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
                className="w-full p-6 border-2 border-dashed border-gray-400 rounded bg-gray-700 text-center cursor-pointer hover:border-blue-500 transition"
              >
                {photoFile ? (
                  <>
                    <p className="text-green-400">{photoFile.name}</p>
                    <img src={URL.createObjectURL(photoFile)} alt="Preview" className="mt-2 max-h-32 mx-auto rounded" />
                  </>
                ) : (
                  <p className="text-gray-400">Drag and drop a new image here, or click to select</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setPhotoFile(file);
                    if (file && file.size > 1024 * 1024) {
                      setInputErrors(prev => ({ ...prev, photo: "Image size should not exceed 1MB" }));
                    } else {
                      setInputErrors(prev => {
                        const rest = { ...prev };
                        delete rest.photo;
                        return rest;
                      });
                    }
                  }}
                />
              </div>
              {inputErrors.photo && (
                <p className="text-red-400 text-xs mt-1">{inputErrors.photo}</p>
              )}
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
