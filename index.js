const express = require('express');
const app = express();
const exphbr = require('express-handlebars');

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
  const title = 'Welcome to Index Handlebars'
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
