import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import RestaurantCard from "../components/RestaurantCard";
import TabMenu from "../components/TabMenu";
import "./Dashboard.css";
import dummyRestaurants from "../data/DummyRestaurants";


const Dashboard = () => {
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
  }, [navigate]);

  const filtered = dummyRestaurants.filter(
    (r) => selectedTab === "Recommended" || r.category === selectedTab
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <span className="welcome-text">Welcome, {userEmail}</span>
        <button>Add Restaurant</button>
        <input placeholder="Search..." />
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Browse restaurants </h2>
      <TabMenu selected={selectedTab} setSelected={setSelectedTab} />

      <div className="card-grid">
        {filtered.map((r) => (
          <RestaurantCard
            key={r.id}
            name={r.name}
            image={r.image}
            description={r.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;