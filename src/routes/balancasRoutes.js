const express = require("express");
const router = express.Router();

const {
  criarBalanca,
  listarBalancas,
} = require("../controllers/balancasController");
const autenticarToken = require("../middlewares/auth");
const autorizarAdminOuSupervisor = require("../middlewares/autorizarAdminOuSupervisor");

router.post("/", autenticarToken, autorizarAdminOuSupervisor, criarBalanca);
router.get("/", autenticarToken, listarBalancas);

module.exports = router;
