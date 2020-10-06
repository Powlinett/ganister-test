const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

const optionsRoutes = require('./routes/options');

const app = express();

app.use(bodyParser.json());

app.use(optionsRoutes);

const uri = 'neo4j://localhost';
const driver = neo4j.driver(uri, neo4j.auth.basic('username', 'password'));
const session = driver.session();

(async () => {
  try {
    const result = await session.run(
      'CREATE (a:Person {name: $name}) RETURN a',
      { name: 'popo' }
    );

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.name);

    app.listen(3000);
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  };
})();