require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

// Load routes
const ideasRoutes = require('./src/routes/ideas.routes');
const usersRoutes = require('./src/routes/users.routes');

// Passport config
require('./src/config/passport')(passport);

// DB Config
const db = require('./src/config/database');

// Connect to mongoose
mongoose
  .connect(process.env.db_prod, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected successfully ...'))
  .catch((error) => console.log(error.message));

// Handlebars Middleware
app.engine(
  'handlebars',
  exphbr({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// MethodOverride middleware
app.use(methodOverride('_method'));

// Express-session middleware
app.use(
  session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Page Route
app.get('/', (req, res) => {
  const title = 'Welcome to Index Handlebars';
  res.render('index', {
    title: title,
  });
});

// About Page Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Use routes
app.use('/ideas', ideasRoutes);
app.use('/users', usersRoutes);

const _PORT = process.env.PORT || 5000;

app.listen(_PORT, () => {
  console.log(`Server started on PORT ${_PORT}`);
});

function handleError(item, type) {
  if (item) return false;
  switch (type) {
    case 'title':
      return 'Please add a title';
    case 'details':
      return 'Please add some details';
    default:
      return 'Some errors has occurred';
  }
}
