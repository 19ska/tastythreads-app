const Restaurant = require('../models/Restaurant');
const { uploadToS3 } = require('../services/s3Service');

const addRestaurant = async (req, res) => {
    try {
      const { name, overview, location, priceRange, cuisine } = req.body;
      const files = req.files;
  
      const uploadResults = await Promise.all(
        files.map((file) => uploadToS3(file))
      );
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

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
  }
};

module.exports = { addRestaurant, getRestaurants };
