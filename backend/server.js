const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const awsServerlessExpress = require('aws-serverless-express');

const restaurantRoutes = require('./routes/restaurant');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("TastyThreads API is running...");
});

// Routes
app.use('/api', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

// ===== Replace .listen() with Lambda handler =====
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

// if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
//   const server = awsServerlessExpress.createServer(app);
//   exports.handler = (event, context) => {
//     awsServerlessExpress.proxy(server, event, context);
//   };
// } else {
//   const PORT = process.env.PORT || 4000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

