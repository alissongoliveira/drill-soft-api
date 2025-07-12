const jwt = require("jsonwebtoken");

// Função de autenticação de token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token_aqui"

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      return res.status(403).json({ erro: "Token inválido ou expirado." });
    }

    req.usuario = usuario; // Guarda os dados do usuário no request
    next();
  });
}

module.exports = autenticarToken;
