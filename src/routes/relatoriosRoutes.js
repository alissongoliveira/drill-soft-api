const express = require("express");
const router = express.Router();

// Imports
const {
  relatorioSolicitacoes,
} = require("../controllers/relatoriosController");
const autenticarToken = require("../middlewares/auth");

// Rota
router.get("/solicitacoes", autenticarToken, relatorioSolicitacoes);

module.exports = router;
