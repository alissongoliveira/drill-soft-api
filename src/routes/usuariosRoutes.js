const express = require("express");
const router = express.Router();

const {
  criarUsuario,
  rotaRestrita,
  editarUsuario,
} = require("../controllers/usuariosController");

const autenticarToken = require("../middlewares/auth");
const autorizarAdminOuSupervisor = require("../middlewares/autorizarAdminOuSupervisor");

router.post("/", autenticarToken, autorizarAdminOuSupervisor, criarUsuario);
router.put("/:id", autenticarToken, autorizarAdminOuSupervisor, editarUsuario);

router.get("/restrito", autenticarToken, rotaRestrita);

module.exports = router;
