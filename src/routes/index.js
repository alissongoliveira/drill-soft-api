const express = require("express");
const router = express.Router();

// Importa os módulos
const usuariosRoutes = require("./usuariosRoutes");
const authRoutes = require("./authRoutes");
const solicitacoesRoutes = require("./solicitacoesRoutes");
const balancasRoutes = require("./balancasRoutes");
const relatoriosRoutes = require("./relatoriosRoutes");
const operadorRoutes = require("./operadorRoutes");

// Rota usuários
router.use("/usuarios", usuariosRoutes);
router.use("/", authRoutes); // rota: POST /api/login

// Rota operador (sem autenticação por senha)
router.use("/operador", operadorRoutes); // POST /api/operador/login-simples

// Rota complementos
router.use("/solicitacoes", solicitacoesRoutes);

// Rota de balanças
router.use("/balancas", balancasRoutes);

// Rota de relatórios
router.use("/relatorios", relatoriosRoutes);

module.exports = router;
