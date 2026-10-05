import { useCart } from '../context/CartContext';
import QuantityInput from './QuantityInput';
import { formatPrice, PLACEHOLDER_IMG } from '../utils/validators';
import './Cart.css';

const Cart = () => {
  const { isCartOpen, toggleCart, items, setQuantity, removeItem, requestRemove, requestClear, getTotalPrice } = useCart();

  if (!isCartOpen) return null;

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = getTotalPrice();

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>
      
      <div className={`cart ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>🛒 Tu Carrito</h2>
          <button 
            className="close-cart" 
            onClick={toggleCart}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">🛍️</span>
              <p>Tu carrito está vacío</p>
              <button className="continue-shopping" onClick={toggleCart}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => {
                  const stockRestante = item.stock - item.cantidad;
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = PLACEHOLDER_IMG;
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.nombre}</h4>
                        <p className="cart-item-price">{formatPrice(item.precio)}</p>
                        <p className="cart-item-stock">Stock restante: {stockRestante}</p>
                      </div>
                      
                      <div className="cart-item-actions">
                        <QuantityInput
                          value={item.cantidad}
                          onChange={(qty) => setQuantity(item.id, qty)}
                          onBelowMin={() => requestRemove(item.id)}
                          max={item.stock}
                        />
                        
                        <button
                          className="remove-item"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Eliminar ${item.nombre}`}
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="cart-item-subtotal">
                        Subtotal: {formatPrice(item.precio * item.cantidad)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Total de productos:</span>
                    <span className="summary-value">{totalItems}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total a pagar:</span>
                    <span className="summary-value">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <button className="checkout-button">
                  Proceder al Pago
                </button>
                
                <button className="clear-cart-button" onClick={requestClear}>
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;