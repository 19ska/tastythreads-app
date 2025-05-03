// === server.js ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port from env
const PORT = process.env.PORT || 4000;

// Debug: Confirm MONGO_URI is being read
console.log("🔍 Mongo URI:", process.env.MONGO_URI);

// MongoDB Connection (cleaned, no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample Health Route
app.get("/", (req, res) => {
  res.send("🍔 TastyThreads API is running...");
});

// Import and Mount Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Add other routes as needed
// const threadRoutes = require('./routes/thread.routes');
// const postRoutes = require('./routes/post.routes');
// const commentRoutes = require('./routes/comment.routes');
// app.use('/api/threads', threadRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
