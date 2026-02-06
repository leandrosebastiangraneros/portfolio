# Leandro Graneros | IT SPECIALIST y FULLSTACK

![Ecosistema](https://img.shields.io/badge/Ecosistema-React_19_+_FastAPI-00ff00?style=for-the-badge&logo=react)
![Arquitectura](https://img.shields.io/badge/Arquitectura-Modular_ERP-blue?style=for-the-badge&logo=python)
![Estado](https://img.shields.io/badge/Estado-Producción-emerald?style=for-the-badge)

Bienvenido a mi repositorio central. Este espacio no es solo un portafolio; es una demostración técnica de capacidades avanzadas en desarrollo web, arquitectura de software y diseño de sistemas. Aquí convergen interfaces de alto rendimiento con backends robustos y optimizados.

> "La excelencia técnica no es un acto, es un hábito."

> [!NOTE]
> Este proyecto se encuentra en **constante evolución y mejora**. Las actualizaciones son frecuentes para incorporar las últimas tecnologías y optimizaciones.

---

## Proyecto Insignia: NEXUS HARDWARE OS

**NexusHardware** es más que un e-commerce; es una plataforma integral de gestión empresarial (ERP) simbiótica, donde el frontend de ventas y el backend administrativo operan en tiempo real.

### Arquitectura y Características Clave

1.  **Frontend de Alto Rendimiento (React 19 + Vite)**
    *   **Diseño "Void & Light"**: Interfaz inmersiva con Glassmorphism, animaciones `framer-motion` y estética futurista.
    *   **PC Builder Interactivo**: Módulo lógico para el armado de computadoras personalizadas.
    *   **Checkout en Tiempo Real**: Procesamiento de órdenes con validación de stock atómica.

2.  **Backend Híbrido Avanzado (FastAPI + C Interop)**
    *   **Optimización de Stock**: He implementado un motor híbrido. El sistema intenta cargar una librería dinámica compilada en C (`.dll`/`.so`) para cálculos masivos de predicción de demanda. Si el entorno no lo soporta, realiza un *fallback* transparente a un motor Python optimizado con la misma lógica matemática.
    *   **Seguridad**: Hashing `SHA256` para credenciales, validación `Pydantic` estricta y protección CORS configurada para despliegues híbridos.
    *   **Auditoría**: Trazabilidad completa de transacciones (`UUID4`).

3.  **ERP Modular (Panel Administrativo)**
    *   **NEXUS OS**: Un "Sistema Operativo" web para la administración.
    *   **Módulos Independientes**:
        *   **Dashboard**: Métricas visuales en tiempo real (Recharts).
        *   **Inventario**: Carga de productos y motor de decisión de reabastecimiento.
        *   **Transacciones**: Generación automática de facturas PDF profesionales (`jspdf-autotable`) con validación fiscal simulada.

---

## Otros Proyectos en el Ecosistema

### NovaManager
Sistema de gestión de recursos para contratistas móviles. Enfocado en la operación offline-first y sincronización de datos cuando la conectividad se restablece.
*   **Stack**: React, SQLite, PWA capabilities.

### Herramientas de Diagnóstico
*   **Latency Monitor**: Herramienta de análisis de red para optimización de gaming competitivo.
*   **Input Lag Visualizer**: Banco de pruebas para medir la latencia de entrada en navegadores.

---

## Stack Tecnológico

| Dominio | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, Framer Motion, Recharts, jsPDF |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, Uvicorn |
| **Data** | SQLite (Dev), PostgreSQL (Prod), Pydantic |
| **Low-Level** | C (Lógica de Optimización con Ctypes Interop) |
| **DevOps** | Git, Vite, Vercel, Render |

---

## Instalación y Despliegue Local

Para ejecutar el ecosistema completo (`NexusHardware`) en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/leandrosebastiangraneros/portfolio.git
cd portfolio
```

### 2. Iniciar Backend (Nexus API)
```bash
cd public/NexusHardware/backend
pip install -r requirements.txt
# Inicia el servidor en el puerto 8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Iniciar Frontend (Nexus Client & OS)
```bash
# En una nueva terminal
cd public/NexusHardware/frontend
npm install
npm run dev
```

El sistema estará operativo en:
*   **Tienda**: `http://localhost:5173`
*   **ERP Admin**: `http://localhost:5173/admin` (Credenciales: `admin` / `admin123`)
*   **Documentación API**: `http://localhost:8000/docs`

---

## Contacto Profesional

Estoy abierto a desafíos técnicos que requieran soluciones escalables y creativas.

*   **Email**: leandro.graneros@example.com
*   **LinkedIn**: [linkedin.com/in/leandrograneros](https://linkedin.com)
*   **GitHub**: [github.com/leandrosebastiangraneros](https://github.com/leandrosebastiangraneros)

---
© 2026 Leandro Graneros. Arquitectura de Software & Desarrollo Full-Stack.
