const express = require('express');
const app = express();

// Index Route
app.get('/', (req, res) => {
  res.send('INDEX');
});

// About Route
app.get('/about', (req, res) => {
  res.send('ABOUT');
});

const _PORT = 5000;

app.listen(_PORT, () => {
  console.log(`Server started on PORT ${_PORT}`);
});
