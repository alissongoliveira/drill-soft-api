const express = require("express");
const router = express.Router();

// Importa os módulos
const usuariosRoutes = require("./usuariosRoutes");
const authRoutes = require("./authRoutes");
const solicitacoesRoutes = require("./solicitacoesRoutes");
const balancasRoutes = require("./balancasRoutes");
const relatoriosRoutes = require("./relatoriosRoutes");

// Rota usuários
router.use("/usuarios", usuariosRoutes);
router.use("/", authRoutes); // rota: POST /api/login

// Rota complementos
router.use("/solicitacoes", solicitacoesRoutes);

// Rota de balanças
router.use("/balancas", balancasRoutes);

// Rota de relatórios
router.use("/relatorios", relatoriosRoutes); // rota: GET /api/relatorios - solicitações de complementos

module.exports = router;
