-- Insertar clientes de ejemplo
INSERT INTO cliente (nombre, email, telefono) VALUES
('Juan Pérez', 'juan.perez@example.com', '3101234567'),
('Ana García', 'ana.garcia@example.com', '3209876543');

-- Insertar habitaciones con precios en pesos colombianos
INSERT INTO habitacion (numero, tipo, precio, estado, imagen_url) VALUES
('101', 'Estándar', 150000, 'Disponible', '/images/room-1.jpg'),
('205', 'Suite de Lujo', 350000, 'Ocupada', '/images/room-2.jpg');

-- Crear reservas para las habitaciones y clientes anteriores
-- La primera reserva ya terminó.
INSERT INTO reserva (habitacion_id, cliente_id, fecha_checkin, fecha_checkout, estado) VALUES
(1, 1, '2024-03-10', '2024-03-15', 'Completada');

-- La segunda reserva está activa actualmente.
INSERT INTO reserva (habitacion_id, cliente_id, fecha_checkin, fecha_checkout, estado) VALUES
(2, 2, date('now', '-2 days'), date('now', '+3 days'), 'Confirmada');
