const express = require("express");
const router = express.Router();
const { loginSimplesOperador } = require("../controllers/operadorController");

router.post("/login-simples", loginSimplesOperador);

module.exports = router;
