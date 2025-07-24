const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Rota POST para login de operador
async function loginSimplesOperador(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ erro: "ID do operador é obrigatório." });
  }

  try {
    const resultado = await pool.query(
      "SELECT id, nome, nome_usuario, categoria FROM usuarios WHERE id = $1 AND categoria = 'operador' AND excluido_em IS NULL",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Operador não encontrado." });
    }

    const operador = resultado.rows[0];

    const token = jwt.sign(operador, process.env.JWT_SECRET, {
      expiresIn: "8h", // tempo de expeiração
    });

    res.status(200).json({ token, operador });
  } catch (erro) {
    console.error("Erro no login simples:", erro);
    res.status(500).json({ erro: "Erro interno ao autenticar operador." });
  }
}

module.exports = { loginSimplesOperador };
