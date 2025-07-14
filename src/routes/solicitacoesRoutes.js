const express = require("express");
const router = express.Router();

const {
  criarSolicitacao,
  aceitarSolicitacao,
  finalizarSolicitacao,
} = require("../controllers/solicitacoesController");
const autenticarToken = require("../middlewares/auth");

router.post("/", autenticarToken, criarSolicitacao);
router.put("/:id/aceitar", autenticarToken, aceitarSolicitacao);
router.put("/:id/finalizar", autenticarToken, finalizarSolicitacao);

module.exports = router;
