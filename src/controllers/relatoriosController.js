const pool = require("../config/db");

// Rota GET para buscar relatórios de solicitações
async function relatorioSolicitacoes(req, res) {
  const {
    status,
    data_inicio,
    data_fim,
    placa,
    operador_id,
    page = 1,
    limit = 20,
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const filtros = [];
  const valores = [];

  if (status) {
    valores.push(status);
    filtros.push(`status = $${valores.length}`);
  }

  if (data_inicio && data_fim) {
    valores.push(data_inicio);
    filtros.push(`data_solicitacao >= $${valores.length}`);
    valores.push(data_fim);
    filtros.push(`data_solicitacao <= $${valores.length}`);
  }

  if (placa) {
    valores.push(`%${placa}%`);
    filtros.push(`placa ILIKE $${valores.length}`);
  }

  if (operador_id) {
    valores.push(operador_id);
    filtros.push(
      `(aceito_por = $${valores.length} OR finalizado_por = $${valores.length})`
    );
  }

  const where = filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : "";

  const query = `
    SELECT *
    FROM solicitacao_complemento
    ${where}
    ORDER BY data_solicitacao DESC, hora_solicitacao DESC
    LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}
  `;

  valores.push(limit, offset);

  try {
    const resultado = await pool.query(query, valores);
    res.status(200).json({
      pagina: parseInt(page),
      limite: parseInt(limit),
      total: resultado.rows.length,
      solicitacoes: resultado.rows,
    });
  } catch (erro) {
    console.error("Erro ao gerar relatório:", erro);
    res.status(500).json({ erro: "Erro ao gerar relatório de solicitações." });
  }
}

module.exports = { relatorioSolicitacoes };
