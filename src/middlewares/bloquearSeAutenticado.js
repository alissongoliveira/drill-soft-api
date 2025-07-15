const jwt = require("jsonwebtoken");

// Bloqueia a criação de nova senha caso o usuário esteja logado
function bloquearSeAutenticado(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(); // se não tiver token, segue (permitido)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Se token válido, bloqueia
    return res.status(403).json({
      erro: "Usuários autenticados não podem acessar esta rota.",
    });
  } catch {
    return next(); // token inválido (segue normalmente)
  }
}

module.exports = bloquearSeAutenticado;
