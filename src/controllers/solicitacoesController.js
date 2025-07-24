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

// Rota PUT para alterar o status da solicitação para "aceito"
async function aceitarSolicitacao(req, res) {
  const { id } = req.params;
  const usuario = req.usuario;

  try {
    // Verifica se existe e está pendente
    const consulta = await pool.query(
      "SELECT * FROM solicitacao_complemento WHERE id = $1 AND status = $2",
      [id, "pendente"]
    );

    if (consulta.rows.length === 0) {
      return res
        .status(400)
        .json({ erro: "Solicitação não encontrada ou já tratada." });
    }

    // Atualiza para aceito
    const update = await pool.query(
      `UPDATE solicitacao_complemento
       SET status = 'aceito',
           data_aceitacao = NOW(),
           hora_aceitacao = CURRENT_TIME,
           aceito_por = $1
       WHERE id = $2
       RETURNING *;`,
      [usuario.id, id]
    );

    res.status(200).json({
      mensagem: "Solicitação aceita com sucesso.",
      solicitacao: update.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao aceitar solicitação:", erro);
    res.status(500).json({ erro: "Erro interno ao aceitar solicitação." });
  }
}

// Rota PUT para atualizar o status da solicitação para "finalizado"
async function finalizarSolicitacao(req, res) {
  const { id } = req.params;
  const { peso_finalizado } = req.body;
  const usuario = req.usuario;

  if (!peso_finalizado || isNaN(peso_finalizado)) {
    return res
      .status(400)
      .json({ erro: "Peso finalizado inválido ou ausente." });
  }

  try {
    // Verifica se a solicitação existe e já foi aceita
    const consulta = await pool.query(
      "SELECT * FROM solicitacao_complemento WHERE id = $1 AND status = $2",
      [id, "aceito"]
    );

    if (consulta.rows.length === 0) {
      return res
        .status(400)
        .json({ erro: "Solicitação não encontrada ou ainda não aceita." });
    }

    const update = await pool.query(
      `UPDATE solicitacao_complemento
       SET status = 'finalizado',
           peso_finalizado = $1,
           data_finalizacao = NOW(),
           hora_finalizacao = CURRENT_TIME,
           finalizado_por = $2
       WHERE id = $3
       RETURNING *;`,
      [peso_finalizado, usuario.id, id]
    );

    res.status(200).json({
      mensagem: "Solicitação finalizada com sucesso.",
      solicitacao: update.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao finalizar solicitação:", erro);
    res.status(500).json({ erro: "Erro interno ao finalizar solicitação." });
  }
}

// Rota PUT para atualizar o status da solicitação para "recusado"
async function recusarSolicitacao(req, res) {
  const { id } = req.params;
  const usuario = req.usuario;

  try {
    // Verifica se a solicitação está pendente
    const consulta = await pool.query(
      "SELECT * FROM solicitacao_complemento WHERE id = $1 AND status = $2",
      [id, "pendente"]
    );

    if (consulta.rows.length === 0) {
      return res
        .status(400)
        .json({ erro: "Solicitação não encontrada ou já tratada." });
    }

    const update = await pool.query(
      `UPDATE solicitacao_complemento
       SET status = 'recusado',
           data_rejeicao = NOW(),
           hora_rejeicao = CURRENT_TIME,
           rejeitado_por = $1
       WHERE id = $2
       RETURNING *;`,
      [usuario.id, id]
    );

    res.status(200).json({
      mensagem: "Solicitação recusada com sucesso.",
      solicitacao: update.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao recusar solicitação:", erro);
    res.status(500).json({ erro: "Erro interno ao recusar solicitação." });
  }
}

// Rota GET para listar solicitações com status "pendente"
async function listarPendentes(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM solicitacao_complemento
      WHERE status = 'pendente'
      ORDER BY data_solicitacao DESC, hora_solicitacao DESC
    `);

    res.status(200).json({
      total: resultado.rows.length,
      solicitacoes: resultado.rows,
    });
  } catch (erro) {
    console.error("Erro ao listar solicitações pendentes:", erro);
    res.status(500).json({ erro: "Erro ao buscar solicitações pendentes." });
  }
}

// Rota GET para listar todas as solicitações com JOINs
async function listarTodasSolicitacoes(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT 
        s.id,
        s.placa,
        s.status,
        s.tara,
        s.liquido,
        s.peso_desejado,
        s.peso_finalizado,
        s.data_solicitacao,
        s.hora_solicitacao,
        s.data_aceitacao,
        s.hora_aceitacao,
        s.data_finalizacao,
        s.hora_finalizacao,
        s.data_rejeicao,
        s.hora_rejeicao,
        b.nome AS nome_balanca,
        us.nome AS nome_solicitante,
        uf.nome AS nome_finalizador,
        ua.nome AS nome_aceitador,
        ur.nome AS nome_rejeitador
      FROM solicitacao_complemento s
      LEFT JOIN balancas b ON b.id = s.balanca
      LEFT JOIN usuarios us ON us.id = s.solicitado_por
      LEFT JOIN usuarios uf ON uf.id = s.finalizado_por
      LEFT JOIN usuarios ua ON ua.id = s.aceito_por
      LEFT JOIN usuarios ur ON ur.id = s.rejeitado_por
      ORDER BY s.data_solicitacao DESC, s.hora_solicitacao DESC
    `);

    res.status(200).json({
      total: resultado.rows.length,
      solicitacoes: resultado.rows,
    });
  } catch (erro) {
    console.error("Erro ao listar todas as solicitações:", erro);
    res.status(500).json({ erro: "Erro ao buscar todas as solicitações." });
  }
}

module.exports = {
  criarSolicitacao,
  aceitarSolicitacao,
  finalizarSolicitacao,
  recusarSolicitacao,
  listarPendentes,
  listarTodasSolicitacoes,
};
