/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchInput from "../components/UI/SearchInput";
import AddButton from "../components/UI/AddButton";
import ProductItem from "../components/ProductItem";
import Loader from "../components/UI/Loader";
import { ProductService } from "../services/productService";
import type { Product } from "../services/productService";
import Footer from "../components/Footer";


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 10;


  // Fetch products on mount and when searchValue changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        let result;
        if (searchValue.trim()) {
          result = await ProductService.filterProductsByName(searchValue, 0, 10);
          if (isMounted) setProducts(result.content);
        } else {
          // const topProducts = await ProductService.getTop10Products();
                    // if (isMounted) setProducts(topProducts);
            result = await ProductService.getAllProducts(currentPage, pageSize);
            if (isMounted) {
              setProducts(result.content);
              setTotalPages(result.totalPages);
            }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "No Products Yet ! Please add some products.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [searchValue]);

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mx-6">
          <h2 className="text-2xl font-bold">Product List</h2>
          <div className="flex-1 flex justify-center md:justify-end">
            <SearchInput searchValue={searchValue} onChange={setSearchValue} />
          </div>
          <div className="flex justify-center md:justify-end" onClick={() => navigate('/addProduct')}>
            <AddButton />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No products available.</p>
        )}
        <div className="flex justify-center mt-6">
          <nav className="inline-flex items-center space-x-2">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded"
            >
              Next
            </button>
          </nav>
        </div>
        <div className="mt-8">
          <Footer></Footer>
        </div>

      </div>
    </motion.div>
  );
};

export default Home;




