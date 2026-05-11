# Leandro Graneros | IT SPECIALIST y FULLSTACK

![Ecosistema](https://img.shields.io/badge/Ecosistema-React_19_+_FastAPI-00ff00?style=for-the-badge&logo=react)
![Arquitectura](https://img.shields.io/badge/Arquitectura-Modular_ERP-blue?style=for-the-badge&logo=python)
![Estado](https://img.shields.io/badge/Estado-Producción-emerald?style=for-the-badge)

Bienvenido a mi portfolio. En este repositorio vas a encontrar el código fuente de mis proyectos y las explicaciones técnicas sobre cómo los armé. Acá muestro mis capacidades como desarrollador y mi dominio de las tecnologías que uso.

---

## Technical Stack & Skills

Resumen de las competencias técnicas y herramientas implementadas activamente en este repositorio:

| Dominio | Competencias Técnicas |
| :--- | :--- |
| **Lenguajes** | JavaScript (ES6+), Python, C, SQL, Assembler, HTML5, CSS3 |
| **Frontend** | React 19, TailwindCSS 4, React Router 7, Vite 7, Recharts, Three.js (3D) |
| **Backend** | FastAPI, SQLAlchemy, Pydantic, Python-C Integration (ctypes), API Security (CORS/Secrets) |
| **DevOps & Tools** | Git, GitHub, Vercel, Render, Postman, VS Code |
| **Diseño & UX** | Figma (Prototipado), Adobe Photoshop (Avanzado), Diseño Responsivo, Animaciones CSS |

> **Nota:** Este Portfolio está en constante evolución. Lo actualizo frecuentemente para incorporar optimizaciones y nuevas tecnologías, dando así una mejora continua.


---

## Sobre la Landing Page

Para la presentación de mi portfolio, quise desarrollar algo **moderno, minimalista, pero visualmente impactante**. Utilicé **React 19** con **Tailwind CSS 4** para asegurar un rendimiento óptimo y una estética limpia. Mi objetivo fue escapar de los diseños genéricos, buscando una interfaz que se sienta fresca y dinámica, utilizando animaciones sutiles para guiar la atención del usuario sin saturarlo.

---

## Proyectos

### 1. Medidor de Ping (Fortnite Brasil)
Fue el primer proyecto que se me ocurrió para demostrar que entiendo cómo funciona JavaScript y el manejo de redes. Quería medir el ping real a los servidores de Fortnite en Brasil, así que implementé sockets para tener datos precisos y diagnosticar la conexión en tiempo real.

### 2. Visualizador de Teclas
Es una herramienta interactiva que muestra en pantalla qué teclas estás presionando. Lo armé para probar eventos de teclado, viendo cómo responde la interfaz a las interacciones del usuario de forma visual y dinámica.

### 3. NexusHardware
El nombre "Nexus" sale de la idea de un punto central de conexión. Quería crear un sistema que sea el nexo real entre la venta (E-commerce) y la administración (ERP).

**¿Cómo funciona?**
Es una plataforma híbrida. El frontend permite a los usuarios armar PCs personalizadas con un validador lógico de hardware, mientras que el backend gestiona todo.

**La Integración Python + C:**
Para el módulo de inventario, necesitaba que los cálculos de stock se hicieran al instante. Por eso escribí la parte matemática en **C** (que es mucho más rápido) y la conecté con **Python**. Así logré que el sistema procese muchos datos sin trabarse, aprovechando la velocidad de C y la facilidad de Python para la web.

**Futuro:**
Planeo agregar un módulo de IA real para recomendaciones de upgrades basados en el uso actual del usuario.

### 4. NovaManager
Este proyecto nació de una necesidad real en el rubro de la obra pública, específicamente para cuadrillas que trabajan en **veredas**.

**La Problemática y la Solución:**
El trabajo en calle suele tener conectividad nula o intermitente. Desarrollé NovaManager pensando en "Offline-First". Utilicé **React** con capacidades de PWA. Originalmente, era una app simple de registro, pero ha evolucionado a un sistema completo que permite registrar avances de obra, materiales y asistencia sin internet. El sistema guarda todo localmente y sincroniza con la nube apenas detecta conexión.

**Futuro:**
Estoy trabajando en migrar la base de datos local a una solución más robusta como SQLite para Wasm, para manejar planos y fotos de obra directamente en el navegador sin lag.

---

## Ejecución Local

Instrucciones para desplegar el proyecto en un entorno local:

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/leandrosebastiangraneros/portfolio.git
    cd portfolio
    ```

2.  **Iniciar Backend (Puerto 8000)**:
    ```bash
    cd public/NexusHardware/backend
    pip install -r requirements.txt
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

3.  **Iniciar Frontend (Puerto 5173)**:
    ```bash
    cd public/NexusHardware/frontend
    npm install
    npm run dev
    ```

---

## Contacto

*   **Email**: leandro.graneros@example.com
*   **LinkedIn**: [linkedin.com/in/leandrograneros](https://linkedin.com)
*   **GitHub**: [github.com/leandrosebastiangraneros](https://github.com/leandrosebastiangraneros)

---
© 2026 Leandro Graneros.
