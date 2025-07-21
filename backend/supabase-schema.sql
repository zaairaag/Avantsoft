-- Avantsoft CRM Database Schema for Supabase
-- Execute this SQL in the Supabase SQL Editor

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Clientes table
CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    nascimento TIMESTAMP WITH TIME ZONE NOT NULL,
    telefone TEXT,
    cpf TEXT UNIQUE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Vendas table
CREATE TABLE IF NOT EXISTS vendas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    valor DECIMAL(10,2) NOT NULL,
    data TIMESTAMP WITH TIME ZONE NOT NULL,
    cliente_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_deleted_at ON clientes(deleted_at);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(data);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendas_updated_at BEFORE UPDATE ON vendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password, name) VALUES 
('admin@loja.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for clientes
INSERT INTO clientes (nome, email, nascimento, telefone, cpf) VALUES 
('Maria Silva Santos', 'maria.silva@email.com', '1990-05-15', '11999999999', '12345678901'),
('João Pedro Oliveira', 'joao.pedro@email.com', '1985-03-20', '11888888888', '98765432100'),
('Ana Carolina Lima', 'ana.carolina@email.com', '1992-08-10', '11777777777', '11122233344'),
('Carlos Eduardo Santos', 'carlos.eduardo@email.com', '1988-12-05', '11666666666', '55566677788'),
('Fernanda Costa Silva', 'fernanda.costa@email.com', '1995-01-25', '11555555555', '99988877766')
ON CONFLICT (email) DO NOTHING;
