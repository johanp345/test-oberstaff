import React, { useState } from "react";

import CategoryService, {
  Category,
  CreateCategory,
} from "../../api/categoryService";

const ModalCategory = ({
  category,
  handleModal = () => {},
}: {
  category?: Category;
  handleModal?: Function;
}) => {
  const [sending, setSending] = useState<boolean>(false);
  const [form, setForm] = useState(
    category
      ? category
      : {
          name: "",
        }
  );
  interface FormState {
    name: string;
  }

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isInvalidForm()) {
      return;
    }
    setSending(true);
    const data: CreateCategory = { ...(form as FormState) };
    const resp =
      category && category.id
        ? await CategoryService.updateCategory(category.id, data)
        : await CategoryService.createCategory(data);
    setSending(false);
    if (resp.id) {
      handleModal();
    }
  };
  const isInvalidForm = () => {
    return form.name.trim() === "";
  };
  return (
    <div className="wrap-form-category w-full max-w-[500px] mx-auto py-5">
      <form action="" className="w-full" onSubmit={handleForm}>
        <div className="wrap-search flex flex-col mb-5 gap-2">
          <label htmlFor="" className="text-left">
            Nombre de la Categoria:
          </label>
          <input
            className="inputText"
            type="text"
            name="name"
            placeholder="Nombre del Categoria"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <button
          className="rounded-lg h-10 text-center bg-blue-700 text-white cursor-pointer mt-5 disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="submit"
          disabled={sending || form.name.trim() === ""}
        >
          <span className="px-5 block leading-10 font-semibold">
            {sending
              ? "Enviando"
              : category && category.id
              ? "Editar Categoria"
              : "Crear Categoria"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ModalCategory;
