const pool = require("../config/db");

// Rota POST para criação de balanças
async function criarBalanca(req, res) {
  const { nome, ip, porta } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO balancas (nome, ip, porta)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, ip, porta]
    );

    res.status(201).json({
      mensagem: "Balança cadastrada com sucesso.",
      balanca: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao cadastrar balança:", erro);
    res.status(500).json({ erro: "Erro ao cadastrar balança." });
  }
}

// Rota GET para listar balanças cadastradas
async function listarBalancas(req, res) {
  try {
    const resultado = await pool.query("SELECT * FROM balancas ORDER BY id");
    res
      .status(200)
      .json({ total: resultado.rows.length, balancas: resultado.rows });
  } catch (erro) {
    console.error("Erro ao listar balanças:", erro);
    res.status(500).json({ erro: "Erro ao buscar balanças." });
  }
}

module.exports = { criarBalanca, listarBalancas };
