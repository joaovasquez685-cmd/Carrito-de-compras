import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🏪</span>
          <h1>Tienda Palmira</h1>
        </div>
        
        <button className="cart-button" onClick={toggleCart} aria-label="Abrir carrito">
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && (
            <span className="cart-counter" aria-label={`${totalItems} productos en el carrito`}>
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;