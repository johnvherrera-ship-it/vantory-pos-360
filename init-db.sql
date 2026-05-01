-- Crear tabla de inventario
CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    cantidad_minima INTEGER DEFAULT 5,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    proveedor VARCHAR(255),
    fecha_creado TIMESTAMP DEFAULT NOW(),
    fecha_actualizado TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de historial de ventas
CREATE TABLE IF NOT EXISTS historial_ventas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES inventario(id),
    cantidad_vendida INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2),
    total_venta DECIMAL(10, 2),
    fecha_venta TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de alertas de inventario
CREATE TABLE IF NOT EXISTS alertas_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES inventario(id),
    tipo_alerta VARCHAR(50), -- 'stock_bajo', 'stock_insuficiente'
    mensaje TEXT,
    fecha_alerta TIMESTAMP DEFAULT NOW(),
    resuelta BOOLEAN DEFAULT FALSE
);

-- Insertar datos de ejemplo
INSERT INTO inventario (nombre_producto, sku, cantidad, precio, categoria, proveedor) VALUES
    ('Cerveza Corona', 'SKU001', 50, 15.99, 'Bebidas', 'Distribuidor A'),
    ('Cerveza Heineken', 'SKU002', 35, 18.99, 'Bebidas', 'Distribuidor A'),
    ('Ron Bacardi', 'SKU003', 20, 25.50, 'Licores', 'Distribuidor B'),
    ('Vodka Smirnoff', 'SKU004', 15, 22.00, 'Licores', 'Distribuidor B'),
    ('Jugo Naranja', 'SKU005', 100, 3.50, 'Bebidas', 'Distribuidor C'),
    ('Refresco Coca Cola', 'SKU006', 75, 2.99, 'Bebidas', 'Distribuidor C'),
    ('Hielo (bolsa)', 'SKU007', 40, 1.50, 'Insumos', 'Distribuidor D'),
    ('Vasos Desechables (100)', 'SKU008', 25, 5.00, 'Insumos', 'Distribuidor D');

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_inventario_sku ON inventario(sku);
CREATE INDEX IF NOT EXISTS idx_inventario_categoria ON inventario(categoria);
CREATE INDEX IF NOT EXISTS idx_historial_producto ON historial_ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_alertas_producto ON alertas_inventario(producto_id);

-- Crear vista para alertas activas
CREATE OR REPLACE VIEW alertas_activas AS
SELECT
    a.id,
    i.id as producto_id,
    i.nombre_producto,
    i.cantidad,
    i.cantidad_minima,
    a.tipo_alerta,
    a.mensaje,
    a.fecha_alerta
FROM alertas_inventario a
JOIN inventario i ON a.producto_id = i.id
WHERE a.resuelta = FALSE
ORDER BY a.fecha_alerta DESC;

-- Crear función para registrar en historial
CREATE OR REPLACE FUNCTION registrar_venta(
    p_producto_id INTEGER,
    p_cantidad_vendida INTEGER
)
RETURNS TABLE (
    producto_id INTEGER,
    nombre_producto VARCHAR,
    stock_anterior INTEGER,
    stock_nuevo INTEGER,
    total_venta DECIMAL
) AS $$
DECLARE
    v_stock_anterior INTEGER;
    v_stock_nuevo INTEGER;
    v_precio DECIMAL;
    v_nombre VARCHAR;
BEGIN
    -- Obtener stock actual y precio
    SELECT cantidad, precio, nombre_producto INTO v_stock_anterior, v_precio, v_nombre
    FROM inventario
    WHERE id = p_producto_id;

    -- Validar
    IF v_stock_anterior IS NULL THEN
        RAISE EXCEPTION 'Producto no encontrado';
    END IF;

    IF v_stock_anterior < p_cantidad_vendida THEN
        RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', v_stock_anterior, p_cantidad_vendida;
    END IF;

    -- Calcular nuevo stock
    v_stock_nuevo := v_stock_anterior - p_cantidad_vendida;

    -- Actualizar inventario
    UPDATE inventario
    SET cantidad = v_stock_nuevo, fecha_actualizado = NOW()
    WHERE id = p_producto_id;

    -- Registrar en historial
    INSERT INTO historial_ventas (producto_id, cantidad_vendida, stock_anterior, stock_nuevo, precio_unitario, total_venta)
    VALUES (p_producto_id, p_cantidad_vendida, v_stock_anterior, v_stock_nuevo, v_precio, p_cantidad_vendida * v_precio);

    -- Retornar resultado
    RETURN QUERY SELECT p_producto_id, v_nombre, v_stock_anterior, v_stock_nuevo, p_cantidad_vendida * v_precio;
END;
$$ LANGUAGE plpgsql;
