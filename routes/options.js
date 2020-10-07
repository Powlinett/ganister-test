const express = require('express');

// const filterElementsMiddleware = require('../middlewares/filter-elements');
const optionsController = require('../controllers/options');

const router = express.Router();

router.get(
  '/GetOptions',
  optionsController.getOptions
);

router.post(
  '/GetConfiguredBOM',
  // filterElementsMiddleware,
  optionsController.getConfiguredBOM
);

module.exports = router;