# ChatWizz

A collaborative chat and project management platform with real-time messaging, user authentication, and project file management. Built with Node.js, Express, MongoDB, React, and Socket.io.

## Features
- User registration and login (with JWT authentication)
- Google OAuth registration (to be implemented)
- Project creation and management
- Add/remove project contributors
- Real-time chat within projects
- File tree management for projects
- Secure logout with token blacklisting (Redis)

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd ChatWizz
   ```
2. Install dependencies for backend and frontend:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables in a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongoDB_URI
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```
4. Start backend and frontend servers:
   ```sh
   # In backend/
   npm start
   # In frontend/
   npm run dev
   ```

## API Endpoints & Examples

### User Routes

#### Register
- **POST** `/users/register`
- **Body:**
  ```json
  {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Example (curl):**
  ```sh
  curl -X POST http://localhost:4000/users/register \
    -H "Content-Type: application/json" \
    -d '{
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john@example.com",
      "password": "yourpassword"
    }'
  ```
- **Response:**
  ```json
  {
    "user": { ... },
    "token": "..."
  }
  ```

#### Login
- **POST** `/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Example (curl):**
  ```sh
  curl -X POST http://localhost:4000/users/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "john@example.com",
      "password": "yourpassword"
    }'
  ```
- **Response:**
  ```json
  {
    "user": { ... },
    "token": "..."
  }
  ```

#### Profile
- **GET** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/users/profile \
    -H "Authorization: Bearer <token>"
  ```
- **Response:**
  ```json
  {
    "user": { ... }
  }
  ```

#### Logout
- **POST** `/users/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X POST http://localhost:4000/users/logout \
    -H "Authorization: Bearer <token>"
  ```
- **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get All Users
- **GET** `/users/all`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/users/all \
    -H "Authorization: Bearer <token>"
  ```
- **Response:**
  ```json
  {
    "users": [ ... ]
  }
  ```

### Project Routes

#### Create Project
- **POST** `/projects/create`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "My Project"
  }
  ```
- **Example (curl):**
  ```sh
  curl -X POST http://localhost:4000/projects/create \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{ "name": "My Project" }'
  ```
- **Response:**
  ```json
  {
    "_id": "...",
    "name": "my project",
    "users": ["..."],
    "fileTree": {}
  }
  ```

#### Get All Projects
- **GET** `/projects/all`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/projects/all \
    -H "Authorization: Bearer <token>"
  ```
- **Response:**
  ```json
  {
    "projects": [ ... ]
  }
  ```

#### Add User to Project
- **PUT** `/projects/add-user`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "projectId": "...",
    "users": ["userId1", "userId2"]
  }
  ```
- **Example (curl):**
  ```sh
  curl -X PUT http://localhost:4000/projects/add-user \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{ "projectId": "...", "users": ["userId1", "userId2"] }'
  ```
- **Response:**
  ```json
  {
    "project": { ... }
  }
  ```

#### Get Project by ID
- **GET** `/projects/get-project/:projectId`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/projects/get-project/<projectId> \
    -H "Authorization: Bearer <token>"
  ```
- **Response:**
  ```json
  {
    "project": { ... }
  }
  ```

#### Update File Tree
- **PUT** `/projects/update-file-tree`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "projectId": "...",
    "fileTree": { ... }
  }
  ```
- **Example (curl):**
  ```sh
  curl -X PUT http://localhost:4000/projects/update-file-tree \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{ "projectId": "...", "fileTree": { ... } }'
  ```
- **Response:**
  ```json
  {
    "project": { ... }
  }
  ```

## WebSocket (Socket.io)
- Connect with `token` (JWT) and `projectId` as query params or in `auth`.
- Join project room for real-time chat and updates.

## License
MIT
