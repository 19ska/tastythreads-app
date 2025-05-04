import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import RestaurantCard from "../components/RestaurantCard";
import TabMenu from "../components/TabMenu";
import "./Dashboard.css";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);

  const [userEmail, setUserEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Recommended");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.email || "User");
    } catch {
      navigate("/login");
    }

    //Fetch restaurants
    fetch("http://localhost:4000/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Failed to fetch restaurants", err));

  }, [navigate]);

  const filtered = restaurants;

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

      <h2>Browse restaurants </h2>
      <TabMenu selected={selectedTab} setSelected={setSelectedTab} />

      <div className="card-grid">
        {filtered.map((r) => (
          <RestaurantCard
            key={r._id}  // use MongoDB ID
            name={r.name}
            image={r.menuPhotos && r.menuPhotos.length > 0 ? r.menuPhotos[0] : undefined}
            description={r.overview}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;