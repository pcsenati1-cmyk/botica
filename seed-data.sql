-- --------------------------------------------------------
-- SEED DATA PARA LA BASE DE DATOS `BOTICA`
-- 6 Registros mínimos por tabla
-- --------------------------------------------------------

-- 1. Insertar Categorías (6 registros)
INSERT INTO categorias (nombre, descripcion, estado) VALUES
('Analgésicos', 'Medicamentos para aliviar el dolor', true),
('Antibióticos', 'Medicamentos para infecciones bacterianas', true),
('Antiácidos', 'Medicamentos para la acidez estomacal', true),
('Antihistamínicos', 'Tratamiento para alergias y resfriados', true),
('Cuidado Personal', 'Productos de higiene y cuidado personal', true),
('Vitaminas', 'Suplementos vitamínicos y minerales', true);

-- 2. Insertar Proveedores (6 registros)
INSERT INTO proveedores (razon_social, ruc, contacto, telefono, email, direccion, estado) VALUES
('Farmax S.A.C.', '20123456789', 'Juan Carlos', '987654321', 'ventas@farmax.pe', 'Av. Las Palmeras 123, Lima', true),
('Droguería INTI', '20987654321', 'Ana María', '999888777', 'contacto@inti.pe', 'Calle Los Pinos 456, Arequipa', true),
('Laboratorios Silva', '20456123789', 'Luis Silva', '911222333', 'ventas@labsilva.com', 'Av. Brasil 789, Lima', true),
('Distribuidora Medica Sur', '20789456123', 'Carlos Ruiz', '944555666', 'info@medicasur.pe', 'Av. Ejército 101, Tacna', true),
('Salud Peruana S.A.', '20555666777', 'María Pía', '922333444', 'ventas@saludperuana.com', 'Jr. Unión 202, Cusco', true),
('InkaFarma Distribuidores', '20333444555', 'Pedro Gomez', '977888999', 'logistica@inkadist.pe', 'Av. Arequipa 303, Lima', true);

-- 3. Insertar Usuarios (6 registros) - auth_id como NULL para datos de prueba iniciales
INSERT INTO usuarios (nombres, apellidos, rol, dni, telefono, email, estado) VALUES
('Admin', 'Principal', 'ADMIN', '11111111', '987654321', 'admin@botica.com', true),
('María', 'Gomez', 'CAJERO', '22222222', '912345678', 'maria.caja@botica.com', true),
('Jorge', 'López', 'FARMACEUTICO', '33333333', '934567890', 'jorge.farma@botica.com', true),
('Ana', 'Torres', 'CAJERO', '44444444', '945678901', 'ana.caja@botica.com', true),
('Carlos', 'Mendoza', 'CAJERO', '55555555', '956789012', 'carlos.caja@botica.com', true),
('Lucía', 'Ramirez', 'FARMACEUTICO', '66666666', '967890123', 'lucia.farma@botica.com', true);

-- 4. Insertar Productos (6 registros)
-- Asumiendo IDs 1-6 de categorías y proveedores insertados arriba
INSERT INTO productos (codigo_barras, nombre, descripcion, categoria_id, proveedor_id, precio, precio_compra, stock, stock_minimo, fecha_vencimiento, registro_sanitario, receta_obligatoria, laboratorio, estado) VALUES
('775123450001', 'Paracetamol 500mg', 'Blister de 10 pastillas', 1, 1, 2.50, 1.00, 100, 20, '2026-12-31', 'RS-1234', false, 'Farmax', true),
('775123450002', 'Amoxicilina 500mg', 'Caja de 50 cápsulas', 2, 2, 15.00, 8.00, 50, 10, '2025-10-15', 'RS-5678', true, 'INTI', true),
('775123450003', 'Sal de Andrews', 'Sobre efervescente', 3, 3, 1.50, 0.80, 200, 50, '2027-01-01', 'RS-9012', false, 'Bayer', true),
('775123450004', 'Cetirizina 10mg', 'Blister de 10 pastillas', 4, 1, 3.00, 1.50, 80, 15, '2026-05-20', 'RS-3456', false, 'Farmax', true),
('775123450005', 'Shampoo H&S 400ml', 'Shampoo anticaspa', 5, 4, 18.00, 12.00, 30, 5, '2028-11-30', 'NSO-1234', false, 'P&G', true),
('775123450006', 'Vitamina C 1000mg', 'Frasco de 100 tabletas', 6, 5, 25.00, 15.00, 40, 10, '2026-08-30', 'RS-7890', false, 'Salud Peruana', true);

-- 5. Insertar Cabecera de Ventas (6 registros)
INSERT INTO ventas (usuario_id, tipo_comprobante, numero_comprobante, subtotal, igv, total, metodo_pago, estado) VALUES
(2, 'BOLETA', 'B001-00000001', 2.12, 0.38, 2.50, 'EFECTIVO', 'COMPLETADA'),
(2, 'TICKET', 'T001-00000001', 12.71, 2.29, 15.00, 'YAPE', 'COMPLETADA'),
(4, 'FACTURA', 'F001-00000001', 21.19, 3.81, 25.00, 'TARJETA', 'COMPLETADA'),
(4, 'BOLETA', 'B001-00000002', 3.81, 0.69, 4.50, 'EFECTIVO', 'COMPLETADA'),
(5, 'TICKET', 'T001-00000002', 15.25, 2.75, 18.00, 'PLIN', 'COMPLETADA'),
(5, 'BOLETA', 'B001-00000003', 16.95, 3.05, 20.00, 'EFECTIVO', 'COMPLETADA');

-- 6. Insertar Detalle de Ventas (6 registros)
-- (Disparará el trigger de restar stock)
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal, descuento) VALUES
(1, 1, 1, 2.50, 2.50, 0),
(2, 2, 1, 15.00, 15.00, 0),
(3, 6, 1, 25.00, 25.00, 0),
(4, 3, 1, 1.50, 1.50, 0),
(4, 4, 1, 3.00, 3.00, 0),
(5, 5, 1, 18.00, 18.00, 0),
(6, 1, 2, 2.50, 5.00, 0),
(6, 2, 1, 15.00, 15.00, 0);

-- 7. Insertar Cabecera de Compras (6 registros)
INSERT INTO compras (proveedor_id, usuario_id, numero_comprobante, total, estado) VALUES
(1, 1, 'F001-999001', 100.00, 'COMPLETADA'),
(2, 1, 'F002-888002', 80.00, 'COMPLETADA'),
(3, 1, 'F003-777003', 40.00, 'COMPLETADA'),
(4, 1, 'F004-666004', 120.00, 'COMPLETADA'),
(5, 1, 'F005-555005', 150.00, 'COMPLETADA'),
(6, 1, 'F006-444006', 200.00, 'COMPLETADA');

-- 8. Insertar Detalle de Compras (6 registros)
-- (Disparará el trigger de sumar stock)
INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_compra, lote, fecha_vencimiento, subtotal) VALUES
(1, 1, 100, 1.00, 'LOTE-101', '2026-12-31', 100.00),
(2, 2, 10, 8.00, 'LOTE-102', '2025-10-15', 80.00),
(3, 3, 50, 0.80, 'LOTE-103', '2027-01-01', 40.00),
(4, 5, 10, 12.00, 'LOTE-104', '2028-11-30', 120.00),
(5, 6, 10, 15.00, 'LOTE-105', '2026-08-30', 150.00),
(6, 4, 100, 1.50, 'LOTE-106', '2026-05-20', 150.00),
(6, 1, 50, 1.00, 'LOTE-107', '2026-12-31', 50.00);

-- 9. Insertar Cajas / Movimientos (6 registros)
INSERT INTO caja_movimientos (usuario_id, tipo_movimiento, monto, concepto) VALUES
(2, 'APERTURA', 100.00, 'Apertura de caja turno mañana'),
(2, 'INGRESO', 15.00, 'Venta al contado (Ticket T001-00000001)'),
(2, 'EGRESO', 20.00, 'Pago proveedor de agua (Bidón)'),
(2, 'INGRESO', 2.50, 'Venta al contado (Boleta B001-00000001)'),
(2, 'CIERRE', 97.50, 'Cierre de caja turno mañana'),
(4, 'APERTURA', 100.00, 'Apertura de caja turno tarde');
