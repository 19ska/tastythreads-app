const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: String,
    overview: String,
    menuPhotos: [String],
    location: String,
    priceRange: String,
    cuisine: String,
    lat: String, 
    lon: String, 
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
