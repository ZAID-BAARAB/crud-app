/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

  React.useEffect(() => {
    if (isOpen) {
      setEditName(product.name);
      setEditPrice(product.price.toString());
      setEditStock(product.stockQuantity.toString());
      setEditDescription(product.description || "");
      setEditPhoto(null);
      setError(null);
    }
  }, [isOpen, product]);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("productRequest", new Blob([
        JSON.stringify({
          name: editName,
          price: Number(editPrice),
          description: editDescription,
          stockQuantity: Number(editStock),
        })
      ], { type: "application/json" }));
      if (editPhoto) {
        formData.append("productPhotoFile", editPhoto);
      }
      await ProductService.updateProduct(product.id, formData);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Product</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Product Name</label>
            <input
              type="text"
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Price</label>
            <input
              type="number"
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Stock Quantity</label>
            <input
              type="number"
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              value={editStock}
              onChange={e => setEditStock(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Description</label>
            <textarea
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-gray-200 text-gray-900 p-2 rounded"
              onChange={e => setEditPhoto(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
