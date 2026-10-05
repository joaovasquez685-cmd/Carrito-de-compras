import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import './App.css';

const AppContent = () => {
  const { products } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState(false);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = filterStock ? product.stock > 0 : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="app">
      <Navbar />
      <Cart />
      
      <main className="main-content">
        <div className="hero">
          <h1>🌾 Productos Típicos de Palmira</h1>
          <p>Los mejores productos de la región directamente a tu hogar</p>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Buscar productos"
          />
          
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filterStock}
              onChange={(e) => setFilterStock(e.target.checked)}
            />
            Solo disponibles
          </label>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <span>😔</span>
            <p>No se encontraron productos</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Tienda Palmira - SENA CBI Palmira</p>
        <p>Desarrollado con ❤️ en React</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
};

export default App;