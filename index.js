const express = require('express');
const bodyParser = require('body-parser');

const optionsRoutes = require('./routes/options');

const app = express();

app.use(bodyParser.json());

app.use(optionsRoutes);

try {
  app.listen(3000);
} catch (error) {
  console.log(error);
};