import { useState } from 'react';
import { useCart } from '../context/CartContext';
import QuantityInput from './QuantityInput';
import { formatPrice, PLACEHOLDER_IMG } from '../utils/validators';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const cartItem = items.find(item => item.id === product.id);
  const stockDisponible = product.stock - (cartItem?.cantidad || 0);
  const sinStock = stockDisponible <= 0;

  const handleAddToCart = () => {
    if (sinStock) return;
    addItem(product, quantity);
    setQuantity(1);
  };

  return (
    <div className={`product-card ${sinStock ? 'out-of-stock' : ''}`}>
      <div className="product-image">
        <img 
          src={product.imagen} 
          alt={product.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMG;
          }}
        />
        {sinStock && (
          <div className="stock-badge">Agotado</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-description">{product.descripcion}</p>
        <div className="product-price">{formatPrice(product.precio)}</div>
        
        <div className="product-stock">
          <span className={`stock-label ${stockDisponible <= 3 ? 'low-stock' : ''}`}>
            Stock: {stockDisponible} {stockDisponible <= 3 && '⚠️'}
          </span>
        </div>
        
        <div className="product-actions">
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
            disabled={sinStock}
          />
          
          <button
            className={`add-button ${sinStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={sinStock}
            aria-label={`Agregar ${product.nombre} al carrito`}
          >
            {sinStock ? 'Sin Stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;