// Configuración de la URL de la API
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Si estamos ejecutando la build localmente (localhost o 127.0.0.1), forzamos el uso del backend local
// Esto permite probar la build "de producción" con la base de datos local antes de subirla
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log("Detectado entorno local (Live Server/Vite). Usando backend local: http://localhost:8000");
    API_URL = 'http://localhost:8000';
}

export default API_URL;
