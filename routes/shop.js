const path = require('path');

const productsController = require('../controllers/produts')

const express = require('express');

const router = express.Router();


router.get('/shop', productsController.getProducts);

module.exports = router;
