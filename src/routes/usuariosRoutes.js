const express = require("express");
const router = express.Router();

// Imports
const {
  criarUsuario,
  rotaRestrita,
  editarUsuario,
  excluirUsuario,
  listarUsuarios,
  redefinirSenha,
} = require("../controllers/usuariosController");
const autenticarToken = require("../middlewares/auth");
const autorizarAdminOuSupervisor = require("../middlewares/autorizarAdminOuSupervisor");

// Rotas
router.post("/", autenticarToken, autorizarAdminOuSupervisor, criarUsuario);
router.put("/:id", autenticarToken, autorizarAdminOuSupervisor, editarUsuario);
router.delete(
  "/:id",
  autenticarToken,
  autorizarAdminOuSupervisor,
  excluirUsuario
);
router.put(
  "/:id/redefinir-senha",
  autenticarToken,
  autorizarAdminOuSupervisor,
  redefinirSenha
);
router.get("/", autenticarToken, listarUsuarios);
router.get("/restrito", autenticarToken, rotaRestrita);

module.exports = router;
