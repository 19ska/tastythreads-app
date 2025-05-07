import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import debounce from "lodash.debounce";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    location: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "location") {
      fetchLocations(value);
    }
  };

  const fetchLocations = debounce(async (query: string) => {
    if (!query) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
      );
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, 500); // debounce 500ms

  const handleSelectSuggestion = (place: any) => {
    setFormData({ ...formData, location: place.display_name });
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("res data:", data);

      if (data.user) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", data.user.fullName);
        alert("Registration successful!");
        navigate("/login"); // Redirect here
      } else {
        alert(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="title">TastyThreads</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          {/* Location input + suggestions */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            {locationSuggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #ccc",
                  maxHeight: "150px",
                  overflowY: "auto",
                  zIndex: 1000,
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {locationSuggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelectSuggestion(place)}
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="footer">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;