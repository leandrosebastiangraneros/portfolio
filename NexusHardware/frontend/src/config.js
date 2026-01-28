// Configuración de la URL de la API
// Usa la variable de entorno VITE_API_URL si existe (producción), sino usa localhost (desarrollo)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;
