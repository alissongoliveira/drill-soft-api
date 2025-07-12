// Verifica se o usuário logado e um supervisor ou administrador
function autorizarAdminOuSupervisor(req, res, next) {
  const usuario = req.usuario;

  if (
    !usuario ||
    (usuario.categoria !== "administrador" &&
      usuario.categoria !== "supervisor")
  ) {
    return res
      .status(403)
      .json({ erro: "Acesso negado. Permissão insuficiente." });
  }

  next();
}

module.exports = autorizarAdminOuSupervisor;
