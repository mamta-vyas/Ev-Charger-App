# ⚡ EV Charger Management Backend API

This is the backend API for the EV Charger Management Application. Built using **Node.js**, **Express**, and **MongoDB**, it provides secure user authentication (JWT) and full CRUD functionality for managing electric vehicle (EV) charging stations.

---

## 🚀 Features

- ✅ RESTful API using Express
- ✅ MongoDB for database
- ✅ Charging Station CRUD (Create, Read, Update, Delete)
- ✅ Secure JWT-based Authentication
- ✅ Protected routes for authenticated users
- ✅ Environmental variables using `.env`

---

## 🧱 Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT (JSON Web Token)**
- **dotenv**
- **CORS**

---

## 📦 Project Structure

charging-station-app/
├── config/
│ └── db.js # MongoDB connection setup
├── middleware/
│ └── authMiddleware.js # JWT protection
├── models/
│ ├── User.js # User model
│ └── Charger.js # Charging station model
├── routes/
│ ├── authRoutes.js # Signup & Login APIs
│ └── chargerRoutes.js # CRUD APIs for chargers
├── .env # Environment variables (excluded from Git)
├── server.js # Main Express server
└── package.json


---

## 🔐 Environment Variables

Create a `.env` file in the root of your backend project with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
⚠️ Make sure .env is in your .gitignore

📄 API Endpoints
🧑‍💼 Auth Routes
Method	Endpoint	Description
POST	/api/auth/signup	Register a new user
POST	/api/auth/login	Login and get JWT

⚡ Charging Station Routes (Protected)
Method	Endpoint	Description
GET	/api/chargers	Get all charging stations
POST	/api/chargers	Create a new station
PUT	/api/chargers/:id	Update a station
DELETE	/api/chargers/:id	Delete a station

Add Authorization: Bearer <your_token> in headers for protected routes

✅ How to Run Locally

Clone the repository:

git clone https://github.com/mamta-vyas/Ev-Charger-App.git
cd Ev-Charger-App/backend

Install dependencies:

npm install
Set up .env file with your MongoDB URI and JWT secret.

Start the server:

nodemon server.js
