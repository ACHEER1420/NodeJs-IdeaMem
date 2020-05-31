const express = require('express');
const exphbr = require('express-handlebars');
const moongoose = require('mongoose');

const app = express();

// Connect to mongoose
moongoose
  .connect('mongodb://localhost/ideas-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

const _PORT = 5000;

app.listen(_PORT, () => {
  console.log(`Server started on PORT ${_PORT}`);
});
