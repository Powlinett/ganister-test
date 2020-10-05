const dataReader = require('../utils/data-reader');

exports.getOptions = async (req, res, next) => {
  const options = await dataReader.parseOptionsJSON();
  res.status(200).json({ options: options });
};

exports.getConfiguredBOM = (req, res, next) => {

};