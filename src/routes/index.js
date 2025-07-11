const express = require("express");
const router = express.Router();

const usuariosRoutes = require("./usuariosRoutes");
const authRoutes = require("./authRoutes");

router.use("/usuarios", usuariosRoutes);
router.use("/", authRoutes); // rota: POST /api/login

module.exports = router;
