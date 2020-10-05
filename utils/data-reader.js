const fs = require('fs').promises;

exports.parseOptionsJSON = async () => {
  try {
    const data = await fs.readFile('data/availableOptions.json', 'utf8');
    return JSON.parse(data);
  } catch(error) {
    console.log(error);
  };
};