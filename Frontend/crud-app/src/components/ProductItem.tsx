// ProductItem.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../pages/Home";
import cammeraImg from "../assets/images/camerra.jpg";

interface Props {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductItem: React.FC<Props> = ({ product, onDelete }) => {
  return (
    <div className="bg-white shadow-[0_12px_48px_0_rgba(255,98,0,0.8)] border-2 border-gray-300 rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:bg-gray-100 hover:-translate-y-2">
      <img
        src={cammeraImg}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-500 mb-2">{product.description}</p>
      <p className="text-blue-700 font-bold mb-4">${product.price.toFixed(2)}</p>
      <div className="flex space-x-2">
        <Link
          to={`/edit/${product.id}`}
          className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductItem;