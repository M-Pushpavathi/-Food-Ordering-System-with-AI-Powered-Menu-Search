# 🍔 AI Food Ordering System with AI-Powered Menu Search

An intelligent full-stack food ordering application that allows customers to browse menus, place orders, and search for food using natural language. The system also provides an admin dashboard for managing menu items, categories, orders, and analytics.

---

# 🚀 Features

## 👤 Customer

- User Registration & Login (JWT Authentication)
- Browse Food Menu
- Search by Categories
- AI-Powered Natural Language Food Search
- Add Items to Cart
- Update Cart Quantity
- Remove Items from Cart
- Place Orders
- View Order History
- Responsive UI

---

## 🤖 AI-Powered Menu Search

The application uses Google's **Gemini AI** to understand natural language food queries.

Examples:

- I am very hungry
- I want something spicy
- Sweet under ₹100
- Healthy vegetarian food
- Chicken under ₹250
- Light dinner
- Dessert
- Chinese food

The AI extracts:

- Food Preference
- Veg / Non-Veg
- Budget
- Category
- Keywords
- Health Preference
- Hunger Level

The backend intelligently filters the menu and returns the most relevant dishes.

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Dashboard
- Manage Categories
- Manage Menu Items
- Add New Food Items
- Edit Food Items
- Delete Food Items
- View All Orders
- Update Order Status
- View Revenue Summary
- Monitor Customer Orders

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- Tailwind CSS
- ShadCN UI

---

## Backend

- Python
- Flask
- Flask JWT Extended
- Flask SQLAlchemy
- Flask Marshmallow
- Flask Migrate
- Flask CORS
- SQLAlchemy ORM

---

## Database

- SQLite

---

## AI Integration

- Google Gemini API
- Natural Language Processing
- Intelligent Food Recommendation

---

# 📂 Project Structure

```
AI-Food-Ordering-System
│
├── backend
│   ├── app
│   │   ├── auth
│   │   ├── menu
│   │   ├── cart
│   │   ├── order
│   │   ├── dashboard
│   │   ├── ai
│   │   ├── models
│   │   ├── extensions.py
│   │   └── config
│   │
│   └── run.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── routes
│   │   ├── services
│   │   ├── context
│   │   └── pages
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/M-Pushpavathi/-Food-Ordering-System-with-AI-Powered-Menu-Search.git
```

```
cd -Food-Ordering-System-with-AI-Powered-Menu-Search
```

---

# Backend Setup

Create virtual environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Install packages

```bash
pip install -r requirements.txt
```

Run backend

```bash
python run.py
```

---

# Frontend Setup

Navigate

```bash
cd frontend
```

Install

```bash
npm install
```

Run

```bash
npm run dev
```

---

# Environment Variables

Create `.env`

```
SECRET_KEY=your_secret_key

JWT_SECRET_KEY=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

---

# AI Search Workflow

```
User Query

↓

Gemini AI

↓

Extract Preferences

↓

Menu Filtering

↓

Ranking

↓

Recommended Dishes
```

---

# Authentication

JWT Authentication is used.

Roles

- Customer
- Admin

---

# Order Workflow

```
Customer

↓

Browse Menu

↓

Add to Cart

↓

Place Order

↓

Order Stored

↓

Admin Dashboard

↓

Update Order Status
```

---

# API Modules

### Authentication

- Register
- Login

### Categories

- Create
- Update
- Delete
- View

### Menu

- Add Item
- Update Item
- Delete Item
- List Items

### Cart

- Add Item
- Update Quantity
- Remove Item

### Orders

- Place Order
- View Orders
- Update Status

### AI

- Natural Language Search

### Dashboard

- Revenue
- Orders
- Statistics

---

# Screenshots

Add screenshots here.

Example

- Login Page
- Dashboard
- AI Search
- Menu
- Cart
- Orders

---

# Future Enhancements

- Payment Gateway
- Live Order Tracking
- Email Notifications
- AI Chatbot
- Voice Search
- Personalized Recommendations
- Restaurant Ratings
- Delivery Tracking
- Multi Restaurant Support

---

# Author

**M Pushpavathi**

GitHub

https://github.com/M-Pushpavathi

---

# License

This project is developed for educational and learning purposes.
