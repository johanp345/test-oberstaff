import "./index.css";
import { InventoryProvider } from "./contexts/InventoryContext";
import ProductPage from "./views/ProductPage";
import { NavLink, Route, Routes } from "react-router";
import CategoryPage from "./views/CategoryPage";

function App() {
  return (
    <InventoryProvider>
      <main className="app-container flex flex-col min-h-screen overflow-hidden">
        <header className="header-ppal bg-gray-800 text-white h-[60px] flex items-center">
          <nav className="container mx-auto">
            <ul className="flex gap-6">
              <li className="text-lg hover:text-cyan-400 bg">
                <NavLink
                  to={import.meta.env.DEV ? "/" : "/inventory/"}
                  className={({ isActive }) =>
                    isActive ? "text-cyan-400" : "text-white"
                  }
                >
                  Productos
                </NavLink>
              </li>
              <li className="text-lg hover:text-cyan-400 bg">
                <NavLink
                  to={
                    import.meta.env.DEV
                      ? "/categories"
                      : "/inventory/categories"
                  }
                  className={({ isActive }) =>
                    isActive ? "text-cyan-400" : "text-white"
                  }
                >
                  Categorías
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <div className="wrap-ppal container mx-auto py-5">
          <Routes>
            <Route
              path={import.meta.env.DEV ? "/" : "/inventory"}
              element={<ProductPage />}
            />
            <Route
              path={
                import.meta.env.DEV ? "/categories" : "/inventory/categories"
              }
              element={<CategoryPage />}
            />
          </Routes>
        </div>
        <footer className="header-ppal bg-gray-200 text-gray-800 h-[60px] flex items-center  justify-end mt-auto">
          <div className="container mx-auto">
            <div className="flex justify-end">
              Desarrollado por <strong className="ml-2">Johan Páez</strong>
            </div>
          </div>
        </footer>
      </main>
    </InventoryProvider>
  );
}

export default App;
