const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

const dataReader = require('./utils/data-reader');
const cypherQuery = require('./utils/cypher-query');
const optionsRoutes = require('./routes/options');

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(optionsRoutes);

const uri = process.env.DB_URI;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
const session = driver.session();

(async () => {
  try {
    cypherQuery();

    app.listen(3000);
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  };
})();