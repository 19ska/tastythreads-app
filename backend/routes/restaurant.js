const express = require('express');
const router = express.Router();
const { addRestaurant, getRestaurants } = require('../controllers/restaurantController');
const upload = require('../middlewares/upload');

router.get('/', getRestaurants);
router.post('/add-restaurant', upload.array('menuPhotos'), addRestaurant);

module.exports = router;
