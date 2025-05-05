import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import "./Dashboard.css";

type Restaurant = {
  _id: string;
  name: string;
  menuPhotos: string[];
  overview: string;
  // Add other fields if needed
};

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userEmail, setUserEmail] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) setUserEmail(payload.email);
    } catch {
      navigate("/login");
    }

    fetch("http://localhost:4000/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        const validRestaurants = Array.isArray(data)
          ? data.filter(r => r._id && r.name)
          : [];
        setRestaurants(validRestaurants);
      })
      .catch((err) => {
        console.error("Failed to fetch restaurants", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <span className="welcome-text">Welcome, {userEmail}</span>
        <button onClick={() => navigate("/add-restaurant")}>Add Restaurant</button>
        <input placeholder="Search..." />
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Browse Restaurants</h2>
      <div className="card-grid">
        {restaurants.map((r) => (
          <RestaurantCard
            key={r._id}
            _id={r._id}
            name={r.name}
            image={r.menuPhotos?.[0] || "/placeholder.jpg"}  // fallback image
            description={r.overview || "No description available."}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
