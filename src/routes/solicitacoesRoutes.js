const express = require("express");
const router = express.Router();

const { criarSolicitacao } = require("../controllers/solicitacoesController");
const autenticarToken = require("../middlewares/auth");

router.post("/", autenticarToken, criarSolicitacao);

module.exports = router;
