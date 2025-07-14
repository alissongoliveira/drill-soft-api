const express = require("express");
const router = express.Router();

// Importa os módulos
const usuariosRoutes = require("./usuariosRoutes");
const authRoutes = require("./authRoutes");
const solicitacoesRoutes = require("./solicitacoesRoutes");
const balancasRoutes = require("./balancasRoutes");

// Rota usuários
router.use("/usuarios", usuariosRoutes);
router.use("/", authRoutes); // rota: POST /api/login

// Rota complementos
router.use("/solicitacoes", solicitacoesRoutes);

// Rota de balanças
router.use("/balancas", balancasRoutes);

module.exports = router;
