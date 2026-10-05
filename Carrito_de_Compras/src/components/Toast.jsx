import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ id, message, type, onConfirm, confirmLabel = 'Sí, eliminar', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'confirm': return '❓';
      default: return 'ℹ️';
    }
  };

  const getClassName = () => {
    return `toast toast-${type}`;
  };

  return (
    <div className={getClassName()} role="alert" aria-live="polite">
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
      
      <div className="toast-actions">
        {type === 'confirm' && onConfirm && (
          <>
            <button 
              className="toast-button toast-confirm"
              onClick={() => { onConfirm(); onClose(id); }}
            >
              {confirmLabel}
            </button>
            <button 
              className="toast-button toast-cancel"
              onClick={() => onClose(id)}
            >
              Cancelar
            </button>
          </>
        )}
        <button 
          className="toast-close"
          onClick={() => onClose(id)}
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;