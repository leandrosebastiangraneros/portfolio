# Guía de Despliegue para NovaManager

Esta guía te ayudará a subir tu proyecto NovaManager a internet. Usaremos **Render** para el Backend y **Vercel** (o Netlify) para el Frontend.

> [!WARNING]
> **Base de Datos SQLite**: Por defecto, la aplicación usa `nova_manager.db` (SQLite). En servicios gratuitos como Render, **los archivos creados se borran cada vez que la app se reinicia o despliega**.
> - **Modo Demo**: Ideal para mostrar el portfolio. Los datos se reinician al desplegar.
> - **Modo Producción**: Requiere cambiar a PostgreSQL (Render ofrece un plan gratuito de Postgres).

---

## 🏗️ 1. Preparar el Backend (Render)

1. **Crea una cuenta** en [render.com](https://render.com).
2. Haz clic en **"New +"** -> **"Web Service"**.
3. Conecta tu repositorio de GitHub (`portfolio`).
4. Configura los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `novamanager-api` (o similar) |
| **Root Directory** | `NovaManager/backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app` |

5. **Variables de Entorno** (Environment Variables):
   - No necesitas ninguna obligatoria para SQLite.
   - Si usas Postgres, añade `DATABASE_URL`.

6. Haz clic en **"Create Web Service"**.
   - Espera a que termine. Render te dará una URL (ej: `https://novamanager-api.onrender.com`).
   - **Copia esta URL**, la necesitarás para el frontend.

---

## 🎨 2. Preparar el Frontend (Vercel)

Vercel es la opción más fácil para apps de React/Vite.

1. **Crea una cuenta** en [vercel.com](https://vercel.com).
2. Haz clic en **"Add New..."** -> **"Project"**.
3. Importa tu repositorio `portfolio`.
4. Configura los ajustes del proyecto:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | `Vite` (debería detectarlo solo) |
| **Root Directory** | `NovaManager/frontend` (Haz clic en "Edit" para seleccionarlo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. **Variables de Entorno** (Importante):
   - Abre la sección "Environment Variables".
   - **Key**: `VITE_API_URL`
   - **Value**: La URL de tu backend en Render (ej: `https://novamanager-api.onrender.com`). **¡Sin la barra `/` al final!**

6. Haz clic en **"Deploy"**.

---

## 🔗 3. Verificación Final

1. Una vez desplegado el frontend, Vercel te dará una URL (ej: `https://novamanager-frontend.vercel.app`).
2. Abre esa URL.
3. Intenta añadir un movimiento o ver el stock.
   - Si falla, verifica la consola del navegador (F12) para ver si hay errores de conexión con el backend.
   - Asegúrate de que en Render el backend diga "Live".

### ¿Base de Datos Persistente? (Opcional)
Si quieres que los datos NO se borren:
1. En Render, crea una **"New PostgreSQL"** database.
2. Copia la `Internal Database URL` (o External si conectas desde fuera).
3. En las Environment Variables de tu Web Service (Backend):
   - Añade `DATABASE_URL` = `tu_url_de_postgres`.
   - Modifica `database.py` (si no lo has hecho ya) para usar `os.getenv('DATABASE_URL')`. (El código actual ya usa `sqlite:///./nova_manager.db` por defecto, necesitarás una pequeña modificación si quieres Postgres).

---

## 📝 Resumen de Cambios Realizados
- **Backend Refactor**: Se añadieron `gunicorn` y `psycopg2-binary` para compatibilidad con servidores. Configurado CORS para aceptar peticiones.
- **Frontend Refactor**: Se reemplazaron todas las llamadas a `localhost:8001` por una configuración dinámica (`API_URL`) que se adapta a producción o desarrollo.
- **Portfolio**: Se actualizó el enlace en tu página principal para dirigir al nuevo sistema NovaManager.
