

const personName = 'Alice';

try {
  const result = await session.run(
    'CREATE (a:Person {name: $name}) RETURN a',
    { name: personName }
  );

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);
} finally {
  await session.close();
}

// on application exit:
await driver.close();