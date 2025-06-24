/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Product } from "../services/productService";
import { ProductService } from "../services/productService";
import EditProductModal from "./EditProductModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import imgPlaceholder from "../assets/images/imgPlaceholder.jpg"; // Placeholder image

interface Props {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductItem: React.FC<Props> = ({ product, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const confirmDelete = async () => {
    try {
      await ProductService.deleteProduct(product.id);
      onDelete(product.id);
      setShowDeleteConfirm(false);
    } catch (error: any) {
      alert(error.message || "Failed to delete product");
    }
  };

  const handleEdit = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const handleEditSuccess = () => {
    setShowModal(false);
    window.location.reload();
  };

  // Truncate description to 40 chars
  const shortDesc = product.description
    ? product.description.length > 40
      ? product.description.slice(0, 40) + "..."
      : product.description
    : "";

  // Determine stock status
  const inStock = product.stockQuantity > 0;
  const stockBadge = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full
        ${inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      title={inStock ? "In Stock" : "Out of Stock"} // Tooltip for accessibility
    >
      <FontAwesomeIcon icon={inStock ? faCircleCheck : faCircleXmark} />
      {inStock ? "In Stock" : "Out of Stock"} ({product.stockQuantity})
    </span>
  );

  return (
    <>
      <div className="bg-white shadow-[0_12px_48px_0_rgba(255,98,0,0.8)] border-2 border-gray-300 rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:bg-gray-100 hover:-translate-y-2">
        <img
          src={product.photoUrl || imgPlaceholder}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <div className="mb-2 space-y-1">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <div>{stockBadge}</div>
        </div>

        {/*  Description */}
        <p className="text-gray-500 mb-2">{shortDesc}</p>

        <p className="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm mb-2">
          ${product.price.toFixed(2)}
        </p>

        {/*  Action Buttons */}
        <div className="flex space-x-2 mt-auto border-t pt-4">
          <button
            onClick={handleEdit}
            className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <EditProductModal
        product={product}
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleEditSuccess}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{product.name}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductItem;




