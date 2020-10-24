const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv');

const optionsRoutes = require('./routes/options');

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(optionsRoutes);

(() => {
  try {
    app.listen(3000);
  } catch (error) {
    console.log(error);
  };
})();