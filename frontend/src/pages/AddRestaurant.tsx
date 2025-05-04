import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRestaurant.css";

const AddRestaurant = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    menuPhotos: [],
    location: "",
    priceRange: "",
    cuisine: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, menuPhotos: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('overview', formData.overview);
    uploadData.append('location', formData.location);
    uploadData.append('priceRange', formData.priceRange);
    uploadData.append('cuisine', formData.cuisine);

    formData.menuPhotos.forEach((file) => {
        uploadData.append('menuPhotos', file);
    });
  
    try {
      const response = await fetch('http://localhost:4000/api/restaurants/add-restaurant', {
        method: 'POST',
        body: uploadData,
      });
  
      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert('Failed to add restaurant');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      <form className="restaurant-form" onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" />

        <textarea name="overview" value={formData.overview} onChange={handleChange} placeholder="Enter overview" rows={4} />

        <input type="file" name="menuPhotos" multiple onChange={handleFileChange} />

        <input name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" />

        <input name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="Enter price range" />

        <input name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="Enter cuisine" />

        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
