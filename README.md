# 🍔 AI Food Ordering System

An intelligent full-stack food ordering application that allows customers to browse menus, manage their cart, place orders, and receive AI-powered food recommendations using Google's Gemini AI. The application also provides an admin dashboard for managing menu items, categories, and customer orders.

---

# 🚀 Features

## 👤 Customer Features

- User Registration & Login (JWT Authentication)
- Browse Food Menu
- Search Food Items
- AI-Powered Food Recommendations
- Add Items to Cart
- Update Cart Quantity
- Remove Items from Cart
- Place Orders
- View Order History
- Responsive User Interface

---

## 🤖 AI Food Recommendation

The application integrates **Google Gemini AI** to understand natural language food requests and recommend suitable dishes from the restaurant menu.

### Example Queries

- I am very hungry
- I want something spicy
- Suggest a healthy meal
- Recommend vegetarian food
- I want chicken dishes
- Suggest something sweet
- Light dinner ideas
- Recommend Chinese food

The AI analyzes the user's request and provides personalized food recommendations based on the available menu items.

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Dashboard Overview
- Manage Categories
- Add Menu Items
- Edit Menu Items
- Delete Menu Items
- View Customer Orders
- Update Order Status
- Revenue Summary
- Order Statistics

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
- AI-Based Food Recommendation

---

# 📂 Project Structure

```text
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

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/M-Pushpavathi/-Food-Ordering-System-with-AI-Powered-Menu-Search.git
```

```bash
cd -Food-Ordering-System-with-AI-Powered-Menu-Search
```

---

## Backend Setup

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend

```bash
python run.py
```

---

## Frontend Setup

Navigate to frontend directory

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
SECRET_KEY=your_secret_key

JWT_SECRET_KEY=your_jwt_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# 🤖 AI Recommendation Workflow

```text
User Enters Natural Language Query
                │
                ▼
      Google Gemini API
                │
                ▼
 Underst
ands User Intent
                │
                ▼
 Generates Food Recommendations
                │
                ▼
Recommendations Displayed to User
```

---

# 🔐 Authentication

The application uses **JWT (JSON Web Token)** for secure authentication.

### Roles

- Customer
- Admin

---

# 🛒 Order Workflow

```text
Customer

   │

   ▼

Browse Menu

   │

   ▼

Add Items to Cart

   │

   ▼

Place Order

   │

   ▼

Order Stored in Database

   │

   ▼

Admin Dashboard

   │

   ▼

Update Order Status
```

---

# 📡 API Modules

## Authentication

- Register
- Login

## Categories

- Create Category
- Update Category
- Delete Category
- View Categories

## Menu

- Add Menu Item
- Update Menu Item
- Delete Menu Item
- View Menu Items

## Cart

- Add to Cart
- Update Quantity
- Remove Item
- View Cart

## Orders

- Place Order
- View Orders
- Update Order Status

## AI

- AI Food Recommendation

## Dashboard

- Revenue Summary
- Order Statistics
- Customer Orders

---

# 📸 Screenshots

Add screenshots of the following pages:

- Login Page
- Customer Dashboard
- Menu
- AI Recommendation
- Cart
- Orders
- Admin Dashboard

---

# 🚀 Future Enhancements

- Online Payment Gateway
- Live Order Tracking
- Email Notifications
- AI Chatbot
- Voice-Based Food Search
- Personalized Recommendations
- Restaurant Ratings & Reviews
- Delivery Tracking
- Multi-Restaurant Support

---

# 👨‍💻 Author

**M Pushpavathi**

GitHub:

https://github.com/M-Pushpavathi

---

# 📄 License

This project is developed for educational and learning purposes.
