const Restaurant = require('../models/Restaurant');
const { uploadToS3 } = require('../services/s3Service');
const geolib = require('geolib');

const addRestaurant = async (req, res) => {
    try {
        const { name, overview, location, priceRange, cuisine, lat, lon } = req.body;
        const files = req.files || [];

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
            lat,  // ✅ new
            lon   // ✅ new
        });

        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant added', restaurant: newRestaurant });
    } catch (err) {
        res.status(500).json({ message: 'Error adding restaurant', error: err.message });
    }
};

const getRestaurants = async (req, res) => {
    try {
        const userLat = req.query.lat ? parseFloat(req.query.lat) : null;
        const userLon = req.query.lon ? parseFloat(req.query.lon) : null;

        let restaurants = await Restaurant.find();

        if (userLat && userLon) {
            restaurants = restaurants.filter((r) => {
                if (!r.lat || !r.lon) return false;
                const distance = geolib.getDistance(
                    { latitude: userLat, longitude: userLon },
                    { latitude: r.lat, longitude: r.lon }
                );
                return distance <= 5000;
            });
        }

        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
    }
};

module.exports = { addRestaurant, getRestaurants };
