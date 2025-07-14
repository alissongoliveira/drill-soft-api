const express = require("express");
const router = express.Router();

const {
  criarSolicitacao,
  aceitarSolicitacao,
  finalizarSolicitacao,
  recusarSolicitacao,
  listarPendentes,
} = require("../controllers/solicitacoesController");
// Valida de gerou token para o usuário logado
const autenticarToken = require("../middlewares/auth");
// Autoriza apenas operador a aceitar, finalizar e recusar solicitações
const autorizarOperador = require("../middlewares/autorizarOperador");

router.post("/", autenticarToken, criarSolicitacao);
router.put(
  "/:id/aceitar",
  autenticarToken,
  autorizarOperador,
  aceitarSolicitacao
);
router.put(
  "/:id/finalizar",
  autenticarToken,
  autorizarOperador,
  finalizarSolicitacao
);
router.put(
  "/:id/recusar",
  autenticarToken,
  autorizarOperador,
  recusarSolicitacao
);
router.get("/pendentes", autenticarToken, listarPendentes);

module.exports = router;
