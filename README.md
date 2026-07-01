# Olfactura Digital Simulator

A full-stack web application for the Aromachology Digital Simulator, allowing clients to map wellness claims and demographics to scientific scent formulation blueprints.

## Prerequisites

- Node.js (v18 or higher recommended)
- Docker & Docker Compose (for running PostgreSQL)

## Setup & Running the Code

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Database**
   The application uses a PostgreSQL database. Start it using Docker Compose:
   ```bash
   docker compose up -d
   ```
   *(Note: This binds to port `5432` on your localhost. Ensure no other service is using this port).*

3. **Start the Backend Server**
   In a new terminal window, run the Express backend API:
   ```bash
   node server/index.js
   ```
   *The backend will run on `http://localhost:3001`.*

4. **Start the Frontend Development Server**
   In another terminal, start the Vite React frontend:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## Architecture
- **Frontend:** React, Vite, TailwindCSS, Lucide Icons, Recharts
- **Backend:** Node.js, Express, jsonwebtoken, bcrypt
- **Database:** PostgreSQL (running via Docker)

## Original Design
The original UI design is available at [Figma](https://www.figma.com/design/gO3tQX1SztMH6Z1galvl4T/UI-Design-Creation).