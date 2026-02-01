const sqlite3 = require('sqlite3').verbose();

// Use o nome 'database.db' que é o que já aparece na sua pasta do VS Code
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error("Erro ao abrir banco:", err.message);
    else console.log("Conectado ao SQLite com sucesso!");
});

// Criando a tabela com a coluna 'nome' e 'email' como UNIQUE
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    )`);
});

module.exports = db;