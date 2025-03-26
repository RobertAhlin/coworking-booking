# Coworking Space Booking

A backend API for managing workspace and conference room bookings in a coworking space.  
Built with **TypeScript, Node.js, Express, Prisma, and PostgreSQL**, running on **Docker**.

## Features
- User authentication (to be implemented)
- Workspace & conference room management
- Booking system with availability checks
- Prisma ORM for database interactions
- PostgreSQL database running in Docker
- Environment variable configuration with `.env`
- TypeScript for type safety

## Technologies Used
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Containerization:** Docker & Docker Compose
- **Environment Configuration:** dotenv

## Project Setup

### 1️. Clone the Repository
```
git clone https://github.com/yourusername/coworking-booking.git
cd coworking-booking
```

### 2️. Install Dependencies
```
npm install
```
### 3️. Start PostgreSQL in Docker
```
npm run postgres:start-locally
```
This starts a PostgreSQL container with Docker Compose.

### 4️. Apply Database Migrations
```
npm run prisma:migrate
```
This initializes the database schema using Prisma.

### 5️. Start the Server
```
npm run dev
```
Runs the server in development mode with nodemon.

### 6️. Test the API
The server runs on http://localhost:4444 (configurable via .env).

## Project Structure
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

## Room Management API
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

**Update room details**
- The function allow an admin to update a room's details.
- It check:
    - If the room exists.   
    - If the request contains valid fields (name, capacity, or type).
- It should return an error if the room does not exist.
- The Admin role is required to update a room.
- Any field left out in the request body will retain its original value.
- If the room ID is invalid or does not exist, the request will return a 404 error.

**Delete room by ID**
Deletes a room from the database if it exists. Only an admin can perform this action.
- Extracts Room ID
    - Gets the room ID from the request parameters (req.params.id).
- Checks if the Room Exists
    - Searches the database using prisma.room.findUnique({ where: { id } }).
    - If no room is found, it returns a 404 Not Found error.
- Deletes the Room
    - Calls prisma.room.delete({ where: { id } }) to remove the room from the database.
- Sends Response
    - If successful, returns a 200 OK message:
    - If an error occurs, returns a 500 Internal Server Error.


## Booking Management

**Create Booking**
- Logged-in users (User/Admin) can create a booking.
- Double bookings are prevented with proper database checks.  

Body:
```
{
  "roomId": "<room-id>",
  "startTime": "2025-03-15T10:00:00Z",
  "endTime": "2025-03-15T12:00:00Z"
}
```

**Fetch Bookings**
- Regular users can only see their own bookings.
- Admins can see all bookings.

**Update Booking**
- Users can only update their own bookings.
- Admins can update any booking.
- Double booking checks are also performed during updates.

**Delete Booking**
- Users can delete their own bookings.
- Admins can delete any booking.  
All steps tested in Postman:  
![Postman delete booking](Readmefiles/postman-delete-booking.png)

## Real-time Notifications (Socket.IO)
The platform uses Socket.IO to broadcast real-time notifications to all connected clients whenever a booking is created, updated, or deleted.  
**Requirements**  
- A browser or client that supports Socket.IO (v4)
- Connect to ws://localhost:4444 using the Socket.IO protocol   

Connection Example:
```
const socket = io("http://localhost:4444");

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
});
```
**Backend Logic**  
The events are emitted from bookingController.ts after each respective operation:  
```
io.emit("bookingCreated", booking);
io.emit("bookingUpdated", updated);
io.emit("bookingDeleted", { id });
```
**Testing notification**  
To be able to test the notifications I build a simple http client.  
Created a booking in Postman:  
![Postman create booking](Readmefiles/postman-create-booking_01.png)

I updated the booking:  
![Postman update booking](Readmefiles/postman-update-booking_01.png)

And last I deleted the booking:  
![Postman delete booking](Readmefiles/postman-delete-booking_01.png)!

And the results are shown in the the http client:  
![Real-time Notifications in browser](Readmefiles/browser-real-time-notices.png)

## Performance Optimization with Redis
To optimize performance and reduce database load, the application uses Redis to cache frequently accessed data.

**Cached Endpoint:**  
GET /rooms – This endpoint first checks if room data exists in Redis cache before querying the database.

- If cached data is found, it's returned directly:  
→ "Rooms fetched from cache"

- If no cached data exists, room data is fetched from the database and stored in Redis for 60 seconds:  
→ "Rooms fetched from DB"

**Cache Invalidation**  
To ensure data consistency, the cache is automatically invalidated (deleted) when any of the following operations are performed:

- POST /rooms – Creating a new room
- PUT /rooms/:id – Updating a room
- DELETE /rooms/:id – Deleting a room

After invalidation, the next GET /rooms request will fetch fresh data from the database and re-cache it.

**Testing It**  
Verifying the caching behavior using Postman:  
Make a GET /rooms request → expect "Rooms fetched from DB"  
![Get rooms from database](Readmefiles/postman-get-rooms-database_01.png)

New GET withing 60 seconds gives rooms fetched from cache:  
![Get rooms from cache](Readmefiles/postman-get-rooms-cache_01.png)

# Future Improvements
- Redis caching for frequently requested data
- Deployment on cloud platform
- Dashboard (front-end)