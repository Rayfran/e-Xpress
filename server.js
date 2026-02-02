import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Inicialização das tabelas no PostgreSQL (Supabase)
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY, 
                nome TEXT, 
                email TEXT UNIQUE, 
                senha TEXT,
                resetToken TEXT,
                resetExpira BIGINT
            )
        `);
        console.log("Banco de dados verificado.");
    } catch (err) {
        console.error("Erro ao inicializar banco:", err.message);
    }
};
initDB();

// Configuração do Transportador de E-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint de Cadastro
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
            [nome, email, senha]
        );
        res.status(200).json({
            mensagem: "Cadastro realizado com sucesso!",
            user: { id: result.rows[0].id, nome, email, role: 'user' }
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
        }
        res.status(500).json({ mensagem: "Erro interno: " + err.message });
    }
});

// Endpoint de Login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
            [email, senha]
        );
        if (result.rows.length > 0) {
            const row = result.rows[0];
            res.status(200).json({
                mensagem: "Login realizado!",
                user: { id: row.id, nome: row.nome, email: row.email, role: 'user' }
            });
        } else {
            res.status(401).json({ mensagem: "E-mail ou senha incorretos!" });
        }
    } catch (err) {
        res.status(500).json({ mensagem: "Erro no banco: " + err.message });
    }
});

// Endpoint de Recuperação de Senha
app.post('/api/recuperar-senha', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: "E-mail não encontrado no sistema." });
        }

        const row = result.rows[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expira = Date.now() + 3600000;

        await pool.query(
            "UPDATE usuarios SET resetToken = $1, resetExpira = $2 WHERE email = $3",
            [token, expira, email]
        );

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
                if (process.env.NODE_ENV === 'development') {
                    return res.status(200).json({
                        mensagem: "E-mail não pôde ser enviado, mas o link foi gerado no terminal para teste.",
                        devLink: link
                    });
                }
                return res.status(500).json({ mensagem: "Erro ao enviar o e-mail de recuperação." });
            }
            res.status(200).json({ mensagem: "Link de recuperação enviado para o e-mail informado!" });
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro no banco: " + err.message });
    }
});

// Endpoint para Redefinir a Senha
app.post('/api/redefinir-senha', async (req, res) => {
    const { token, novaSenha } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE resetToken = $1 AND resetExpira > $2",
            [token, Date.now()]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ mensagem: "Token inválido ou expirado." });
        }

        const row = result.rows[0];
        await pool.query(
            "UPDATE usuarios SET senha = $1, resetToken = NULL, resetExpira = NULL WHERE id = $2",
            [novaSenha, row.id]
        );
        res.status(200).json({ mensagem: "Senha redefinida com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro no banco: " + err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));