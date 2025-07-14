const pool = require("../config/db");

// Rota POST para criação de solicitação de complemento
async function criarSolicitacao(req, res) {
  const { placa, balanca, tara, liquido, peso_desejado } = req.body;

  const usuario = req.usuario;

  try {
    const query = `
      INSERT INTO solicitacao_complemento
        (placa, balanca, status, tara, liquido, peso_desejado,
         data_solicitacao, hora_solicitacao, solicitado_por)
      VALUES
        ($1, $2, 'pendente', $3, $4, $5, NOW(), CURRENT_TIME, $6)
      RETURNING *;
    `;

    const valores = [placa, balanca, tara, liquido, peso_desejado, usuario.id];

    const resultado = await pool.query(query, valores);

    res.status(201).json({
      mensagem: "Solicitação criada com sucesso.",
      solicitacao: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao criar solicitação:", erro);
    res.status(500).json({ erro: "Erro ao criar solicitação." });
  }
}

module.exports = {
  criarSolicitacao,
};
