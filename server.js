const port = 4000


require('dotenv').config();
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('The server is running!');
});

// adjust the following:
app.listen(port, () => {
  console.log(`Your secret is ${process.env.SECRET_PASSWORD}`);
});

