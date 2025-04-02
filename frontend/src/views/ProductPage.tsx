import React, { useEffect } from "react";
import { useInventory } from "../contexts/InventoryContext";
import ProductService, { ProductSearchParams } from "../api/productService";
import { ProductFilters } from "../components/Product/ProductFilters";
import { useDebounce } from "../hooks/useDebounce";
import ProductList from "../components/Product/ProductList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ModalProduct from "../components/Product/ModalProduct";
const MySwal = withReactContent(Swal);
const ProductPage: React.FC = () => {
  const { products, filters, error, loading, dispatch } = useInventory();
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    fetchProducts();
  }, [debouncedFilters, dispatch]);
  const fetchProducts = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await ProductService.getProducts(debouncedFilters);
      dispatch({ type: "SET_PRODUCTS", payload: response });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleFilterChange = (newFilters: Partial<ProductSearchParams>) => {
    dispatch({ type: "SET_FILTERS", payload: { ...filters, ...newFilters } });
  };

  const handleProduct = (product = undefined) => {
    MySwal.fire({
      html: (
        <ModalProduct
          product={product}
          handleModal={() => {
            fetchProducts();
            MySwal.close();
          }}
        />
      ),
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
    });
  };
  const handleDelete = (id:number)=>{
    MySwal.fire({
      icon:"question",
      titleText:"Desea borrar producto",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result)=>{
      if (result.isConfirmed) {
        dispatch({ type: "SET_LOADING", payload: true });
        await ProductService.deleteProduct(id);
        fetchProducts();
      }
    })
  }

  return (
    <div className="product-page">
      <h1 className="text-xl mb-5">Gestión de Productos</h1>

      <div className="card bg-white rounded-xl p-5">
        <div className="top-actions flex w-full justify-between flex-col">
          <div className="actions flex mb-5 w-full justify-end">
            <button
              className="rounded-lg h-10 text-center bg-blue-700 text-white cursor-pointer"
              onClick={() => handleProduct()}
              type="button"
            >
              <span className="px-5 block leading-10 font-semibold">
                Crear Producto
              </span>
            </button>
          </div>
          <div className="filters-wrap">
            <h3 className="text-base font-semibold mb-2">Filtros</h3>
            <ProductFilters onFilterChange={handleFilterChange} />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          products.length>0?
          <ProductList products={products} handleProduct={handleProduct} handleDelete={handleDelete} />
          :
          <h3 className="text-xl text-gray-400 font-medium max-w-[500px] mx-auto my-20 text-center">No se encontraton productos</h3>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
