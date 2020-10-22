const dataParser = require('../utils/data-reader');

const buildBOM = async (req, res, next) => {
  try {
    const product = await dataParser('./data/sampleBOM.json');
    req.product = product;
    next();
  } catch(err) {
    console.log(err);
  }
};

module.exports = buildBOM;