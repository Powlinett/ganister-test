const express = require('express');

const optionsController = require('../controllers/options');

const router = express.Router();

router.get('/GetOptions', optionsController.getOptions);

router.post('/GetConfiguredBOM', optionsController.getConfiguredBOM);

module.exports = router;