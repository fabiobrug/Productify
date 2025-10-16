-- Inicialização do banco de dados Productify
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS productify;

-- Definir search_path para o schema
SET search_path TO productify, public;

-- Comentário sobre o banco
COMMENT ON DATABASE productify IS 'Database for Productify application - Product Management System';

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO products (name, price, description) VALUES
    ('Produto Exemplo 1', 29.99, 'Descrição do produto exemplo 1'),
    ('Produto Exemplo 2', 49.99, 'Descrição do produto exemplo 2'),
    ('Produto Exemplo 3', 19.99, 'Descrição do produto exemplo 3')
ON CONFLICT DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE products IS 'Tabela de produtos do sistema';
COMMENT ON TABLE orders IS 'Tabela de pedidos do sistema';
COMMENT ON COLUMN products.name IS 'Nome do produto';
COMMENT ON COLUMN products.price IS 'Preço do produto';
COMMENT ON COLUMN products.description IS 'Descrição do produto';
COMMENT ON COLUMN orders.items IS 'Itens do pedido em formato JSON';
COMMENT ON COLUMN orders.total_amount IS 'Valor total do pedido';
COMMENT ON COLUMN orders.status IS 'Status do pedido (pending, confirmed, cancelled)';