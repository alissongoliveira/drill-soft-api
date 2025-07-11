const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
const routes = require("./routes");
app.use("/api", routes);

module.exports = app;
