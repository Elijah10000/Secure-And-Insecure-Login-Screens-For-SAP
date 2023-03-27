// import { Pool } from 'pg';
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
  };


  export const query = {
    text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
    values: [username, password],
  };
// create a new user
export async function createUser(username, password) {
  try {
    const res = await pool.query(query);
    console.log(`User ${username} created`);
  } catch (err) {
    console.error(err.stack);
  }
}

// get a user by username
export async function getUserByUsername(username) {
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  };

  try {
    const res = await pool.query(query);
    return res.rows[0];
  } catch (err) {
    console.error(err.stack);
  }
}

export default {
  createUser,
  getUserByUsername,
};