# Brew & Co                   

A full-stack coffee shop web app built with the MERN stack (MongoDB, Express, React, Node.js).

I built this project to learn web development from scratch — starting with zero React/Node knowledge and building everything step by step.

---

## What it does

- Browse a coffee menu with category filters (Hot Drinks, Cold Drinks, etc.)
- Create an account and log in
- Add items to a cart and place orders
- View your order history

---

## Tech Stack

**Frontend**
- React (with Vite)
- React Router for navigation
- Plain CSS with CSS variables for theming

**Backend**
- Node.js + Express
- MongoDB Atlas (cloud database)
- Mongoose for database models
- JWT for authentication
- bcryptjs for password hashing

---

## Project Structure

```
brew-and-co/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Navbar, Footer, MenuItemCard
│       ├── pages/        # Home, Menu, Cart, Login, Signup, Orders
│       ├── context/      # AuthContext
│       └── styles/       # Global CSS and variables
│
└── server/          # Express backend
    ├── models/      # User, MenuItem, Order schemas
    ├── middleware/  # JWT auth middleware
    └── index.js     # Main server file
```

---

## API Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | /api/menu | Get all menu items | No |
| GET | /api/menu?category=Hot Drinks | Filter by category | No |
| GET | /api/menu/:id | Get one item | No |
| POST | /api/menu | Add menu item | Yes |
| PUT | /api/menu/:id | Update menu item | Yes |
| DELETE | /api/menu/:id | Delete menu item | Yes |
| POST | /api/signup | Create account | No |
| POST | /api/login | Login and get token | No |
| POST | /api/orders | Place an order | Yes |
| GET | /api/orders/myorders | Get my orders | Yes |

---

## Running Locally

You'll need Node.js and a MongoDB Atlas account.

**1. Clone the repo**
```bash
git clone https://github.com/zaid24-maker/brew-and-co.git
cd brew-and-co
```

**2. Set up the backend**
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_string
```

Start the server:
```bash
npm start
```

**3. Set up the frontend**
```bash
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## What I learned

- How REST APIs work and how to build one with Express
- MongoDB document structure and Mongoose schemas
- JWT authentication flow (signup → login → protected routes)
- React components, props, state, and hooks (useState, useEffect)
- React Router for client-side navigation
- How the frontend and backend talk to each other (fetch, CORS)
- Debugging real errors — DNS issues, auth failures, CORS, duplicate keys

---

Built by Zaid — learning MERN one step at a time.
