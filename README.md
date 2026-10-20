# Restaurant Order & Management System

A full-stack web application designed for dining restaurants to streamline customer self-ordering, real-time kitchen order processing (Kitchen Display System), and administrative restaurant management with live sales analytics.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation & Running Locally](#installation--running-locally)
- [API Endpoints Reference](#api-endpoints-reference)
  - [Health Check](#health-check)
  - [Authentication](#authentication)
  - [Menu Management](#menu-management)
  - [Dining Tables](#dining-tables)
  - [Order Processing](#order-processing)
  - [Admin Analytics & Dashboard](#admin-analytics--dashboard)
- [Order Status Lifecycle](#order-status-lifecycle)

---

## Features

### Customer Experience
- **Interactive Menu:** Filter menu items by category, search by name, or filter by vegetarian/non-vegetarian options.
- **Item Details:** View dish descriptions, prices, categories, and availability.
- **Smart Cart & Billing:** Dynamic quantity adjustments, automatic subtotal, 5% GST computation, and grand total calculation.
- **Table Allocation:** Select dining table with capacity tracking prior to placing an order.
- **Order Tracking & History:** View past orders, item breakdowns, total cost, and timestamped statuses.
- **Self Cancellation:** Cancel orders directly from the portal while in the `Placed` status.

### Kitchen Display System (KDS)
- **Live Ticket Board:** Automatic refresh every 10 seconds to display active orders (`Placed` and `Preparing`).
- **Kitchen Actions:** Advance order preparation state (`Placed` → `Preparing` → `Served`).

### Admin Management & Intelligence
- **Sales Analytics Dashboard:** Daily metrics including total order count, total revenue, top 5 best-selling items, and category-wise revenue breakdown using MongoDB aggregation pipelines.
- **Order Management:** View all system orders, filter by status, and execute state transitions (`Placed`, `Preparing`, `Served`, `Paid`, `Cancelled`).
- **Menu Item CRUD:** Create new food items with image URLs, categories, prices, veg flags, and availability; edit or delete existing dishes.
- **Table Management:** Configure dining tables with custom table numbers and seating capacities.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
- **Frontend:** React 19, React Router v7, Vite
- **API Communication:** RESTful API using Fetch API with CORS enabled

---

## Project Structure

```text
ASSIGNMENT-6/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── dashboardController.js# Aggregated revenue & sales statistics
│   │   ├── menuController.js     # Menu CRUD & search/filter logic
│   │   ├── orderController.js    # Order placement, status updates, cancellation
│   │   └── tableController.js    # Dining table management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token validation & admin authorization
│   │   └── errorMiddleware.js    # 404 & centralized error handling
│   ├── models/
│   │   ├── MenuItem.js           # Menu item schema
│   │   ├── Order.js              # Order schema with items, pricing, status
│   │   ├── Table.js              # Dining table schema with capacity
│   │   └── User.js               # User schema with roles (customer/admin)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── dashboardRoutes.js    # /api/admin
│   │   ├── menuRoutes.js         # /api/menu
│   │   ├── orderRoutes.js        # /api/orders
│   │   └── tableRoutes.js        # /api/tables
│   ├── utils/
│   │   └── generateToken.js      # JWT signing utility
│   ├── .env                      # Backend environment variables
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express application entry point
│
├── frontend/
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with role-based links
│   │   │   └── ProtectedRoute.jsx# Auth and role protection wrapper
│   │   ├── App.jsx               # Main application component & routes
│   │   ├── main.jsx              # React DOM root mounting
│   │   └── index.css             # Base styles
│   ├── .env                      # Frontend environment variables
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies & scripts
│   └── vite.config.js            # Vite configuration
│
└── README.md                     # Documentation
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (v9.x or later)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI

---

## Environment Setup

### 1. Backend Environment Configuration
Navigate to the `backend/` folder and verify or create the `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_db
JWT_SECRET=supersecret_jwt_key_restaurant_system_2026
```

### 2. Frontend Environment Configuration
Navigate to the `frontend/` folder and verify or create the `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Installation & Running Locally

### Step 1: Start the Backend Server

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
node server.js
```
The backend server runs at `http://localhost:3000` by default.

### Step 2: Start the Frontend Application

Open a second terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The client application will typically be accessible at `http://localhost:5173`.

---

## API Endpoints Reference

Base URL: `http://localhost:3000/api`

### Health Check

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Verify that the backend API is active and running |

---

### Authentication

Base path: `/api/auth`

| Method | Endpoint | Access | Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | `{ "name", "email", "password", "role" }` | Registers a new user (`role`: `"customer"` or `"admin"`). Returns user info & JWT token. |
| `POST` | `/login` | Public | `{ "email", "password" }` | Authenticates existing user and returns JWT token. |
| `GET` | `/me` | Protected (Token) | *None* | Retrieves current logged-in user details. |

---

### Menu Management

Base path: `/api/menu`

| Method | Endpoint | Access | Query / Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | `?category=...&search=...&veg=true` | Fetch all menu items matching query filters. |
| `GET` | `/:id` | Public | *None* | Get detailed information for a single menu item by ID. |
| `POST` | `/` | Admin | `{ "name", "category", "price", "isVeg", "isAvailable", "imageUrl" }` | Create a new menu item. |
| `PUT` | `/:id` | Admin | Fields to update (e.g. `price`, `isAvailable`) | Update an existing menu item. |
| `DELETE`| `/:id` | Admin | *None* | Permanently delete a menu item. |

---

### Dining Tables

Base path: `/api/tables`

| Method | Endpoint | Access | Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | *None* | Retrieve all configured tables sorted by table number. |
| `POST` | `/` | Admin | `{ "tableNumber", "capacity" }` | Add a new dining table. |
| `PUT` | `/:id` | Admin | `{ "tableNumber", "capacity" }` | Update table details or capacity. |
| `DELETE`| `/:id` | Admin | *None* | Remove a table. |

---

### Order Processing

Base path: `/api/orders`

| Method | Endpoint | Access | Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Customer / Protected | `{ "tableId", "items": [{ "menuItemId", "quantity" }] }` | Places a new order. Calculates subtotal, 5% GST, grandTotal, and sets status to `"Placed"`. |
| `GET` | `/my` | Customer / Protected | *None* | Fetch order history for the logged-in customer. |
| `PATCH`| `/:id/cancel` | Customer / Protected | *None* | Cancels customer's order (only valid when current status is `"Placed"`). |
| `GET` | `/` | Admin | `?status=...` (optional filter) | Retrieve all orders across all tables and customers. |
| `PATCH`| `/:id/status` | Admin | `{ "status": "Preparing" \| "Served" \| "Paid" \| "Cancelled" }` | Update order preparation or payment status according to transition rules. |
| `GET` | `/:id` | Customer / Admin | *None* | Retrieve complete details of a specific order. |

---

### Admin Analytics & Dashboard

Base path: `/api/admin`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | Admin | Returns aggregate metrics: `todayOrdersCount`, `todayRevenue`, `topItems` (top 5 by volume), and `categorySales` breakdown. |

---

## Order Status Lifecycle

Orders follow a strict transition pipeline enforced by backend validation:

```text
[Placed] ──> [Preparing] ──> [Served] ──> [Paid]
   │             │
   └───> [Cancelled] <───┘
```

- **Placed:** Initial state upon customer checkout. Customer can cancel at this stage.
- **Preparing:** Kitchen has accepted and started food preparation.
- **Served:** Food items have been delivered to the table.
- **Paid:** Final state after settlement of bill. No further modifications permitted.
- **Cancelled:** Terminated order.
