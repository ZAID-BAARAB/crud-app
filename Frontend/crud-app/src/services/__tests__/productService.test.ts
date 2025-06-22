/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/productService.test.ts
import axios from 'axios';
import { ProductService, handleProductError } from '../productService';
import type { Product, PaginatedProductResponse } from '../productService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the Redux store so ProductService can read a fake token
jest.mock('../../redux/store', () => ({
  store: {
    getState: () => ({ auth: { accessToken: 'token123' } })
  }
}));

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getTop10Products returns data on 200', async () => {
    const fake: Product[] = [
      { id:1, name:'A', price:10, stockQuantity:5 },
      { id:2, name:'B', price:20, stockQuantity:0 },
    ];
    mockedAxios.get.mockResolvedValue({ data: fake });

    const result = await ProductService.getTop10Products();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/public/getTop10ByOrderByProductId'),
      { headers: { Authorization: 'Bearer token123' } }
    );
    expect(result).toEqual(fake);
  });

  it('getTop10Products throws ApiError with 401', async () => {
    mockedAxios.get.mockRejectedValue({ response:{ status:401 } });

    await expect(ProductService.getTop10Products())
      .rejects.toMatchObject({
        message: 'Session expired - please login again',
        status: 401
      });
  });

  it('getProductById returns a single product', async () => {
    const fake: Product = { id:3, name:'C', price:30, stockQuantity:2 };
    mockedAxios.get.mockResolvedValue({ data: fake });

    const result = await ProductService.getProductById(3);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/public/getProductById/3'),
      { headers: { Authorization: 'Bearer token123' } }
    );
    expect(result).toEqual(fake);
  });

  it('filterProductsByName returns paginated response', async () => {
    const fakePage: PaginatedProductResponse = {
      content: [{ id:4, name:'D', price:40, stockQuantity:1 }],
      totalPages:1,
      totalElements:1,
      number:0,
      size:10
    };
    mockedAxios.get.mockResolvedValue({ data: fakePage });

    const result = await ProductService.filterProductsByName('D', 0, 10);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/public/filter-by-name'),
      { headers:{ Authorization:'Bearer token123' }, params:{ page:0, size:10, name:'D' } }
    );
    expect(result).toEqual(fakePage);
  });

  it('handleProductError flags critical for 500-level', () => {
    const err = { message:'Oops', status:500 };
    const out = handleProductError(err);
    expect(out).toEqual({ showToast:true, message:'Oops', isCritical:true });
  });
});


