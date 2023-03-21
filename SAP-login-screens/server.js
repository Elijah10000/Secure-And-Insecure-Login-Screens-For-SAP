const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcryptjs = require('bcryptjs');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Welcome to my login page!');
});

app.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Check if user exists in database
    const user = await User.findOne({
        email
    });
    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    // Compare password with hash stored in database
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid email or password');
    }

    // Set session cookie and redirect to home page
    req.session.user = user;
    res.redirect('/');
});

app.get('/dashboard', (req, res) => {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // User is authenticated, render the dashboard page
  res.render('dashboard', { user: req.session.user });
});


app.listen(port, () => {
    console.log(`Server is listening on port ${3000}.`);
});