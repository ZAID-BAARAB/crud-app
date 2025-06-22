/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductItem.tsx
import React, { useState } from "react";
import type { Product } from "../services/productService";
import { ProductService } from "../services/productService";
import EditProductModal from "./EditProductModal";

interface Props {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductItem: React.FC<Props> = ({ product, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await ProductService.deleteProduct(product.id);
      onDelete(product.id);
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
  const stockColorClass = inStock ? "text-green-500" : "text-red-500";
  const stockIcon = (
    <span className={`${stockColorClass} text-xl mr-1`}>
      {/* Dot icon */}
      &#9679;
    </span>
  );

  return (
    <>
      <div className="bg-white shadow-[0_12px_48px_0_rgba(255,98,0,0.8)] border-2 border-gray-300 rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:bg-gray-100 hover:-translate-y-2">
        <img
          src={product.photoUrl}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <div className="mb-2">
          <h3 className="text-lg font-semibold inline-block mr-2">{product.name}</h3>
          <div className="inline-flex items-center">
            {stockIcon}
            <span className="text-sm text-gray-600">{product.stockQuantity}</span>
          </div>
        </div>
        <p className="text-gray-500 mb-2">{shortDesc}</p>
        <p className="text-blue-700 font-bold mb-4">${product.price.toFixed(2)}</p>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
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
    </>
  );
};

export default ProductItem;



// /* eslint-disable @typescript-eslint/no-explicit-any */
// // ProductItem.tsx
// import React, { useState } from "react";
// // import { Link } from "react-router-dom";
// import type { Product } from "../services/productService";
// import { ProductService } from "../services/productService";
// import EditProductModal from "./EditProductModal";

// interface Props {
//   product: Product;
//   onDelete: (id: number) => void;
// }

// const ProductItem: React.FC<Props> = ({ product, onDelete }) => {
//   const [showModal, setShowModal] = useState(false);

//   const handleDelete = async () => {
//     try {
//       await ProductService.deleteProduct(product.id);
//       onDelete(product.id);
//     } catch (error: any) {
//       alert(error.message || "Failed to delete product");
//     }
//   };

//   const handleEdit = () => {
//     setShowModal(true);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//   };

//   const handleEditSuccess = () => {
//     setShowModal(false);
//     window.location.reload(); // or trigger a parent update for better UX
//   };

//   return (
//     <>
//       <div className="bg-white shadow-[0_12px_48px_0_rgba(255,98,0,0.8)] border-2 border-gray-300 rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:bg-gray-100 hover:-translate-y-2">
//         <img
//           src={product.photoUrl}
//           alt={product.name}
//           className="w-full h-40 object-cover rounded mb-4"
//         />
//         <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
//         <div>
//           <div>
//             <span className="text-sm text-gray-600">
//               Stock: {product.stockQuantity}
//             </span>
//           </div>
//         </div>
//         <p className="text-gray-500 mb-2">{product.description}</p>
//         <p className="text-blue-700 font-bold mb-4">${product.price.toFixed(2)}</p>
//         <div className="flex space-x-2">
//           <button
//             onClick={handleEdit}
//             className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
//           >
//             Edit
//           </button>
//           <button
//             onClick={handleDelete}
//             className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//       <EditProductModal
//         product={product}
//         isOpen={showModal}
//         onClose={handleModalClose}
//         onSuccess={handleEditSuccess}
//       />
//     </>
//   );
// };

// export default ProductItem;