import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import RestaurantCard from "../components/RestaurantCard";
import TabMenu from "../components/TabMenu";

type Restaurant = {
  _id: string;
  name: string;
  menuPhotos: string[];
  overview: string;
};

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email || "User");
    } catch {
      navigate("/login");
    }

    const savedLocation = localStorage.getItem("userLocation");
    let url = "https://89iavnnx4e.execute-api.us-west-1.amazonaws.com/dev/api/restaurants";

    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      url += `?lat=${parsed.latitude}&lon=${parsed.longitude}`;
      setUserLocation(parsed);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { latitude, longitude };
          localStorage.setItem("userLocation", JSON.stringify(loc));
          setUserLocation(loc);
          url += `?lat=${latitude}&lon=${longitude}`;
          fetchRestaurants(url);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
      return;
    }

    fetchRestaurants(url);
  }, [navigate]);

  useEffect(() => {
    let url = "https://89iavnnx4e.execute-api.us-west-1.amazonaws.com/dev/api/restaurants";
    if (selectedTab === "Recommended" && userLocation) {
      url += `?lat=${userLocation.latitude}&lon=${userLocation.longitude}`;
    }
    fetchRestaurants(url);
  }, [selectedTab, userLocation]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const fetchRestaurants = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const valid = Array.isArray(data) ? data.filter((r) => r._id && r.name) : [];
        setRestaurants(valid);
        setFilteredRestaurants(valid); // initialize both
      })
      .catch((err) => console.error("Failed to fetch restaurants", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userLocation");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <span className="welcome-text">Welcome, {userEmail}</span>
        <button onClick={() => navigate("/add-restaurant")}>Add Restaurant</button>
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Browse restaurants</h2>
      <TabMenu selected={selectedTab} setSelected={setSelectedTab} />

      <div className="card-grid">
        {filteredRestaurants.map((r) => (
          <RestaurantCard
            key={r._id}
            _id={r._id}
            name={r.name}
            image={r.menuPhotos?.[0] || "/placeholder.jpg"}
            description={r.overview || "No description available"}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;