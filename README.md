# PhotoShootApp

PhotoShootApp is a full-stack web application designed to manage and book photography sessions. It features a robust backend built with Node.js, Express, and MongoDB, and a modern frontend using React and Vite.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Scripts](#scripts)
- [License](#license)

---

## Features
- User authentication (JWT-based)
- User profile management
- Booking creation and management
- Form validation (frontend and backend)
- Protected routes
- Responsive UI

---

## Tech Stack

### Backend
- **Node.js**
- **Express**
- **MongoDB** (via Mongoose)
- **TypeScript**
- **Zod** (validation)
- **JWT** (authentication)
- **Bcrypt** (password hashing)

### Frontend
- **React** (with hooks and context)
- **Vite** (build tool)
- **TypeScript**
- **Axios** (API requests)
- **React Router DOM** (routing)

---

## Project Structure

```
photoShootApp/
  backend/        # Express + MongoDB API
    src/
      controllers/
      middleware/
      models/
      routes/
      validation/
  frontend/       # React + Vite client
    src/
      components/
      contexts/
      hooks/
      pages/
      services/
      styles/
      types/
      utils/
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or cloud instance)

---

## Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with your environment variables (e.g., MongoDB URI, JWT secret).
4. Start the development server:
   ```sh
   npm run dev
   ```

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

---

## Scripts

### Backend
- `npm run dev` — Start backend in development mode (with hot reload)
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled backend

### Frontend
- `npm run dev` — Start frontend in development mode
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## License

This project is licensed under the ISC License. 