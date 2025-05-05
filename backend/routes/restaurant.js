const express = require('express');
const router = express.Router();
const {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  getThreads,
  addThread,
  addReply
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.post('/add-restaurant', addRestaurant);
router.get('/:id', getRestaurantById);

// ✅ Add these thread-related routes
router.get('/:id/threads', getThreads);
router.post('/:id/threads', addThread);
router.post('/:id/threads/:threadId/replies', addReply);

module.exports = router;
