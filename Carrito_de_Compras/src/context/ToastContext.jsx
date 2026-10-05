import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import ToastContainer from '../components/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // options: { onConfirm, confirmLabel, duration }
  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = nextId.current++;
    const duration = options.duration ?? (options.onConfirm ? 8000 : 4000);
    setToasts((prev) => [
      ...prev.filter((t) => t.message !== message), // mismo mensaje: se reinicia, no se apila
      { id, message, type, duration, onConfirm: options.onConfirm, confirmLabel: options.confirmLabel },
    ].slice(-4));
    return id;
  }, []);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};
