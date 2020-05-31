const express = require('express');
const exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/ideas-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected successfully ...'))
  .catch((error) => console.log(error.message));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

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

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to Index Handlebars';
  res.render('index', {
    title: title,
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  const title = req.body.title;
  const details = req.body.details;

  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title,
      details,
    });
  } else {
    const newIdea = {
      title,
      details,
    };
    new Idea(newIdea).save().then((idea) => {
      res.redirect('/ideas');
    });
  }
});

const _PORT = 5000;

app.listen(_PORT, () => {
  console.log(`Server started on PORT ${_PORT}`);
});
