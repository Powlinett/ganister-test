const fs = require('fs').promises;

const readJSONFile = async (filepath) => {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch(error) {
    console.log(error);
  };
};

module.exports = readJSONFile;