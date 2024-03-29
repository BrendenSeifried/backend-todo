const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  name;
  completed;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.completed = row.completed;
    this.user_id = row.user_id;
  }

  static async insert({ name, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (name, user_id) VALUES ($1, $2) RETURNING *`,
      [name, user_id]
    );
    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `SELECT * FROM todos WHERE user_id = $1`,
      [user_id]
    );
    return rows.map((data) => new Todo(data));
  }

  static async getById(id) {
    const { rows } = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async updateById(id, info) {
    const data = await Todo.getById(id);
    if (!data) return null;
    const { name, completed } = { ...data, ...info };
    const { rows } = await pool.query(
      `UPDATE todos SET name=$2, completed=$3 WHERE id=$1 RETURNING *`,
      [id, name, completed]
    );
    return new Todo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM todos WHERE id = $1 RETURNING *`,
      [id]
    );
    return new Todo(rows[0]);
  }
};
