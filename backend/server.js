//npm install bcryptjs cookie-parser cors dotenv express mongoose nodemon express-session connect-mongo
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Initial setup and middleware
mongoose.connect('mongodb://localhost:27017/Memories')
  .then(() => console.log('Connected to Database'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 2000;
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma'
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Session setup with secure settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultFallbackSecret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 120000 * 60,
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  })
}));

// Middleware to refresh session expiration
app.use((req, next) => {
  if (req.session) req.session.touch();
  next();
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).send({ msg: 'Not Authenticated' });
}

// Login route
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  const findUser = mockusers.find(user => user.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: 'Bad Credentials' });
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).send('Error regenerating session');
    req.session.userId = findUser.id;
    res.status(200).send(findUser);
  });
});

// Auth status route
app.get('/api/auth/status', isAuthenticated, (req, res) => {
  const findUser = mockusers.find(user => user.id === req.session.userId);
  if (!findUser) return res.status(404).send('User not found');
  res.status(200).send(findUser);
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid');
    res.send('Logged out');
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server is now running on port PORT`));