import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CategoryService, { Category } from "../api/categoryService";
import CategoryList from "../components/Category/CategoryList";
import ModalCategory from "../components/Category/ModalCategory";
const MySwal = withReactContent(Swal);
const CategoryPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const resp = await CategoryService.getCategories();
      if (resp) {
        setCategories(resp);
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (category = undefined) => {
    MySwal.fire({
      html: (
        <ModalCategory
          category={category}
          handleModal={() => {
            fetchCategory();
            MySwal.close();
          }}
        />
      ),
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
    });
  };
  const handleDelete = (id: number) => {
    MySwal.fire({
      icon: "question",
      titleText: "Desea borrar Categoría",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await CategoryService.deleteCategory(id);
        fetchCategory();
      }
    });
  };

  return (
    <div className="product-page">
      <h1 className="text-xl mb-5">Gestión de Categoías</h1>

      <div className="card bg-white rounded-xl p-5">
        <div className="top-actions flex w-full justify-between flex-col">
          <div className="actions flex mb-5 w-full justify-end">
            <button
              className="rounded-lg h-10 text-center bg-blue-700 text-white cursor-pointer"
              onClick={() => handleCategory()}
              type="button"
            >
              <span className="px-5 block leading-10 font-semibold">
                Crear Categoría
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando categorias...</p>
          </div>
        ) : categories.length > 0 ? (
          <CategoryList
            categories={categories}
            handleCategory={handleCategory}
            handleDelete={handleDelete}
          />
        ) : (
          <h3 className="text-xl text-gray-400 font-medium max-w-[500px] mx-auto my-20 text-center">
            No se encontraton Categorías
          </h3>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
