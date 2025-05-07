const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  getThreads,
  addThread,
  addReply
} = require("../controllers/restaurantController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getRestaurants);
router.post('/add-restaurant', upload.array('menuPhotos'), addRestaurant);
router.get("/:id", getRestaurantById);


router.get("/:id/threads", getThreads);
router.post("/:id/threads", upload.single("image"), addThread);
router.post("/:id/threads/:threadId/replies", addReply);

module.exports = router;
