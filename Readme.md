# ChatWizz — Fullstack Project Documentation

A modern, collaborative chat and project management platform. ChatWizz enables real-time messaging, project collaboration, and file management with a beautiful React frontend and a robust Node.js/Express backend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Usage](#frontend-usage)
- [WebSocket Usage](#websocket-usage)
- [Code Examples](#code-examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
ChatWizz is a fullstack application for collaborative project management and real-time chat. It supports user authentication, project creation, contributor management, and live messaging, all with a modern UI and secure backend.

---

## Features
- User registration and login (JWT-based)
- (Planned) Google OAuth registration
- Dashboard for project management
- Real-time chat within projects (Socket.io)
- Add/remove project contributors
- File tree and code editor integration
- Secure logout with token blacklisting (Redis)
- Responsive, modern UI (Tailwind CSS)

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, Socket.io-client, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, Redis

---

## Monorepo Structure
```
ChatWizz/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── db/
│   ├── app.js
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
└── README.md (this file)
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB
- Redis

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd ChatWizz
   ```
2. Install backend dependencies:
   ```sh
   cd backend && npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ../frontend && npm install
   ```
4. Set up environment variables (see below).
5. Start backend and frontend servers:
   ```sh
   # In backend/
   npm start
   # In frontend/
   npm run dev
   ```

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=4000
MONGODB_URI=your_mongoDB_URI
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:4000
```

---

## API Reference

### User Endpoints

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

#### Profile
- **GET** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/users/profile \
    -H "Authorization: Bearer <token>"
  ```

#### Logout
- **POST** `/users/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X POST http://localhost:4000/users/logout \
    -H "Authorization: Bearer <token>"
  ```

#### Get All Users
- **GET** `/users/all`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/users/all \
    -H "Authorization: Bearer <token>"
  ```

### Project Endpoints

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

#### Get All Projects
- **GET** `/projects/all`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/projects/all \
    -H "Authorization: Bearer <token>"
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

#### Get Project by ID
- **GET** `/projects/get-project/:projectId`
- **Headers:** `Authorization: Bearer <token>`
- **Example (curl):**
  ```sh
  curl -X GET http://localhost:4000/projects/get-project/<projectId> \
    -H "Authorization: Bearer <token>"
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

---

## Frontend Usage

- Register and login from `/register` and `/login`.
- Use the dashboard to create and manage projects.
- Open a project to chat, add contributors, and edit files in real time.
- Logout securely from the project or dashboard page.

---

## WebSocket Usage

- The frontend uses Socket.io to connect to the backend for real-time chat.
- Connect with `token` (JWT) and `projectId` as query params or in `auth`.
- Join project room for real-time chat and updates.

---

## Code Examples

### Example: Register a User (Frontend)
```js
import axios from '../config/axios';

axios.post('/users/register', {
  fullname: { firstname: 'John', lastname: 'Doe' },
  email: 'john@example.com',
  password: 'yourpassword'
})
.then(res => console.log(res.data))
.catch(err => console.error(err));
```

### Example: Real-time Chat (Frontend)
```js
import { initializeSocket, sendMessage, receiveMessage } from '../config/socket';

const socket = initializeSocket(projectId);

sendMessage('project-message', { message: 'Hello!', sender: user });

receiveMessage('project-message', (data) => {
  console.log('Received:', data);
});
```

---

## Troubleshooting
- **CORS errors:** Ensure `VITE_API_URL` matches your backend URL and CORS is enabled on the backend.
- **Socket connection issues:** Check that the backend is running and the token is valid.
- **UI not updating:** Make sure you are using the latest token and user context is set.

---

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License
MIT

---

> _ChatWizz — Modern, collaborative, and open source._
