const express = require("express");
const router = express.Router();

const usuariosRoutes = require("./usuariosRoutes");
const authRoutes = require("./authRoutes");
const solicitacoesRoutes = require("./solicitacoesRoutes");

// Rota usuários
router.use("/usuarios", usuariosRoutes);
router.use("/", authRoutes); // rota: POST /api/login

// Rota complementos
router.use("/solicitacoes", solicitacoesRoutes);

module.exports = router;
