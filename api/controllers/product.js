exports.getOptions = async (req, res, next) => {
  res.status(200).json(req.options);
};

exports.getConfiguredBOM = (req, res, next) => {
  res.status(200).json(req.BOM);
};