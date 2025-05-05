const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Make sure this file exists

const {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  getThreads,
  addThread,
  addReply
} = require('../controllers/restaurantController');

// Routes
router.get('/', getRestaurants);
router.post('/add-restaurant', addRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/threads', getThreads);
router.post('/:id/threads', upload.single("image"), addThread);
router.post('/:id/threads/:threadId/replies', addReply);

module.exports = router;
