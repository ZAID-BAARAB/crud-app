import axios from "axios";
import { selectAccessToken } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import { SERVER_IP } from '../constants/constants';


// Types
export interface ProductCategory {
  categoryId: number;
  name: string;
  description: string;
}

export interface PaginatedProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number; 
  size: number; 
}


export type ProductStatus = "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";

export interface Product {
  id: number;
  name: string;
  price: number;
  photoUrl?: string;
  description?: string;
  stockQuantity: number;
//   isPopular?: boolean;
//   isPromoted?: boolean;
}

// Error types
type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

export const ProductService = {
  /**
   * Fetches top 10 products with authentication
   * @throws {ApiError} When request fails
   */
  async getTop10Products(): Promise<Product[]> {
    try {
      const state = store.getState();
      const accessToken = state.auth.accessToken;

      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get<Product[]>(
        `${SERVER_IP}/api/v1/products/public/getTop10ByOrderByProductId`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: "Failed to fetch products",
        status: error.response?.status,
        code: error.code,
      };

      if (error.response) {
        switch (error.response.status) {
          case 401:
            apiError.message = "Session expired - please login again";
            break;
          case 403:
            apiError.message = "Access denied - check your permissions";
            break;
          case 404:
            apiError.message = "Products endpoint not found";
            break;
          case 500:
            apiError.message = "Server error - please try again later";
            break;
        }
      } else if (error.request) {
        apiError.message = "Network error - check your connection";
      }

      console.error(
        "ProductService.getTop10Products failed:",
        apiError.message,
        error
      );
      throw apiError;
    }
  },

  /**
   * Gets single product by ID
   * @param productId - The ID of the product to fetch
   */
  async getProductById(productId: number): Promise<Product> {
    try {
      const accessToken = store.getState().auth.accessToken;
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get<Product>(
        `${SERVER_IP}/api/v1/products/public/getProductById/${productId}`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch product ${productId}:`, error);
      throw {
        message:
          error.response?.data?.message ||
          `Failed to fetch product ${productId}`,
        status: error.response?.status,
      };
    }
  },

  /**
   * Gets products by category
   * @param categoryId - The category ID to filter by
   */

//   async getProductsByCategory(categoryId: number): Promise<Product[]> {
//     try {
//       const accessToken = store.getState().auth.accessToken;
//       const headers = accessToken
//         ? { Authorization: `Bearer ${accessToken}` }
//         : {};

//       const response = await axios.get<Product[]>(
//         `${SERVER_IP}/api/v1/products/public/category/${categoryId}`,
//         { headers }
//       );

//       return response.data;
//     } catch (error: any) {
//       console.error(
//         `Failed to fetch products for category ${categoryId}:`,
//         error
//       );
//       throw {
//         message:
//           error.response?.data?.message ||
//           `Failed to fetch products for category ${categoryId}`,
//         status: error.response?.status,
//       };
//     }
//   },

// <===== Filter   Product By Name =====>


  async filterProductsByName(
    name?: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedProductResponse> {
    try {
      const accessToken = store.getState().auth.accessToken;
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const params: any = { page, size };
      if (name && name.trim()) {
        params.name = name;
      }

      const response = await axios.get<PaginatedProductResponse>(
        `${SERVER_IP}/api/v1/products/public/filter-by-name`,
        { headers, params }
      );

      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: "Failed to filter products",
        status: error.response?.status,
        code: error.code,
      };

      if (error.response) {
        apiError.message = error.response.data?.message || apiError.message;
      } else if (error.request) {
        apiError.message = "Network error - check your connection";
      }

      console.error(
        "ProductService.filterProductsByName failed:",
        apiError.message,
        error
      );
      throw apiError;
    }
  },

// <===== Create  Product =====>
  async createProduct(payload: FormData): Promise<Product> {
    try {
      const accessToken = selectAccessToken(store.getState());

      const response = await axios.post<Product>(
        `${SERVER_IP}/api/v1/products/create-product`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to create product:", error);
      throw {
        message: error.response?.data?.message || "Failed to create product",
        status: error.response?.status,
      };
    }
  },



// <===== Create  Product =====>

  async updateProduct(productId: number, payload: FormData): Promise<Product> {
    try {
      const accessToken = store.getState().auth.accessToken;

      const response = await axios.put<Product>(
        `${SERVER_IP}/api/v1/products/update-product/${productId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || "Failed to update product",
        status: error.response?.status,
      };
    }
  },

  async getAllProducts(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedProductResponse> {
    try {
      const accessToken = store.getState().auth.accessToken;
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get<PaginatedProductResponse>(
        `${SERVER_IP}/api/v1/products/all`,
        { headers, params: { page, size } }
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch all products:", error);
      throw {
        message: error.response?.data?.message || "Failed to fetch products",
        status: error.response?.status,
      };
    }
  },

  // deleteProduct
  async deleteProduct(productId: number): Promise<void> {
    try {
      const accessToken = store.getState().auth.accessToken;

      await axios.delete(
        `${SERVER_IP}/api/v1/products/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      throw {
        message: error.response?.data?.message || "Failed to delete product",
        status: error.response?.status,
      };
    }
  },
};

export const handleProductError = (error: ApiError) => {
  const defaultMessage = "An error occurred while fetching product data";

  return {
    showToast: true,
    message: error.message || defaultMessage,
    isCritical: error.status ? error.status >= 500 : false,
  };
};
