# 🍕 Pizza Palace

A modern **MERN Stack food ordering web application** that allows users to browse pizzas, manage their cart, securely complete checkout, and track their orders.

Pizza Palace is designed with a premium food-delivery experience inspired by modern online food-ordering platforms.

## 🚀 Live Demo

**Frontend:**
https://pizza-palace-g6cj.vercel.app/

**Backend:**
https://pizza-palace-api.onrender.com/

> Replace the above URLs with your actual deployed Vercel and Render URLs if they are different.

---

## ✨ Features

### 👤 Authentication

* User registration and login
* User information stored in local storage
* Customer-based order management
* Protected user-specific order history

### 🍕 Pizza Menu

* Browse available pizzas
* Pizza images and details
* Multiple pizza sizes
* Dynamic pricing based on selected size
* Responsive pizza cards
* Modern food-delivery style interface

### 🛒 Shopping Cart

* Add pizzas to cart
* Increase/decrease quantity
* Remove items
* Select pizza size
* Automatic subtotal calculation
* Persistent cart state using React Context API

### 📍 Delivery

* Customer name and phone number
* Delivery address
* City and pincode
* Optional map-based location selection
* Latitude and longitude stored with the order when provided

### 💳 Payments

* Razorpay payment gateway integration
* Online payment support
* Payment status handling
* Secure checkout experience
* Test-mode payment support for development

### 🎟️ Coupons

* Coupon code support
* `PIZZA100` provides ₹100 discount
* Automatic discount calculation

### 📦 Orders

* Create orders after successful checkout
* Store orders in MongoDB
* View customer-specific orders
* Order status management
* Admin order management
* Delete orders

### 🎨 UI/UX

* Premium responsive design
* Mobile-friendly layout
* Tailwind CSS styling
* Lucide React icons
* Loading states
* Form validation
* Empty cart handling
* Error states
* Responsive checkout page

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Axios
* Lucide React
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Razorpay
* Helmet
* Morgan
* CORS
* dotenv

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📂 Project Structure

```text
pizza-palace/
│
├── frontend/
│   ├── public/
│   │   └── pizza images
│   │
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   ├── ordercontroller.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── order.js
│   │   ├── user.js
│   │   └── pizza.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── pizzaRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pizza-palace.git
```

```bash
cd pizza-palace
```

---

# 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The backend will normally run on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

For development, use **Razorpay Test Mode**.

⚠️ Never upload your `.env` file or Razorpay secret key to GitHub.

Add this to `.gitignore`:

```gitignore
node_modules/
.env
```

---

# 🔌 API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Pizza

```text
GET /api/pizzas
```

## Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:userId
PUT    /api/orders/:id
DELETE /api/orders/:id
```

## Payment

```text
POST /api/payment/create-order
POST /api/payment/verify
```

---

# 💳 Payment Flow

Pizza Palace uses Razorpay for online payments.

The payment flow is:

```text
User Checkout
      ↓
Validate Customer Details
      ↓
Create Razorpay Order
      ↓
Open Razorpay Checkout
      ↓
Complete Payment
      ↓
Verify Payment
      ↓
Create Order in MongoDB
      ↓
Clear Cart
      ↓
Show Order Confirmation
```

For development and demonstrations, Razorpay **Test Mode** should be used.

---

# 🗃️ Database

MongoDB is used to store application data.

Main collections include:

```text
Users
Pizzas
Orders
```

Orders contain information such as:

* User ID
* Customer details
* Ordered items
* Quantity
* Pizza size
* Price
* Subtotal
* Delivery fee
* Discount
* Total amount
* Payment method
* Order status
* Created date

---

# 📱 Responsive Design

Pizza Palace is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

The interface uses Tailwind CSS responsive utilities to provide a consistent experience across different screen sizes.

---

# 🔒 Security

The backend uses:

* Helmet for HTTP security headers
* CORS configuration
* Environment variables for sensitive credentials
* MongoDB/Mongoose validation
* Razorpay payment verification

Sensitive credentials such as MongoDB and Razorpay secrets are kept outside the source code.

---

# 🎯 Key Learning Outcomes

This project helped me gain practical experience with:

* Building a full-stack MERN application
* React component architecture
* React Context API
* React Router
* REST API development
* CRUD operations
* MongoDB and Mongoose
* Authentication
* Payment gateway integration
* Form validation
* API integration using Axios
* State management
* Responsive UI development
* Git and GitHub
* Frontend and backend deployment

---

# 🚀 Future Improvements

Some possible future improvements include:

* Real-time order tracking
* Admin dashboard
* Order notifications
* User profile management
* Pizza search and advanced filtering
* Ratings and reviews
* Wishlist functionality
* Multiple payment methods
* Delivery partner tracking
* Improved authentication using JWT and refresh tokens

---

# 👩‍💻 Author

**Rithu Rajan**

MERN Stack Developer

* GitHub: https://github.com/Rithu-4
* LinkedIn: https://www.linkedin.com/in/rithu-rajan10
* Portfolio: https://portfolio-wine-iota-86.vercel.app/

---

## ⭐ If you like this project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
