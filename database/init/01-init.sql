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


