const express = require("express");
const router = express.Router();

const {
  criarUsuario,
  rotaRestrita,
  editarUsuario,
  excluirUsuario,
  listarUsuarios,
} = require("../controllers/usuariosController");

const autenticarToken = require("../middlewares/auth");
const autorizarAdminOuSupervisor = require("../middlewares/autorizarAdminOuSupervisor");

router.post("/", autenticarToken, autorizarAdminOuSupervisor, criarUsuario);
router.put("/:id", autenticarToken, autorizarAdminOuSupervisor, editarUsuario);
router.delete(
  "/:id",
  autenticarToken,
  autorizarAdminOuSupervisor,
  excluirUsuario
);
router.get("/", autenticarToken, listarUsuarios);

router.get("/restrito", autenticarToken, rotaRestrita);

module.exports = router;
