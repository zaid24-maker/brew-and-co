# ☕ Brew & Co.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A full-stack, premium coffee shop e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js). Engineered with a focus on performance, responsive design, and robust security.

**Live Demo:** [Brew & Co. on Vercel](https://brew-and-co-sable.vercel.app)  
**Backend API:** [Hosted on Render](https://brew-and-co.onrender.com)

---

## ✨ Key Features

- **Storefront & Menu:** Dynamic, filterable product catalog with instant cart updates and responsive animations.
- **Role-Based Access Control (RBAC):** Secure partitioning between standard users and Administrators via JSON Web Tokens (JWT).
- **Admin Dashboard:** Real-time metrics overview, live order status management, and complete CRUD operations for the digital menu.
- **Optimized Performance:** Implemented React Code-Splitting (`React.lazy` & `Suspense`) to minimize bundle sizes and maximize load speeds.
- **Robust Security:** Stateful password hashing using `bcryptjs` and strict, multi-origin CORS validation.
- **Accessibility (A11y):** Built entirely with WCAG compliance in mind, featuring ARIA labels, semantic HTML, and screen-reader safe components.
- **Table Reservations:** Multi-step reservation flow with custom success screens and instant feedback.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- React Router DOM (v6)
- Vanilla CSS3 (Custom Design Tokens & CSS Variables)
- Context API (Global State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- cors & dotenv

---

## 🚀 Local Development Setup

To run this project locally, you will need Node.js and a MongoDB instance (or MongoDB Atlas URI).

### 1. Clone the repository
```bash
git clone https://github.com/zaid24-maker/brew-and-co.git
cd brew-and-co
```

### 2. Setup the Server
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Client
Open a new terminal configuration in the project root:
```bash
cd client
npm install
```
Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Admin Seeding (Optional)
To instantly create an Admin account for testing the `/admin` dashboard:
```bash
cd server
node create-admin.js yourmail@example.com
```

---

## 🎨 Design System
The UI relies heavily on a curated set of design tokens designed to evoke a luxury coffee house atmosphere:

- **Espresso:** `#2e1a12`
- **Coffee:** `#4a2c20`
- **Caramel:** `#c19a6b`
- **Cream:** `#fff8f2`

## 👨‍💻 Author
**Zaid** - [GitHub Profile](https://github.com/zaid24-maker)
