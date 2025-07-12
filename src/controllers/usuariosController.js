const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Rota POST para criação de usuários
async function criarUsuario(req, res) {
  const {
    nome,
    nome_usuario,
    cpf,
    categoria, // 'administrador', 'supervisor', 'basico', 'operador'
    senha,
    criado_por,
  } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios
        (nome, nome_usuario, cpf, categoria, senha, criado_em, criado_por)
      VALUES
        ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING id, nome, nome_usuario, categoria;
    `;

    const valores = [nome, nome_usuario, cpf, categoria, hash, criado_por];

    const resultado = await pool.query(query, valores);

    res.status(201).json({
      mensagem: "Usuário criado com sucesso.",
      usuario: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    res.status(500).json({ erro: "Erro ao criar usuário." });
  }
}

// Proteção de rota contra acesso sem token
async function rotaRestrita(req, res) {
  const usuario = req.usuario; // vindo do middleware
  res.status(200).json({
    mensagem: "Você acessou uma rota protegida!",
    usuarioAutenticado: usuario,
  });
}

// Rota PUT para edição de usuários
async function editarUsuario(req, res) {
  const { id } = req.params;
  const { nome, nome_usuario, cpf, categoria, senha, atualizado_por } =
    req.body;

  try {
    // Verifica se usuário existe
    const consulta = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1 AND excluido_em IS NULL",
      [id]
    );
    if (consulta.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    let query;
    let valores;

    if (senha) {
      const hash = await bcrypt.hash(senha, 10);
      query = `
        UPDATE usuarios
        SET nome = $1,
            nome_usuario = $2,
            cpf = $3,
            categoria = $4,
            senha = $5,
            atualizado_em = NOW(),
            atualizado_por = $6
        WHERE id = $7
        RETURNING id, nome, nome_usuario, categoria;
      `;
      valores = [nome, nome_usuario, cpf, categoria, hash, atualizado_por, id];
    } else {
      query = `
        UPDATE usuarios
        SET nome = $1,
            nome_usuario = $2,
            cpf = $3,
            categoria = $4,
            atualizado_em = NOW(),
            atualizado_por = $5
        WHERE id = $6
        RETURNING id, nome, nome_usuario, categoria;
      `;
      valores = [nome, nome_usuario, cpf, categoria, atualizado_por, id];
    }

    const resultado = await pool.query(query, valores);

    res.status(200).json({
      mensagem: "Usuário atualizado com sucesso.",
      usuario: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    res.status(500).json({ erro: "Erro interno ao atualizar usuário." });
  }
}

// Rota DELETE para exclusão de usuários
async function excluirUsuario(req, res) {
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;

  try {
    // Verifica se o usuário existe e ainda não está excluído
    const consulta = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1 AND excluido_em IS NULL",
      [id]
    );

    if (consulta.rows.length === 0) {
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado ou já excluído." });
    }

    await pool.query(
      `UPDATE usuarios
       SET excluido_em = NOW(),
           excluido_por = $1
       WHERE id = $2`,
      [usuarioAutenticado.id, id]
    );

    res
      .status(200)
      .json({ mensagem: "Usuário excluído com sucesso (soft delete)." });
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);
    res.status(500).json({ erro: "Erro interno ao excluir usuário." });
  }
}

// Rota GET para listagem de usuários com paginação e filtro por categoria
async function listarUsuarios(req, res) {
  const { categoria, page = 1, limit = 10 } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const valores = [];
  let filtro = "WHERE excluido_em IS NULL";

  if (categoria) {
    valores.push(categoria);
    filtro += ` AND categoria = $${valores.length}`;
  }

  valores.push(limit, offset);

  const query = `
    SELECT id, nome, nome_usuario, cpf, categoria, criado_em
    FROM usuarios
    ${filtro}
    ORDER BY id
    LIMIT $${valores.length - 1} OFFSET $${valores.length}
  `;

  try {
    const resultado = await pool.query(query, valores);
    res.status(200).json({
      pagina: parseInt(page),
      limite: parseInt(limit),
      total: resultado.rows.length,
      usuarios: resultado.rows,
    });
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
}

module.exports = {
  criarUsuario,
  rotaRestrita,
  editarUsuario,
  excluirUsuario,
  listarUsuarios,
};
