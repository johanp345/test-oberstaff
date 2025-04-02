// hooks/useInventory.js
import { useState, useEffect, useCallback } from "react";
import ProductService, { Product } from "../api/productService";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({});

  const loadProducts = useCallback(async () => {
    try {
      const response = await ProductService.getProducts(filters);
      setProducts(response);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [filters]);

  const findProductById = async (id: number) => {
    try {
      const response = await ProductService.getProductById(id);
      setProducts([response]);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Efecto para recargar productos cuando cambian los filtros
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    filters,
    setFilters,
    findProductById,
    refreshProducts: loadProducts,
  };
};
