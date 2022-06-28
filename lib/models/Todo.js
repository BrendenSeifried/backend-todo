const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  name;
  complete;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.complete = row.complete;
    this.user_id = row.user_id;
  }

  static async insert({ name, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (name, user_id) VALUES ($1, $2) RETURNING *`,
      [name, user_id]
    );
    return new Todo(rows[0]);
  }
};
