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

// Add Idea Form page
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process Add Idea Form Route
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

app.get('/ideas', async (req, res) => {
  // Idea.find({})
  //   .sort({ date: 'desc' })
  //   .then((ideas) => {
  //     res.render('ideas/index', {
  //       ideas: ideas.map((idea) => idea.toJSON()),
  //     });
  //   });

  const ideas = await Idea.find({});
  if (!ideas) return;
  ideas.sort((a, b) => a.data - b.date);
  const ideaJSON = ideas.map((idea) => idea.toJSON());

  res.render('ideas/index', {
    ideas: ideaJSON,
  });
});

const _PORT = 5000;

app.listen(_PORT, () => {
  console.log(`Server started on PORT ${_PORT}`);
});
