const express = require("express");
const router = express.Router();
const { login, definirSenha } = require("../controllers/authController");
// Bloqueia se o usuário já estiver autenticado
const bloquearSeAutenticado = require("../middlewares/bloquearSeAutenticado");

// Rotas
router.post("/login", login);
router.post("/definir-senha", bloquearSeAutenticado, definirSenha); // Definir nova senha no primeiro login do usuário

module.exports = router;
