// src/api/productService.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Definición de tipos TypeScript
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface CreateProduct extends Omit<Product, "id"> {}
export interface UpdateProduct extends Partial<Omit<Product, "id">> {}

export interface ProductSearchParams {
  name?: string;
  category?: number | number[];
  price_min?: number;
  price_max?: number;
}

// Configuración de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  paramsSerializer: (params) => {
    return Object.entries(params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((v) => `${key}[]=${encodeURIComponent(v)}`)
            .join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
  },
});

// Interceptor para manejo global de errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const errorMessage = error.response?.data?.error || "Error de conexión";
    return Promise.reject(new Error(errorMessage));
  }
);
apiClient.interceptors.request.use(config => {
  if (config.method?.toUpperCase() === 'POST') {
      config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

const ProductService = {
  // Obtener todos los productos con filtros
  async getProducts(params?: ProductSearchParams): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>("/products", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  },

  // Obtener un producto por ID
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  },

  // Crear nuevo producto
  async createProduct(productData: CreateProduct): Promise<Product> {
    try {
      const response = await apiClient.post<Product>("/product/create", productData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  },

  // Actualizar producto existente
  async updateProduct(
    id: number,
    productData: UpdateProduct
  ): Promise<Product>  {
    try {
      const response = await apiClient.put<Product>(
        `/products/${id}`,
        productData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  // Eliminar producto
  async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error: any) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  },

  // Búsqueda avanzada con paginación
  async searchProducts(params: ProductSearchParams): Promise<{
    data: Product[];
    total: number;
    page: number;
    per_page: number;
  }> {
    try {
      const response = await apiClient.get<{
        data: Product[];
        meta: {
          total: number;
          page: number;
          per_page: number;
        };
      }>("/products/search", { params });

      return {
        data: response.data.data,
        total: response.data.meta.total,
        page: response.data.meta.page,
        per_page: response.data.meta.per_page,
      };
    } catch (error: any) {
      throw new Error(`Error en la búsqueda: ${error.message}`);
    }
  },


};

export default ProductService;
