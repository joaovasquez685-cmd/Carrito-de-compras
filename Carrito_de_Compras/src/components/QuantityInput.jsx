import { useState, useEffect } from 'react';
import { blockInvalidKeys, blockMouseWheel, getPastedDigits } from '../utils/validators';
import { useToast } from '../context/ToastContext';
import { MSG } from '../constants/messages';
import './QuantityInput.css';

// onChange recibe siempre un entero válido (1..max).
// onBelowMin se llama al intentar bajar de 1 o escribir 0 (por defecto: toast de mínimo).
const QuantityInput = ({ value, onChange, max = 999, disabled = false, onBelowMin }) => {
  const { showToast } = useToast();
  const [text, setText] = useState(String(value));

  useEffect(() => { setText(String(value)); }, [value]);

  const belowMin = () => (onBelowMin ? onBelowMin() : showToast(MSG.minCard, 'warning'));
  const exceedMax = () => showToast(MSG.maxStock, 'warning');

  // Valida un texto de dígitos (escrito o pegado): vacío temporal, 0, tope de stock
  const apply = (raw) => {
    if (raw === '') return setText('');
    const n = parseInt(raw, 10);
    if (n < 1) { setText(String(value)); return belowMin(); }
    if (n > max) { setText(String(max)); onChange(max); return exceedMax(); }
    setText(String(n));
    onChange(n);
  };

  const handleChange = (e) => {
    if (/^\d*$/.test(e.target.value)) apply(e.target.value);
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const digits = getPastedDigits(e);
    if (digits) apply(digits);
  };
  const handleKeyDown = (e) => {
    blockInvalidKeys(e);
    if (e.key === 'Enter') e.target.blur();
  };
  const handleBlur = () => { if (text === '') setText(String(value)); };

  const decrease = () => (value <= 1 ? belowMin() : onChange(value - 1));
  const increase = () => (value >= max ? exceedMax() : onChange(value + 1));

  return (
    <div className={`quantity-input ${disabled ? 'disabled' : ''}`}>
      <button type="button" className="qty-button" onClick={decrease} disabled={disabled} aria-label="Disminuir cantidad">−</button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={(e) => e.preventDefault()}
        onWheel={blockMouseWheel}
        onBlur={handleBlur}
        disabled={disabled}
        className="qty-field"
        aria-label="Cantidad"
      />
      <button type="button" className="qty-button" onClick={increase} disabled={disabled} aria-label="Aumentar cantidad">+</button>
    </div>
  );
};

export default QuantityInput;
