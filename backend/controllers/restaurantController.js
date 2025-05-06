const mongoose = require("mongoose");
const geolib = require("geolib");
const { uploadToS3 } = require("../services/s3Service");

// ----- Schemas -----
const ReplySchema = new mongoose.Schema({
  reply: String,
  user: String,
  createdAt: { type: Date, default: Date.now },
});

const ThreadSchema = new mongoose.Schema({
  post: String,
  user: String,
  imageUrl: String,
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now },
});

if (!mongoose.models.Restaurant) {
  const RestaurantSchema = new mongoose.Schema({
    name: String,
    overview: String,
    menuPhotos: [String],
    location: String,
    priceRange: String,
    cuisine: String,
    lat: Number,
    lon: Number,
    menu: [String],
    threads: [ThreadSchema],
  });

  mongoose.model("Restaurant", RestaurantSchema);
}

const Restaurant = mongoose.model("Restaurant");

// ----- Controllers -----
const addRestaurant = async (req, res) => {
  try {
    const { name, overview, location, priceRange, cuisine, lat, lon } = req.body;
    const files = req.files || [];

    const uploadResults = await Promise.all(files.map((file) => uploadToS3(file)));
    const menuPhotos = uploadResults.map((result) => result.Location);

    const newRestaurant = new Restaurant({
      name,
      overview,
      location,
      priceRange,
      cuisine,
      lat,
      lon,
      menuPhotos,
      menu: [],
      threads: [],
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant added", restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ message: "Error adding restaurant", error: err.message });
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
        return distance <= 5000; // 5km radius
      });
    }

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurants", error: err.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", error: err.message });
  }
};

const getThreads = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant.threads || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching threads", error: err.message });
  }
};

const addThread = async (req, res) => {
  try {
    console.log("📥 New thread POST request received");
    const { post, user } = req.body;

    if (!post || !user) {
      return res.status(400).json({ message: "'post' and 'user' are required" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    let imageUrl = null;
    if (req.file) {
      try {
        const result = await uploadToS3(req.file);
        imageUrl = result.Location;
      } catch (uploadErr) {
        console.error("S3 upload failed:", uploadErr);
        return res.status(500).json({ message: "S3 Upload Failed", error: uploadErr.message });
      }
    }

    const newThread = {
      post,
      user,
      imageUrl,
      replies: [],
      createdAt: new Date(),
    };

    restaurant.threads.unshift(newThread);
    await restaurant.save();

    res.status(201).json(restaurant.threads[0]);
  } catch (err) {
    console.error("❌ Error in addThread:", err);
    res.status(500).json({ message: "Error adding thread", error: err.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { reply, user } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const thread = restaurant.threads.id(req.params.threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    const newReply = { reply, user };
    thread.replies.push(newReply);

    await restaurant.save();
    res.status(201).json(newReply);
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
