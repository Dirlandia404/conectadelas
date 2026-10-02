import pg from "pg";

const { Pool } = pg;

export class PostgresOpportunityStore {
  constructor(connectionString, { ssl = false } = {}) {
    this.pool = new Pool({
      connectionString,
      ssl: ssl ? { rejectUnauthorized: false } : false
    });
  }

  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS oportunidades (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        titulo TEXT NOT NULL,
        instituicao TEXT NOT NULL,
        descricao TEXT NOT NULL,
        modalidade TEXT NOT NULL,
        link TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )
    `);
  }

  #map(row) {
    return {
      id: row.id,
      titulo: row.titulo,
      instituicao: row.instituicao,
      descricao: row.descricao,
      modalidade: row.modalidade,
      link: row.link,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async list() {
    const { rows } = await this.pool.query("SELECT * FROM oportunidades ORDER BY id DESC");
    return rows.map((row) => this.#map(row));
  }

  async findById(id) {
    const { rows } = await this.pool.query("SELECT * FROM oportunidades WHERE id = $1", [id]);
    return rows[0] ? this.#map(rows[0]) : null;
  }

  async create(dados) {
    const valores = [dados.titulo, dados.instituicao, dados.descricao, dados.modalidade, dados.link];
    const { rows } = await this.pool.query(
      `INSERT INTO oportunidades (titulo, instituicao, descricao, modalidade, link)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      valores
    );
    return this.#map(rows[0]);
  }

  async update(id, dados) {
    const atual = await this.findById(id);
    if (!atual) return null;

    const completo = { ...atual, ...dados };
    const valores = [
      completo.titulo,
      completo.instituicao,
      completo.descricao,
      completo.modalidade,
      completo.link,
      id
    ];
    const { rows } = await this.pool.query(
      `UPDATE oportunidades
       SET titulo = $1, instituicao = $2, descricao = $3, modalidade = $4,
           link = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      valores
    );
    return this.#map(rows[0]);
  }

  async delete(id) {
    const resultado = await this.pool.query("DELETE FROM oportunidades WHERE id = $1", [id]);
    return resultado.rowCount > 0;
  }

  async close() {
    await this.pool.end();
  }
}
