const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImageToS3 } = require("../utils/s3service");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/:restaurantId/threads", upload.single("image"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { post, user } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadImageToS3(req.file);
      imageUrl = result.Location;
    }

    const thread = {
      _id: Date.now().toString(),
      post,
      user,
      imageUrl,
      replies: [],
    };

    // Save to your DB or in-memory store
    res.status(201).json(thread);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});
