# TastyThreads 🍔

A Reddit-style food discussion app built with **Node.js**, **Express**, **MongoDB**, and **React** (frontend coming soon).

## 🚀 Features (Planned)
- User login/signup
- Browse restaurants by city (e.g., San Jose)
- Create one thread per restaurant
- Ask questions, answer others, upload food pictures
- Add restaurants, menus, and descriptions

## 🔧 Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)
- Authentication: JWT
- Dev Tools: Nodemon, dotenv

## 📂 Project Structure
tastythreads/
├── models/          # Mongoose schemas
├── routes/          # API route handlers
├── controllers/     # Logic for routes
├── middleware/      # Auth and others
├── server.js        # Main server file
├── .env             # Environment variables (not committed)
├── README.md        # You’re reading it!

## 🛠️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/YOUR_USERNAME/tastythreads-backend.git
cd tastythreads
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```
Create a file named .env in the root directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Run the server
```bash
npm run dev
```
