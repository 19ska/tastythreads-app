const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

// Define schemas for embedded threads and replies
const ReplySchema = new mongoose.Schema({
  reply: String,
  user: String,
  createdAt: { type: Date, default: Date.now },
});

const ThreadSchema = new mongoose.Schema({
  post: String,
  user: String,
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now },
});

// Make sure Restaurant model is only compiled once
if (!mongoose.models.Restaurant) {
  const RestaurantSchema = new mongoose.Schema({
    name: String,
    overview: String,
    menuPhotos: [String],
    location: String,
    priceRange: String,
    cuisine: String,
    menu: [String],
    threads: [ThreadSchema],
  });

  mongoose.model("Restaurant", RestaurantSchema);
}

// Reference the compiled model
const RestaurantModel = mongoose.model("Restaurant");

// POST /api/restaurants/add-restaurant
const addRestaurant = async (req, res) => {
  try {
    const { name, overview, location, priceRange, cuisine } = req.body;
    const menuPhotos = req.body.menuPhotos || [];

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }

    const newRestaurant = new RestaurantModel({
      name,
      overview,
      menuPhotos,
      location,
      priceRange,
      cuisine,
      menu: [],
      threads: [],
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ message: "Error adding restaurant", error: err.message });
  }
};

// GET /api/restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurants", error: err.message });
  }
};

// GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  console.log("Fetching restaurant with ID:", req.params.id);
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};

// GET /api/restaurants/:id/threads
const getThreads = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant.threads || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching threads", error: err.message });
  }
};

// POST /api/restaurants/:id/threads
const addThread = async (req, res) => {
  try {
    const { post, user } = req.body;
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const newThread = { post, user, replies: [] };
    restaurant.threads.unshift(newThread);
    await restaurant.save();
    res.status(201).json(restaurant.threads[0]);
  } catch (err) {
    res.status(500).json({ message: "Error adding thread", error: err.message });
  }
};

// POST /api/restaurants/:id/threads/:threadId/replies
const addReply = async (req, res) => {
  try {
    const { reply, user } = req.body;
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const thread = restaurant.threads.id(req.params.threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    thread.replies.push({ reply, user });
    await restaurant.save();
    res.status(201).json(thread.replies[thread.replies.length - 1]);
  } catch (err) {
    res.status(500).json({ message: "Error adding reply", error: err.message });
  }
};

// Export all controller functions
module.exports = {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  getThreads,
  addThread,
  addReply,
};
