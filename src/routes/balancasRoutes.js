const express = require("express");
const router = express.Router();

// Imports
const {
  criarBalanca,
  listarBalancas,
  editarBalanca,
} = require("../controllers/balancasController");
const autenticarToken = require("../middlewares/auth");
const autorizarAdminOuSupervisor = require("../middlewares/autorizarAdminOuSupervisor");

// Rotas
router.post("/", autenticarToken, autorizarAdminOuSupervisor, criarBalanca);
router.get("/", autenticarToken, listarBalancas);
router.put("/:id", autenticarToken, autorizarAdminOuSupervisor, editarBalanca);

module.exports = router;
