const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const saltRounds = 10;
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
  //   ssl: {
//     rejectUnauthorized: false
//   }
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


// app.get('/', (req, res) => {
//   res.send('Welcome to my login page!');
// });

app.get('/test', (req, res) => {
    res.send('Welcome to my login page!');
  });


// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
//       if (result.rows.length === 0) {
//         return res.status(401).send('Invalid username or password');
//       }
  
//       const user = result.rows[0];
  
//       const passwordMatch = await bcrypt.compare(password, user.password);
  
//       if (!passwordMatch) {
//         return res.status(401).send('Invalid username or password');
//       }
  
//       req.session.user = user;
//       res.redirect('/dashboard');
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal server error');
//     }
//   });

//   app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'signup.html'));
//   });
  
//   app.post('/signup', async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const confirmPassword = req.body['confirm-password'];
  
//     if (password !== confirmPassword) {
//       res.send('Passwords do not match');
//       return;
//     }
  
//     try {
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
//       await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
//       res.redirect('/success.html');
//     } catch (error) {
//       console.error(error);
//       res.sendStatus(500);
//     }
//   });
  
//   app.get('/dashboard', (req, res) => {
//     if (!req.session.user) {
//       return res.redirect('/');
//     }
  
//     res.send(`Welcome ${req.session.user.username}!`);
//   });
  
//   app.post('/login/authenticate', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
//       if (result.rows.length === 0) {
//         return res.status(401).send('Invalid username or password');
//       }
  
//       const user = result.rows[0];
  
//       const passwordMatch = await bcrypt.compare(password, user.password);
  
//       if (!passwordMatch) {
//         return res.status(401).send('Invalid username or password');
//       }
  
//       res.status(200).send('success');
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal server error');
//     }
//   });

//   app.get('/dashboard', (req, res) => {
//     const user = req.session.user;
  
//     if (!user) {
//       return res.status(401).send('You need to log in to see this page');
//     }
  
//     res.render('dashboard', {
//       user
//     });
//   });
  
//   app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
//   });
  


// const app = express();
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'password1',
//     port: 5432
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    // console.log(req.body)

    // res.status(200).json({"data": {username, password}});
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(401).send('Invalid username or password');
        } else {
            const match = await bcrypt.compare(password, result.rows[0].password);

            if (match) {
                res.redirect('/success.html');
            } else {
                res.status(401).send('Invalid username or password');
            }
        }
    } catch (err) {
        // console.error(err);
        
        res.status(500).send('Internal server error');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, hashedPassword];

    try {
        await pool.query(query, values);
        res.redirect('/success.html');
    } catch (err) {
        // console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});