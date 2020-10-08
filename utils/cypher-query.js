const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

const dataReader = require('./data-reader');

dotenv.config();

const uri = process.env.DB_URI;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
const session = driver.session();

const query = async () => { 
  const product = await dataReader('data/sampleBOM.json');

  await session.run(
  `WITH $product AS product
  MERGE (p:Product { name: product.name })
  SET p.rules = product.rules
    
  WITH p, product
  
  UNWIND $product.components AS component
  MERGE (c:Component { id: component.id })
  FOREACH ( _ IN CASE WHEN component.option = true THEN[1] ELSE [] END |
    SET c:Component:Option)
  FOREACH (variant IN component.variants |
    MERGE (cv:Variant {id: variant.id })
    MERGE (cv)-[:IS_VARIANT_OF]->(c)
    SET cv = { id: variant.id, name: variant.name })
  MERGE (c)-[:IS_PART_OF]->(p)
  SET c = { id: component.id, name: component.name, rules: component.rules }

  WITH c, component, product
  UNWIND component.components AS childComponent
  MERGE (cc:Component { id: childComponent.id })
  MERGE (cc)-[:IS_PART_OF]->(c)
  SET cc = { id: childComponent.id, name: childComponent.name, rules: childComponent.rules }

  WITH cc, childComponent, c, component, product
  UNWIND childComponent.variants AS variant
  MERGE(v:Variant { id: variant.id })
  MERGE (v)-[:IS_VARIANT_OF]->(cc)
  SET v = { id: variant.id, name: variant.name }
  `,
  {
    product: product
  }
)};

module.exports = query;