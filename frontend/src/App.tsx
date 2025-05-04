import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddRestaurant from "./pages/AddRestaurant";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>TastyThreads Frontend</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />

      </Routes>
    </Router>
  );
}

export default App;