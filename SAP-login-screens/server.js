const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: 'postgres',
  password: 'password1', // Make sure this is a string
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

pool.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
  return next();
});

app.use(helmet());
app.use(limiter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'my-very-strong-secret-key-that-nobody-can-guess',
  resave: false,
  saveUninitialized: false
}));

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
    }

    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(401).send('Invalid username or password');
        } else {
            const match = await bcrypt.compare(password, result.rows[0].password);

            if (match) {
                res.redirect('/success');
            } else {
                res.status(401).send('Invalid username or password');
            }
        }
    } catch (err) {
        console.error(err);
        
        res.status(500).send('Internal server error');
    }
});


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!password) {
        res.status(400).send('Missing password');
        return;
    }

    // Check if user already exists
    const userExistsQuery = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [username],
    };

    const userExists = await pool.query(userExistsQuery);

    if (userExists.rowCount > 0) {
        res.status(409).send('Username already exists');
        return;
    }

    // Insert new user
    const insertQuery = {
        text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
        values: [username, await bcrypt.hash(password, 10)],
    };

    try {
        await pool.query(insertQuery);
        res.redirect('/success');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}); 

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});