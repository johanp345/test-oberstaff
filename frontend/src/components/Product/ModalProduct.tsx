import React, { useEffect, useState } from "react";
import ProductService, {
  CreateProduct,
  Product,
} from "../../api/productService";

import CategoryService, { Category } from "../../api/categoryService";

const ModalProduct = ({
  product,
  handleModal = () => {},
}: {
  product?: Product;
  handleModal?: Function;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [form, setForm] = useState(
    product
      ? product
      : {
          name: "",
          price: 0,
          category_id: 0,
          description: "",
          stock: 0,
        }
  );
  interface FormState {
    name: string;
    price: number;
    category_id: number;
    description: string;
    stock: number;
  }

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isInvalidForm()) {
      return;
    }
    setSending(true);
    const data: CreateProduct = { ...(form as FormState) };
    const resp =
      product && product.id
        ? await ProductService.updateProduct(product.id, data)
        : await ProductService.createProduct(data);
    setSending(false);
    if (resp.id) {
      handleModal();
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  const getCategories = async () => {
    const resp = await CategoryService.getCategories();
    setCategories(resp);
  };
  const isInvalidForm = () => {
    return (
      form.name.trim() === "" ||
      form.category_id === 0 ||
      form.description?.trim() === "" ||
      form.price === 0
    );
  };
  return (
    <div className="wrap-form-producto w-full max-w-[500px] mx-auto py-5">
      <form action="" className="w-full" onSubmit={handleForm}>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Nombre del producto:
          </label>
          <input
            className="inputText"
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Precio del producto:
          </label>
          <input
            className="inputText"
            type="text"
            placeholder="Precio del producto"
            name="price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Cantidad Inicial:
          </label>
          <input
            className="inputText"
            type="text"
            name="stock"
            value={form.stock}
            placeholder="Cantidad Inicial"
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Descripción:
          </label>
          <input
            className="inputText"
            type="text"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Categoría
          </label>
          <select
            name="category_id"
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            className="selectCustom"
            value={form.category_id}
          >
            <option value="0">Seleccionar ... </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="rounded-lg h-10 text-center bg-blue-700 text-white cursor-pointer mt-5 disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="submit"
          disabled={
            sending ||
            form.name.trim() === "" ||
            form.category_id.toString() === "0" ||
            form.description?.trim() === "" ||
            form.price === 0
          }
        >
          <span className="px-5 block leading-10 font-semibold">
            {sending
              ? "Enviando"
              : product && product.id
              ? "Editar producto"
              : "Crear Producto"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ModalProduct;
