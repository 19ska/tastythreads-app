import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import "./AddRestaurant.css";

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    menuPhotos: [] as File[],
    location: "",
    priceRange: "",
    cuisine: "",
    lat: "",
    lon: ""
  });

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "location") {
      fetchLocations(value);
    }
  };

  const fetchLocations = debounce(async (query) => {
    if (!query) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, 500);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, menuPhotos: Array.from(e.target.files) });
    }
  };

  const handleSelectSuggestion = (place: any) => {
    setFormData({
      ...formData,
      location: place.display_name,
      lat: place.lat,
      lon: place.lon
    });
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("overview", formData.overview);
    formDataObj.append("location", formData.location);
    formDataObj.append("priceRange", formData.priceRange);
    formDataObj.append("cuisine", formData.cuisine);
    formDataObj.append("lat", formData.lat);
    formDataObj.append("lon", formData.lon);
    formData.menuPhotos.forEach((file) => {
      formDataObj.append("menuPhotos", file);
    });

    try {
      const response = await fetch("http://localhost:4000/api/restaurants/add-restaurant", {
        method: "POST",
        body: formDataObj,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('add rest: ',response);
      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Failed to add restaurant");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      <form className="restaurant-form" onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" />
        <textarea name="overview" value={formData.overview} onChange={handleChange} placeholder="Enter overview" rows={4} />
        <input type="file" name="menuPhotos" multiple onChange={handleFileChange} />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            style={{ width: "100%" }}
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
                listStyle: "none"
              }}
            >
              {locationSuggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelectSuggestion(place)}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderBottom: "1px solid #eee"
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="Enter price range" />
        <input name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="Enter cuisine" />
        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
