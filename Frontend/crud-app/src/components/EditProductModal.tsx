/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import type { Product } from "../services/productService";
import { ProductService } from "../services/productService";

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.price.toString());
  const [editStock, setEditStock] = useState(product.stockQuantity.toString());
  const [editDescription, setEditDescription] = useState(product.description || "");
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditName(product.name);
      setEditPrice(product.price.toString());
      setEditStock(product.stockQuantity.toString());
      setEditDescription(product.description || "");
      setEditPhoto(null);
      setError(null);
    }
  }, [isOpen, product]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setEditPhoto(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleClick = () => fileInputRef.current?.click();

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};
    if (!editName.trim()) errors.name = "Name cannot be empty";
    if (Number(editPrice) < 0) errors.price = "Price cannot be less than 0";
    if (Number(editStock) < 0) errors.stock = "Stock quantity cannot be less than 0";
    if (editPhoto && editPhoto.size > 1024 * 1024) errors.photo = "Image size should not exceed 1MB";
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "productRequest",
        new Blob([
          JSON.stringify({
            name: editName,
            price: Number(editPrice),
            description: editDescription,
            stockQuantity: Number(editStock),
          }),
        ], { type: "application/json" })
      );
      if (editPhoto) formData.append("productPhotoFile", editPhoto);
      await ProductService.updateProduct(product.id, formData);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center py-8 bg-black bg-opacity-50 overflow-auto my-1">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-700 text-5xl">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Product</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleModalSubmit} className="space-y-4">
          {/* Row 1: Name & Price */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700">Product Name</label>
              <input
                type="text"
                className="w-full bg-gray-200 text-gray-900 p-2 rounded"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              {inputErrors.name && (
                <p className="text-red-500 text-xs mt-1">{inputErrors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700">Price</label>
              <input
                type="number"
                className="w-full bg-gray-200 text-gray-900 p-2 rounded"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
                min={0}
              />
              {inputErrors.price && (
                <p className="text-red-500 text-xs mt-1">{inputErrors.price}</p>
              )}
            </div>
          </div>

          {/* Row 2: Stock Quantity */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700">Stock Quantity</label>
              <input
                type="number"
                className="w-full bg-gray-200 text-gray-900 p-2 rounded"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                required
                min={0}
              />
              {inputErrors.stock && (
                <p className="text-red-500 text-xs mt-1">{inputErrors.stock}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700">Description</label>
            <textarea
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Current & Change Image */}
          <div>
            <label className="block mb-1 text-gray-700">Current Image</label>
            <img src={product.photoUrl} alt="Current" className="w-full h-40 object-cover rounded mb-3" />

            <label className="block mb-1 text-gray-700">Change Image</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
              className="w-full p-6 border-2 border-dashed border-gray-400 rounded bg-gray-100 text-center cursor-pointer hover:border-blue-500 transition"
            >
              {editPhoto ? (
                <>
                  <p className="text-green-600">{editPhoto.name}</p>
                  <img src={URL.createObjectURL(editPhoto)} alt="Preview" className="mt-2 max-h-32 mx-auto rounded" />
                </>
              ) : (
                <p className="text-gray-500">Drag and drop a new image here, or click to select</p>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setEditPhoto(file);
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
              <p className="text-red-500 text-xs mt-1">{inputErrors.photo}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;




