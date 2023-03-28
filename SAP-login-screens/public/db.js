const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'password1', // Make sure this is a string
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

// create a new user
export async function createUser(username, password) {
  // Check if user already exists
  const userExistsQuery = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  };
  const userExists = await pool.query(userExistsQuery);

  if (userExists.rowCount > 0) {
    throw new Error('User already exists');
  }

  // Insert new user
  const createUserQuery = {
    text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
    values: [username, password],
  };
  
  try {
    const res = await pool.query(createUserQuery);
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

module.exports = {
  query: (text, params) => pool.query(text, params),
};

export default {
  createUser,
  getUserByUsername,
};