import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { Product, ProductSearchParams } from '../api/productService';

type InventoryState = {
  products: Product[];
  filters: ProductSearchParams;
  loading: boolean;
  error: string | null;
};

type InventoryAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERS'; payload: ProductSearchParams }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: InventoryState = {
  products: [],
  filters: {
    name:"",
    
  },
  loading: false,
  error: null
};

const InventoryContext = createContext<{
  state: InventoryState;
  dispatch: Dispatch<InventoryAction>;
}>({
  state: initialState,
  dispatch: () => null
});

const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const { state, dispatch } = useContext(InventoryContext);
  return { ...state, dispatch };
};