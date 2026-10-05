import Toast from './Toast';
import './ToastContainer.css';

const ToastContainer = ({ toasts, onClose }) => (
  <div className="toast-container" role="region" aria-label="Notificaciones">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={onClose} />
    ))}
  </div>
);

export default ToastContainer;
