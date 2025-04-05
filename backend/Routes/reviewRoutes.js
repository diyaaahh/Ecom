const express= require('express');
const { rateProduct, getAverageRating } = require('../Controllers/reviewControllers');
const router = express.Router();

router.post('/add', rateProduct);
router.get('/average',getAverageRating );

module.exports= router;