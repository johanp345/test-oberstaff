// components/Product/ProductFilters.jsx
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import CategoryService, { Category } from "../../api/categoryService";

export const ProductFilters = ({
  onFilterChange,
}: {
  onFilterChange: Function;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getCategories();
  }, []);
  const getCategories = async () => {
    const resp = await CategoryService.getCategories();
    setCategories(resp);
  };
  const debouncedFilter = useCallback(
    debounce((filters: any) => onFilterChange(filters), 500),
    []
  );

  interface FilterParams {
    name: string;
  }

  interface SearchEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleSearch = (e: SearchEvent): void => {
    debouncedFilter({ name: e.target.value } as FilterParams);
  };
  const handleMin = (e: SearchEvent): void => {
    debouncedFilter({ price_min: e.target.value });
  };
  const handleMax = (e: SearchEvent): void => {
    debouncedFilter({ price_max: e.target.value });
  };
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    debouncedFilter({ category: e.target.value });
  };

  return (
    <div className="filters-container flex gap-5 flex-wrap">
      <div className="wrap-prices flex items-center">
        <label htmlFor="">Precio:</label>
        <div className="inputs flex items-center gap-2 ml-2">
          <input
            className="inputText w-[100px]"
            type="text"
            placeholder="Min"
            onChange={handleMin}
          />
          <span>-</span>
          <input
            className="inputText w-[100px]"
            type="text"
            placeholder="Max"
            onChange={handleMax}
          />
        </div>
      </div>
      <div className="wrap-search flex gap-2 ml-5 items-center">
        <label htmlFor="">Buscar nombre:</label>
        <input
          className="inputText"
          type="text"
          placeholder="Buscar productos..."
          onChange={handleSearch}
        />
      </div>
      <div className="wrap-search flex gap-2 ml-5 items-center">
        <label htmlFor="">Categoría</label>
        <select onChange={handleCategory} className="selectCustom">
          <option value="">Seleccionar ... </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
