// src/api/CategoryService.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Definición de tipos TypeScript
export interface Category {
  id: number;
  name: string;
}

export interface CreateCategory extends Omit<Category, "id"> {}
export interface UpdateCategory extends Partial<Omit<Category, "id">> {}


// Configuración de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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

const CategoryService = {
  // Obtener todos los categorias con filtros
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>("/categories");
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener Categorias: ${error.message}`);
    }
  },

  // Obtener un categoria por ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener el categoria: ${error.message}`);
    }
  },

  // Crear nuevo categoria
  async createCategory(CategoryData: CreateCategory): Promise<Category> {
    try {
      const response = await apiClient.post<Category>("/category/create", CategoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al crear el categoria: ${error.message}`);
    }
  },

  // Actualizar categoria existente
  async updateCategory(
    id: number,
    CategoryData: UpdateCategory
  ): Promise<Category> {
    try {
      const response = await apiClient.put<Category>(
        `/categories/${id}`,
        CategoryData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar el Categoria: ${error.message}`);
    }
  },

  // Eliminar categoria
  async deleteCategory(id: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error: any) {
      throw new Error(`Error al eliminar el categoria: ${error.message}`);
    }
  },


};

export default CategoryService;
