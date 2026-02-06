#include <stdio.h>

// Definimos una estructura para devolver datos complejos si fuera necesario
// Por ahora, haremos una función directa para facilitar la integración.

// La directiva __declspec(dllexport) es para Windows. 
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT
#endif

/*
 * Función: calcular_reorden
 * -------------------------
 * Recibe los datos crudos desde la base de datos y aplica lógica
 * para determinar si se necesita comprar más stock y cuánto.
 * * ventas_mes: Promedio de ventas en 30 días.
 * tiempo_entrega: Días que tarda el proveedor.
 * stock_actual: Lo que tienes en almacén.
 * * Retorna: Cantidad a comprar (0 si no hace falta).
 */

EXPORT int calcular_necesidad_compra(int ventas_mes, int tiempo_entrega, int stock_actual) {
    // 1. Calcular venta diaria promedio
    double venta_diaria = (double)ventas_mes / 30.0;
    
    // 2. Calcular Stock de Seguridad (Asumimos 20% extra para cubrir imprevistos)
    int stock_seguridad = (int)(ventas_mes * 0.20);

    // 3. Calcular Punto de Reorden (Cuando el stock baja a este numero, pedimos)
    int punto_reorden = (int)(venta_diaria * tiempo_entrega) + stock_seguridad;

    // Lógica de decisión
    if (stock_actual <= punto_reorden) {
        // Pedir suficiente para cubrir el mes + seguridad, restando lo que ya tenemos
        int cantidad_a_pedir = (ventas_mes + stock_seguridad) - stock_actual;
        return (cantidad_a_pedir > 0) ? cantidad_a_pedir : 0;
    }
    
    return 0; // No hace falta comprar
}
