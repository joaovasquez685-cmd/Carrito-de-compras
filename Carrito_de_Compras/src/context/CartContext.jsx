import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import productosData from '../data/productos.json';
import { useToast } from './ToastContext';
import { MSG } from '../constants/messages';

const STORAGE_KEY = 'tiendaPalmiraCart';
const PRODUCTS = productosData.productos;
const CartContext = createContext(null);

// Lee el carrito guardado y lo valida contra el catálogo (enteros entre 1 y el stock)
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.flatMap(({ id, cantidad }) => {
      const product = PRODUCTS.find((p) => p.id === id);
      const qty = Math.min(parseInt(cantidad, 10), product?.stock ?? 0);
      return product && qty >= 1 ? [{ ...product, cantidad: qty }] : [];
    });
  } catch {
    return [];
  }
};

// Reducer puro: la lógica de stock y los toasts viven en el Provider
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEM': {
      const { product, cantidad } = action;
      const exists = state.items.some((i) => i.id === product.id);
      const items = exists
        ? state.items.map((i) => (i.id === product.id ? { ...i, cantidad } : i))
        : [...state.items, { ...product, cantidad }];
      return { ...state, items };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    items: loadCart(),
    isCartOpen: false,
  }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error('No se pudo guardar el carrito:', e);
    }
  }, [state.items]);

  const { totalItems, totalPrice } = useMemo(
    () => ({
      totalItems: state.items.reduce((sum, i) => sum + i.cantidad, 0),
      totalPrice: state.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    }),
    [state.items]
  );

  // Agregar: suma a la línea existente y nunca supera el stock
  const addItem = (product, quantity = 1) => {
    const current = state.items.find((i) => i.id === product.id)?.cantidad ?? 0;
    const total = current + quantity;
    dispatch({ type: 'SET_ITEM', product, cantidad: Math.min(total, product.stock) });
    if (total > product.stock) showToast(MSG.maxStock, 'warning');
    else showToast(MSG.added, 'success');
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', id });
    showToast(MSG.removed, 'success');
  };

  // Cantidad mínima: pregunta con un toast de confirmación antes de eliminar
  const requestRemove = (id) =>
    showToast(MSG.minCart, 'confirm', { onConfirm: () => removeItem(id) });

  const setQuantity = (id, qty) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    if (qty < 1) return requestRemove(id);
    if (qty > product.stock) showToast(MSG.maxStock, 'warning');
    dispatch({ type: 'SET_ITEM', product, cantidad: Math.min(qty, product.stock) });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showToast(MSG.cleared, 'success');
  };

  const requestClear = () =>
    showToast(MSG.clearConfirm, 'confirm', { onConfirm: clearCart, confirmLabel: 'Sí, vaciar' });

  const value = {
    ...state,
    products: PRODUCTS,
    addItem,
    setQuantity,
    removeItem,
    requestRemove,
    requestClear,
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    getTotalItems: () => totalItems,
    getTotalPrice: () => totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};
