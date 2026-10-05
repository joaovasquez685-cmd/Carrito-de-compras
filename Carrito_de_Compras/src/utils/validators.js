// Bloquea teclas que no sean dígitos (e, E, +, -, ., , y cualquier letra o símbolo).
// Las teclas con nombre (Backspace, flechas, Tab, Enter...) y Ctrl/Cmd+V/C/A se dejan pasar.
export const blockInvalidKeys = (e) => {
  if (e.ctrlKey || e.metaKey) return;
  if (e.key.length === 1 && !/^\d$/.test(e.key)) e.preventDefault();
};

// Evita que la rueda del mouse cambie el valor sin querer
export const blockMouseWheel = (e) => e.target.blur();

// Devuelve el texto pegado solo si son únicamente dígitos; si no, null
export const getPastedDigits = (e) => {
  const text = e.clipboardData.getData('text').trim();
  return /^\d+$/.test(text) ? text : null;
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

// Imagen de respaldo local (no depende de servicios externos)
export const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='%23e8ecf4'/><text x='50%' y='50%' font-size='60' text-anchor='middle' dominant-baseline='middle'>🛍️</text></svg>";
