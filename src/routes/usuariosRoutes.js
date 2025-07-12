const express = require("express");
const router = express.Router();
const {
  criarUsuario,
  rotaRestrita,
} = require("../controllers/usuariosController");
const autenticarToken = require("../middlewares/auth");

router.post("/", criarUsuario);
router.get("/restrito", autenticarToken, rotaRestrita);

module.exports = router;
