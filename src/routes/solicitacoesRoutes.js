const express = require("express");
const router = express.Router();

const {
  criarSolicitacao,
  aceitarSolicitacao,
} = require("../controllers/solicitacoesController");
const autenticarToken = require("../middlewares/auth");

router.post("/", autenticarToken, criarSolicitacao);
router.put("/:id/aceitar", autenticarToken, aceitarSolicitacao);

module.exports = router;
