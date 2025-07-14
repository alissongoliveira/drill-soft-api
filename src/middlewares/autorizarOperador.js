// Somente operador poderá aceitar, finalizar ou recusar solicitações
function autorizarOperador(req, res, next) {
  const usuario = req.usuario;

  if (!usuario || usuario.categoria !== "operador") {
    return res.status(403).json({ erro: "Acesso restrito a operadores." });
  }

  next();
}

module.exports = autorizarOperador;
