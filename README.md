# 🏢 Coworking Space Booking

A backend API for managing workspace and conference room bookings in a coworking space.  
Built with **TypeScript, Node.js, Express, Prisma, and PostgreSQL**, running on **Docker**.

## 🚀 Features
- User authentication (to be implemented)
- Workspace & conference room management
- Booking system with availability checks
- Prisma ORM for database interactions
- PostgreSQL database running in Docker
- Environment variable configuration with `.env`
- TypeScript for type safety

## 🛠️ Technologies Used
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Containerization:** Docker & Docker Compose
- **Environment Configuration:** dotenv

## 📦 Project Setup

### 1️⃣ Clone the Repository
```
git clone https://github.com/yourusername/coworking-booking.git
cd coworking-booking
```

### 2️⃣ Install Dependencies
```
npm install
```
### 3️⃣ Start PostgreSQL in Docker
```
npm run postgres:start-locally
```
This starts a PostgreSQL container with Docker Compose.

### 4️⃣ Apply Database Migrations
```
npm run prisma:migrate
```
This initializes the database schema using Prisma.

### 5️⃣ Start the Server
```
npm run dev
```
Runs the server in development mode with nodemon.

### 6️⃣ Test the API
The server runs on http://localhost:4444 (configurable via .env).

## 📁 Project Structure
```
/coworking-booking  
│── /src  
│   ├── index.ts        # Main Express server file  
│── /prisma  
│   ├── schema.prisma   # Prisma schema file  
│── /docker-data        # PostgreSQL volume (ignored in Git)  
│── .env                # Environment variables (ignored in Git)  
│── docker-compose.yml  # Docker setup for PostgreSQL  
│── package.json        # Dependencies & scripts  
│── tsconfig.json       # TypeScript configuration  
│── .gitignore          # Files to exclude from Git  
│── README.md           # Project documentation  
```

# Workflow
## PostgreSQL Database Setup
- Ensured PostgreSQL was running in Docker.  
- Checked that Prisma migrations were applied successfully.  
- Verified that the database structure was correct.  
- Inserted test users into the User table.

## Authentication System
**User Registration** (POST /auth/register)
- Created endpoint for new users to sign up.
- Stored user credentials securely using bcrypt for password hashing.
- Enforced unique emails and usernames.

**User Login** (POST /auth/login)
- Implemented JWT authentication.
- Generated a JWT token upon successful login.
- Ensured password validation using bcrypt.

**User Authentication Middleware** (verifyToken)
- Implemented middleware to protect routes using JWT tokens.
- Users must provide a valid token to access protected endpoints.

**Admin Role Check** (isAdmin)
- Added middleware to restrict Admin-only routes.

## Room Management API (Work in Progress)
**Created POST /rooms** (Admin only)
- Implemented logic to add new rooms.
- Ensured input validation for name, capacity, and type.
- Stored rooms in the database via Prisma ORM.
- Verified that only admins can create rooms.
- Debugged Prisma errors related to the RoomType enum.

**Fetch rooms from database**
The getRooms function retrieves all rooms from the database and returns them in a JSON response.
- GET request to /rooms using Postman.
- The server respons with a list of rooms from the database.

