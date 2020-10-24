const express = require('express');

const buildOptions = require('../middlewares/get-options');
const productParser = require('../middlewares/product-parser');
const applyRules = require('../middlewares/apply-rules');

const productController = require('../controllers/product');

const router = express.Router();

router.get(
  '/GetOptions',
  productParser,
  buildOptions,
  productController.getOptions
);

router.post(
  '/GetConfiguredBOM',
  productParser,
  applyRules,
  productController.getConfiguredBOM
);

module.exports = router;