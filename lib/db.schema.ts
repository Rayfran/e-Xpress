
/**
 * Esquema de banco de dados industrial.db (SQLite)
 * 
 * Este arquivo contém as definições SQL para o backend.
 */

export const SQL_SCHEMA = `
-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    papel TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (Mercado Livre Like)
CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    imagem_url TEXT,
    categoria TEXT,
    vendedor_id TEXT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
);

-- Tabela de Serviços (GetNinjas Like)
CREATE TABLE IF NOT EXISTS servicos (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    especialidade TEXT NOT NULL,
    preco_hora REAL,
    prestador_id TEXT,
    status TEXT DEFAULT 'ativo',
    FOREIGN KEY (prestador_id) REFERENCES usuarios(id)
);

-- Tabela de Entregas (Loggi Like)
CREATE TABLE IF NOT EXISTS entregas (
    id TEXT PRIMARY KEY,
    origem TEXT NOT NULL,
    destino TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    codigo_rastreio TEXT UNIQUE,
    solicitante_id TEXT,
    nfc_tag_id TEXT, -- ID para monitoramento via NFC mencionado no prompt
    FOREIGN KEY (solicitante_id) REFERENCES usuarios(id)
);
`;
