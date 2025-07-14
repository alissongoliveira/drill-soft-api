const express = require("express");
const router = express.Router();

const {
  criarSolicitacao,
  aceitarSolicitacao,
  finalizarSolicitacao,
  recusarSolicitacao,
} = require("../controllers/solicitacoesController");
const autenticarToken = require("../middlewares/auth");

router.post("/", autenticarToken, criarSolicitacao);
router.put("/:id/aceitar", autenticarToken, aceitarSolicitacao);
router.put("/:id/finalizar", autenticarToken, finalizarSolicitacao);
router.put("/:id/recusar", autenticarToken, recusarSolicitacao);

module.exports = router;
