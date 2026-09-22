# 🥗 Food Rescue Platform

A full-stack web application designed to connect **Food Donors** (restaurants, bakeries, supermarkets, individuals) with **Food Recipients** (shelters, community centers, individuals in need) to reduce food waste and support communities.

---

## 📌 Project Overview

Food waste is a major global issue, while many people face food insecurity daily. The **Food Rescue Platform** provides a simple, clean, and efficient digital bridge where:
- **Donors** can post surplus food items with details, pickup locations, coordinates, and images.
- **Recipients** can view available food on an interactive map, view pickup locations, and claim food items with a single click.

---

## ✨ Features

- 🔐 **User Authentication & Role-Based Access Control**:
  - Registration & Login powered by **JWT (JSON Web Tokens)** and **bcryptjs** password hashing.
  - Exactly two roles: `donor` and `recipient`.
  - Roles are stored in MongoDB. The frontend displays tailored dashboards based strictly on the user's role.
- 👨‍🍳 **Donor Dashboard (CRUD)**:
  - **Create**: Add new food donations with name, quantity, description, expiry date, address, coordinates, and image.
  - **Read**: View a list of all personal donations with their current status (`Available` or `Claimed`).
  - **Update**: Edit existing donation details (quantity, address, coordinates, expiry date).
  - **Delete**: Delete food donations with ownership protection.
- 🤝 **Recipient Dashboard**:
  - **Available Food**: View real-time available food items posted by donors.
  - **Claim System**: Claim available food with automatic double-claim prevention.
  - **My Claimed Food**: View all previously claimed donations with donor contact details and pickup maps.
- 📸 **Image Upload Module**:
  - Donors can upload a food image during donation creation.
  - Built with **Multer** middleware, storing files locally in `backend/uploads/` and serving them statically via Express.
- 🗺️ **Interactive Leaflet Maps**:
  - Displays donation pickup coordinates on **OpenStreetMap** using **Leaflet** / **react-leaflet**.
  - Interactive map location picker allowing donors to click anywhere on the map to automatically populate latitude and longitude coordinates.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **JavaScript (ES6+)**
- **Native `fetch()` API** (No heavy HTTP clients)
- **Leaflet & React-Leaflet** (Open-source maps)
- **Custom CSS3** (Light, clean, beginner-friendly green/yellow/gray theme)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB Atlas** & **Mongoose ORM**
- **bcryptjs** (Password hashing)
- **jsonwebtoken (JWT)** (Secure token authentication)
- **Multer** (Multipart file upload processing)

---

## 📂 Folder Structure

```text
Food-Rescue-Platform/
│
├── README.md                 # Full project documentation & guide
├── .gitignore                # Git ignore configuration
│
├── backend/                  # Node.js + Express REST API Backend
│   ├── config/
│   │   └── db.js             # Mongoose MongoDB Atlas connection
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification middleware
│   │   └── roleMiddleware.js # Role-based authorization middleware
│   ├── models/
│   │   ├── User.js           # User schema (name, email, password, role)
│   │   ├── Food.js           # Food schema (foodName, quantity, status, donor, etc.)
│   │   └── Claim.js          # Claim schema (food, recipient, claimedAt)
│   ├── routes/
│   │   ├── authRoutes.js     # Register, Login, Me endpoints
│   │   ├── foodRoutes.js     # Donor food CRUD endpoints
│   │   ├── recipientRoutes.js# Recipient available & claim endpoints
│   │   └── uploadRoutes.js   # Multer file upload endpoint
│   ├── uploads/              # Local storage folder for uploaded food images
│   ├── .env                  # Environment variables (secrets)
│   ├── .env.example          # Environment variables template
│   ├── server.js             # Express app entry point
│   ├── test-runner.js        # Automated API test suite
│   └── package.json          # Backend dependencies
│
└── frontend/                 # React + Vite Frontend
    ├── public/               # Static public assets
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx               # Navigation bar & user role badge
    │   │   ├── Login.jsx                # Login form
    │   │   ├── Register.jsx             # Role-selection registration form
    │   │   ├── DonorDashboard.jsx       # Donor workspace
    │   │   ├── RecipientDashboard.jsx   # Recipient workspace
    │   │   ├── FoodForm.jsx             # Add & Edit food form with file upload
    │   │   ├── FoodCard.jsx             # Food item display card
    │   │   ├── MapView.jsx              # Leaflet map display
    │   │   └── LocationPickerMap.jsx    # Interactive map coordinate picker
    │   ├── services/
    │   │   └── api.js        # Native fetch API wrapper
    │   ├── App.jsx           # Main React component & auth router
    │   ├── App.css           # Simple clean styling
    │   └── main.jsx          # React DOM root entry
    ├── index.html            # HTML page with Leaflet CSS CDN
    ├── vite.config.js        # Vite build configuration
    └── package.json          # Frontend dependencies
```

---

## 🍃 MongoDB Atlas Setup

To connect the application to your own MongoDB Atlas Database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
2. Create a new **Database Cluster** (Free Shared Tier M0).
3. Create a **Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Set a Username and Password.
4. Set **Network Access**:
   - Go to **Network Access** -> **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
5. Get your Connection String:
   - Click **Connect** on your cluster -> Choose **Drivers**.
   - Copy the URI format:
     `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/foodRescueDB?retryWrites=true&w=majority`
6. Paste the URI into `backend/.env` under `MONGO_URI`.

---

## 🔑 Environment Variables

Inside `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/foodRescueDB?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_food_rescue_2026
```

---

## 🚀 How to Run the Project

### Prerequisite
Make sure **Node.js** (v18+) and **npm** are installed on your system.

### 1️⃣ Start the Backend Server
```bash
cd backend
npm install
npm start
```
The backend server will launch at `http://localhost:5000`.

### 2️⃣ Start the Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 API Endpoints Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token + user role |
| `GET` | `/api/auth/me` | Protected | Get logged-in user profile |

### Food Routes (`/api/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/foods` | Donor Only | Create new food donation |
| `GET` | `/api/foods/my-donations` | Donor Only | Fetch food donations created by logged-in donor |
| `GET` | `/api/foods/:id` | Protected | Fetch single food item by ID |
| `PUT` | `/api/foods/:id` | Donor (Owner) | Update food donation |
| `DELETE` | `/api/foods/:id` | Donor (Owner) | Delete food donation |

### Recipient Routes (`/api/recipient`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recipient/available` | Recipient Only | Fetch all foods with status `Available` |
| `POST` | `/api/recipient/claim/:foodId` | Recipient Only | Claim food (changes status `Available` → `Claimed`) |
| `GET` | `/api/recipient/my-claims` | Recipient Only | Fetch all claims made by logged-in recipient |

### Upload Route (`/api/upload`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Protected | Upload single food image file via Multer |

---

## 🔄 Core Workflows

### 👨‍🍳 Donor Workflow
1. User registers with **Role = Donor**.
2. Donor logs in and is automatically presented with the **Donor Dashboard**.
3. Clicks **Donate New Food**, fills in details (Food Name, Quantity, Expiry Date, Location Address), picks coordinates on the Leaflet Map, and uploads a food photo.
4. Food item is saved in MongoDB with `status = "Available"`.
5. Donor can view, edit, or delete their food items anytime.

### 🤝 Recipient Workflow
1. User registers with **Role = Recipient**.
2. Recipient logs in and is presented with the **Recipient Dashboard**.
3. Navigates available food items, inspects photos, expiry dates, donor contact info, and pickup location on the Leaflet map.
4. Clicks **Claim Food**.
5. The backend validates availability, updates the food status from `Available` → `Claimed`, and creates a `Claim` record.
6. The claimed item appears under **My Claimed Food**.

---

## 🎯 Beginners Interview Explanation Guide

When presenting this project in a software engineering interview:

1. **Architecture**: *"I built a full-stack MERN application with a decoupled RESTful Express API and React frontend."*
2. **Role-Based Security**: *"Authentication uses JWT tokens signed on login. Role-based middleware ensures donors can only perform CRUD operations on their own food donations, while recipients can only query available food and create claims."*
3. **Data Integrity**: *"To prevent race conditions where two recipients attempt to claim the same food, the claim endpoint performs an atomic check on the food status before completing the transaction."*
4. **Maps Integration**: *"I integrated Leaflet with OpenStreetMap for zero-cost mapping. I also implemented an interactive map event handler allowing donors to click anywhere on the map to set exact pickup coordinates."*
5. **File Handling**: *"Images are handled via Multer multipart storage in Express, saved to a local uploads directory, and served as static resources."*

---

## 📝 License
This project is open-source and built for educational purposes.
