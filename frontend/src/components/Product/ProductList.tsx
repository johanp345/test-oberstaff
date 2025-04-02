import { Product } from "../../api/productService";

const ProductList = ({
  products = [],
  handleProduct = () => {},
  handleDelete = () => {},
}: {
  products: Product[];
  handleProduct?: Function;
  handleDelete?: Function;
}) => {
  return (
    <div className="products-list my-10">
      <table className="w-full border border-gray-300 rounded-2xl">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 px-2 bg-gray-300 text-center">#Id</th>
            <th className="py-2 px-2 bg-gray-300 text-center">Nombre</th>
            <th className="py-2 px-2 bg-gray-300 text-center">Precio</th>
            <th className="py-2 px-2 bg-gray-300 text-center">Stock</th>
            <th className="py-2 px-2 bg-gray-300 text-center">Categoría</th>
            <th className="py-2 px-2 bg-gray-300 text-center">Descripción</th>
            <th className="py-2 px-2 bg-gray-300 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="py-2 px-2 text-center">{p.id}</td>
              <td className="py-2 px-2 text-center">{p.name}</td>
              <td className="py-2 px-2 text-center">{p.price}</td>
              <td className="py-2 px-2 text-center">{p.stock}</td>
              <td className="py-2 px-2 text-center">{p.category_id}</td>
              <td className="py-2 px-2 text-center">{p.description}</td>
              <td>
                <div className="flex gap-2">
                  <button
                    className="h-[25px] cursor-pointer leading-[25px] flex items-center rounded-md px-3 py-1 bg-amber-300"
                    onClick={() => handleProduct(p)}
                  >
                    Editar
                  </button>
                  <button className="h-[25px] cursor-pointer leading-[25px] flex items-center rounded-md px-3 py-1 bg-red-300 ml-10" onClick={()=> handleDelete(p.id) }>
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul></ul>
    </div>
  );
};

export default ProductList;
