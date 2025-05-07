const mongoose = require('mongoose');

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

const RestaurantSchema = new mongoose.Schema({
    name: String,
    overview: String,
    menuPhotos: [String],
    location: String,
    priceRange: String,
    cuisine: String,
    lat: String, 
    lon: String, 
    menu: [MenuItemSchema],
    discussion: [ThreadSchema],
}, { timestamps: true });

module.exports = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);
