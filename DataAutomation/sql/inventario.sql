-- Tabla de Productos
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100),
    stock_actual INT,
    ventas_mensuales_promedio INT,
    tiempo_entrega_dias INT
);

-- Datos de prueba (Seed data)
INSERT INTO productos (nombre, stock_actual, ventas_mensuales_promedio, tiempo_entrega_dias) 
VALUES 
('Teclado Mecánico', 50, 120, 5),
('Monitor 144hz', 10, 30, 15),
('Mouse Gamer', 200, 150, 3);
