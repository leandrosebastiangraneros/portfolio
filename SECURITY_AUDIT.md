# Reporte de Auditoría de Ciberseguridad

## Resumen Ejecutivo
He realizado una revisión de seguridad exhaustiva en los códigos base de Nexus Hardware (Backend/Frontend) y mi sitio principal del Portfolio. La postura de seguridad general es sólida, habiendo aplicado personalmente correcciones críticas durante la auditoría para garantizar la integridad del sistema.

## Mis Hallazgos y Correcciones

### 1. Backend API (`NexusHardware/backend`)
*   **Inyección SQL**: **APROBADO**. Confirmé que mi implementación utiliza SQLAlchemy ORM, el cual parametriza automáticamente las consultas, blindando la aplicación contra ataques de inyección SQL.
*   **Configuración CORS**: **CORREGIDO**. Detecté una configuración permisiva y eliminé el comodín `["*"]`.
    *   *Acción*: Restringí la API para que solo acepte peticiones desde mis dominios de confianza: `localhost` (Desarrollo) y `leandrosebastiangraneros.github.io` (Producción).
*   **Credenciales/Secretos**: **APROBADO**. Realicé un escaneo de código y verifiqué que no existan claves API ni credenciales expuestas en mis archivos Python.

### 2. Aplicación Frontend (`NexusHardware/frontend`)
*   **Gestión de Secretos**: **APROBADO**. Implementé el uso de variables de entorno (`import.meta.env.VITE_API_URL`) para manejar la configuración, manteniendo los datos sensibles fuera del código fuente.
*   **XSS (Cross-Site Scripting)**: **APROBADO**. Validé que no existen usos peligrosos de `dangerouslySetInnerHTML`, confiando en el escape automático de React.

### 3. Portfolio (`index.html`) e Infraestructura
*   **Vulnerabilidad "Tabnabbing"**: **CORREGIDO**. Identifiqué enlaces externos vulnerables a LinkedIn y GitHub.
    *   *Acción*: Agregué `rel="noopener noreferrer"` a todos los enlaces salientes para prevenir la manipulación de pestañas.
*   **Seguridad Git**: **CORREGIDO**. Noté la ausencia de un archivo de exclusión.
    *   *Acción*: Creé e implementé un archivo `.gitignore` robusto para prevenir la filtración accidental de archivos sensibles, bases de datos locales o cachés.

## Conclusión
He resuelto exitosamente todos los vectores de ataque identificados. Mi código ahora cumple estricta conformidad con las mejores prácticas de seguridad de la industria.
