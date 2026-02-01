import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao banco
const db = new sqlite3.Database('./database.db');

// Garantimos que a tabela e as novas colunas existem
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT, 
        email TEXT UNIQUE, 
        senha TEXT
    )`);

    // Tentamos adicionar as colunas de recuperação (ignora erro se já existirem)
    db.run("ALTER TABLE usuarios ADD COLUMN resetToken TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("Nota: Coluna resetToken já existe ou erro ignorado.");
        }
    });
    db.run("ALTER TABLE usuarios ADD COLUMN resetExpira INTEGER", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.log("Nota: Coluna resetExpira já existe ou erro ignorado.");
        }
    });
});

// Configuração do Transportador de E-mail (Exemplo com Gmail)
// Para usar o Gmail, você precisa gerar uma "Senha de App" nas configurações da sua conta Google
// Configuração do Transportador de E-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint de Cadastro
app.post('/api/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
            }
            return res.status(500).json({ mensagem: "Erro interno: " + err.message });
        }
        res.status(200).json({
            mensagem: "Cadastro realizado com sucesso!",
            user: { id: this.lastID, nome, email, role: 'user' }
        });
    });
});

// Endpoint de Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
        if (err) return res.status(500).json({ mensagem: "Erro no banco: " + err.message });
        if (row) {
            res.status(200).json({
                mensagem: "Login realizado!",
                user: { id: row.id, nome: row.nome, email: row.email, role: 'user' }
            });
        } else {
            res.status(401).json({ mensagem: "E-mail ou senha incorretos!" });
        }
    });
});

// Endpoint de Recuperação de Senha (ENVIO REAL)
app.post('/api/recuperar-senha', (req, res) => {
    const { email } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ mensagem: "Erro no banco: " + err.message });

        if (!row) {
            return res.status(404).json({ mensagem: "E-mail não encontrado no sistema." });
        }

        // Gerar Token Único e Expiração (1 hora)
        const token = crypto.randomBytes(20).toString('hex');
        const expira = Date.now() + 3600000;

        // Salvar token no banco
        db.run("UPDATE usuarios SET resetToken = ?, resetExpira = ? WHERE email = ?", [token, expira, email], (updateErr) => {
            if (updateErr) return res.status(500).json({ mensagem: "Erro ao salvar token: " + updateErr.message });

            // Link que o usuário clicará (ajuste o domínio se necessário)
            const link = `http://localhost:3000/redefinir-senha?token=${token}`;

            const mailOptions = {
                from: `e-Xpress <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Recuperação de Senha - e-Xpress',
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2>Olá, ${row.nome}!</h2>
                        <p>Você solicitou a redefinição de senha para sua conta no <b>e-Xpress</b>.</p>
                        <p>Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
                        <a href="${link}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Minha Senha</a>
                        <p>Se você não solicitou isso, ignore este e-mail.</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (mailErr) => {
                if (mailErr) {
                    console.error("ERRO AO ENVIAR E-MAIL:", mailErr.message);

                    // Fallback para ambiente de desenvolvimento: exibe no terminal
                    if (process.env.NODE_ENV === 'development') {
                        console.log("-----------------------------------------");
                        console.log("MODO DE DESENVOLVIMENTO: LINK GERADO ABAIXO");
                        console.log("Link de Recuperação para", email, ":");
                        console.log(link);
                        console.log("-----------------------------------------");

                        return res.status(200).json({
                            mensagem: "E-mail não pôde ser enviado, mas o link foi gerado no terminal para teste.",
                            devLink: link
                        });
                    }

                    return res.status(500).json({ mensagem: "Erro ao enviar o e-mail de recuperação." });
                }

                console.log(`Link de recuperação enviado com sucesso para: ${email}`);
                res.status(200).json({ mensagem: "Link de recuperação enviado para o e-mail informado!" });
            });
        });
    });
});

// Endpoint para Redefinir a Senha usando o Token
app.post('/api/redefinir-senha', (req, res) => {
    const { token, novaSenha } = req.body;

    db.get("SELECT * FROM usuarios WHERE resetToken = ? AND resetExpira > ?", [token, Date.now()], (err, row) => {
        if (err) return res.status(500).json({ mensagem: "Erro no banco: " + err.message });

        if (!row) {
            return res.status(400).json({ mensagem: "Token inválido ou expirado." });
        }

        // Atualiza a senha e limpa o token
        db.run("UPDATE usuarios SET senha = ?, resetToken = NULL, resetExpira = NULL WHERE id = ?", [novaSenha, row.id], (updateErr) => {
            if (updateErr) return res.status(500).json({ mensagem: "Erro ao atualizar senha: " + updateErr.message });
            res.status(200).json({ mensagem: "Senha redefinida com sucesso!" });
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));