const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overview: String,
  menuPhotos: [String],  // store image URLs (from S3, Cloudinary, etc.)
  location: String,
  priceRange: String,
  cuisine: String,
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
