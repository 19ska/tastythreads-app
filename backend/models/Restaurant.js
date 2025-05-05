const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

const ReplySchema = new mongoose.Schema({
  reply: String,
  user: String,
}, { timestamps: true });

const ThreadSchema = new mongoose.Schema({
  post: String,
  user: String,
  replies: [ReplySchema],
}, { timestamps: true });

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overview: String,
  menuPhotos: [String],
  location: String,
  priceRange: String,
  cuisine: String,
  menu: [MenuItemSchema],
  threads: [ThreadSchema]
}, { timestamps: true });

// ✅ FIX: correct variable name
module.exports = mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
