const express = require("express");
const { getPostsByThread } = require("../controllers/postController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/thread/:threadId", verifyToken, getPostsByThread);

module.exports = router;
