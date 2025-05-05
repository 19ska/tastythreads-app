import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TabMenu from "../components/TabMenu";

interface Restaurant {
  _id: string;
  name: string;
  location?: string;
  cuisine?: string;
  priceRange?: string;
  menuPhotos?: string[];
}

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedTab, setSelectedTab] = useState("Recommended");

  useEffect(() => {
    fetch("http://localhost:4000/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Failed to fetch restaurants", err));
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>TastyThreads Dashboard</h1>

      <TabMenu
        selected={selectedTab}
        setSelected={setSelectedTab}
        tabs={["Recommended", "Lunch", "Dinner", "Snacks"]}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {restaurants.map((restaurant) => (
          <Link
            to={`/restaurants/${restaurant._id}`}
            key={restaurant._id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
            >
              {restaurant.menuPhotos?.[0] && (
                <img
                  src={restaurant.menuPhotos[0]}
                  alt={restaurant.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "0.5rem",
                  }}
                />
              )}
              <h3>{restaurant.name}</h3>
              {restaurant.location && <p>📍 {restaurant.location}</p>}
              {restaurant.cuisine && <p>🍽️ {restaurant.cuisine}</p>}
              {restaurant.priceRange && <p>💲 {restaurant.priceRange}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
