const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST para login de usuários com validação de token JWT
async function login(req, res) {
  const { nome_usuario, senha } = req.body;

  try {
    const query =
      "SELECT * FROM usuarios WHERE nome_usuario = $1 AND excluido_em IS NULL";
    const resultado = await pool.query(query, [nome_usuario]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const usuario = resultado.rows[0];

    if (!usuario.senha) {
      return res.status(403).json({
        status: "senha_nao_definida",
        mensagem: "Este usuário ainda não definiu uma senha.",
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        categoria: usuario.categoria,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      mensagem: "Login bem-sucedido!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario,
        categoria: usuario.categoria,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).json({ erro: "Erro interno no login." });
  }
}

// Rota POST para o usuário definir senha quando não existe uma senha criada
async function definirSenha(req, res) {
  const { nome_usuario, senha } = req.body;

  if (!senha || senha.length < 6) {
    return res
      .status(400)
      .json({ erro: "A senha deve conter no mínimo 6 caracteres." });
  }

  try {
    const consulta = await pool.query(
      "SELECT * FROM usuarios WHERE nome_usuario = $1 AND excluido_em IS NULL",
      [nome_usuario]
    );

    if (consulta.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const usuario = consulta.rows[0];

    if (usuario.senha) {
      return res
        .status(400)
        .json({ erro: "Este usuário já possui senha definida." });
    }

    const hash = await bcrypt.hash(senha, 10);

    await pool.query(
      "UPDATE usuarios SET senha = $1, atualizado_em = NOW() WHERE id = $2",
      [hash, usuario.id]
    );

    res
      .status(200)
      .json({ mensagem: "Senha definida com sucesso. Faça login agora." });
  } catch (erro) {
    console.error("Erro ao definir senha:", erro);
    res.status(500).json({ erro: "Erro interno ao definir senha." });
  }
}

module.exports = {
  login,
  definirSenha,
};
