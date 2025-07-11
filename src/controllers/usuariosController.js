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

module.exports = { criarUsuario };
