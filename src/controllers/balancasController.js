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

// Rota PUT para editar dados das balanças
async function editarBalanca(req, res) {
  const { id } = req.params;
  const { nome, ip, porta } = req.body;

  try {
    const consulta = await pool.query("SELECT * FROM balancas WHERE id = $1", [
      id,
    ]);

    if (consulta.rows.length === 0) {
      return res.status(404).json({ erro: "Balança não encontrada." });
    }

    const atualizacao = await pool.query(
      `UPDATE balancas
       SET nome = $1, ip = $2, porta = $3
       WHERE id = $4
       RETURNING *`,
      [nome, ip, porta, id]
    );

    res.status(200).json({
      mensagem: "Balança atualizada com sucesso.",
      balanca: atualizacao.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao editar balança:", erro);
    res.status(500).json({ erro: "Erro ao editar balança." });
  }
}

// Rota GET para buscar dados de uma balança específica
async function buscarBalancaPorId(req, res) {
  const { id } = req.params;

  try {
    const resultado = await pool.query("SELECT * FROM balancas WHERE id = $1", [
      id,
    ]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Balança não encontrada." });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar balança:", erro);
    res.status(500).json({ erro: "Erro ao buscar balança." });
  }
}

module.exports = {
  criarBalanca,
  listarBalancas,
  editarBalanca,
  buscarBalancaPorId,
};
