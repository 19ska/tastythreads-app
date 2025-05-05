const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const { uploadToS3 } = require('../services/s3Service');

// Add a new restaurant with menuPhotos (uploaded to S3)
const addRestaurant = async (req, res) => {
  try {
    const { name, overview, location, priceRange, cuisine } = req.body;
    const files = req.files || [];

    const uploadResults = await Promise.all(files.map((file) => uploadToS3(file)));
    const menuPhotos = uploadResults.map((result) => result.Location);

    const newRestaurant = new Restaurant({
      name,
      overview,
      menuPhotos,
      location,
      priceRange,
      cuisine,
    });

    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant added', restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ message: 'Error adding restaurant', error: err.message });
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
  }
};

// Get single restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};

// Get threads for a restaurant
const getThreads = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant.threads || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching threads", error: err.message });
  }
};

// Add a new thread to a restaurant
const addThread = async (req, res) => {
  try {
    const { post, user } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToS3(req.file);
      imageUrl = result.Location;
    }

    const newThread = {
      post,
      user,
      imageUrl,
      replies: [],
    };

    restaurant.threads.unshift(newThread);
    await restaurant.save();
    res.status(201).json(restaurant.threads[0]);
  } catch (err) {
    res.status(500).json({ message: "Error adding thread", error: err.message });
  }
};

// Add a reply to a thread
const addReply = async (req, res) => {
  try {
    const { reply, user } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
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

module.exports = {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  getThreads,
  addThread,
  addReply,
};
