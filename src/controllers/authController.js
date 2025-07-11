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
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

module.exports = { login };
