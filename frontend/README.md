# ChatWizz Frontend

A modern, collaborative chat and project management frontend built with React, Tailwind CSS, and Socket.io. This app connects to the ChatWizz backend for real-time messaging, authentication, and project management.

---

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Usage Examples](#api-usage-examples)
- [Component Overview](#component-overview)
- [Code Snippets](#code-snippets)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User registration and login (with JWT authentication)
- (Planned) Google OAuth registration
- Dashboard for managing projects
- Real-time chat within projects
- Add/remove project contributors
- File tree and code editor integration
- Responsive, modern UI with Tailwind CSS
- Logout and session management
- Socket.io for real-time updates

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- The ChatWizz backend running (see backend/README.md)

### Installation
1. Clone the repository (if not already):
   ```sh
   git clone <repo-url>
   cd ChatWizz/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory and set the backend API URL:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Project Structure

```
frontend/
  ├── public/
  ├── src/
  │   ├── auth/           # Authentication logic (UserAuth)
  │   ├── config/         # Axios, socket, webcontainer configs
  │   ├── context/        # User context provider
  │   ├── routes/         # AppRoutes (React Router)
  │   ├── screens/        # Main pages: Home, Login, Register, Dashboard, Project
  │   ├── index.css       # Tailwind and global styles
  │   └── main.jsx        # Entry point
  ├── tailwind.config.js
  ├── vite.config.js
  └── ...
```

---

## Environment Variables
- `VITE_API_URL` — The base URL of your backend API (default: `http://localhost:4000`)

---

## Usage

### Register
- Go to `/register` and fill in your details.
- On success, you will be redirected to login.

### Login
- Go to `/login` and enter your credentials.
- On success, you will be redirected to the dashboard.

### Dashboard
- View, create, and manage your projects.
- Click a project to open its chat and file editor.

### Project Page
- Real-time chat with contributors.
- Add collaborators.
- Edit project files (code editor).
- Logout securely.

---

## API Usage Examples

### Register a User
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

### Login
```js
axios.post('/users/login', {
  email: 'john@example.com',
  password: 'yourpassword'
})
.then(res => {
  localStorage.setItem('token', res.data.token);
  // ...
});
```

### Get Projects
```js
axios.get('/projects/all')
  .then(res => console.log(res.data.projects));
```

### Real-time Chat (Socket.io)
```js
import { initializeSocket, sendMessage, receiveMessage } from '../config/socket';

const socket = initializeSocket(projectId);

sendMessage('project-message', { message: 'Hello!', sender: user });

receiveMessage('project-message', (data) => {
  console.log('Received:', data);
});
```

---

## Component Overview

### `src/screens/Register.jsx`
- Handles user registration.
- (Planned) Google OAuth registration button.

### `src/screens/Login.jsx`
- Handles user login.

### `src/screens/Dashboard.jsx`
- Shows all projects for the user.
- Allows creating new projects.

### `src/screens/Project.jsx`
- Main project workspace: chat, contributors, file editor.
- Add/remove collaborators.
- Logout button.

### `src/auth/UserAuth.jsx`
- Protects routes by checking for a valid token and user context.

### `src/config/axios.js`
- Axios instance with JWT token interceptor.

### `src/config/socket.js`
- Socket.io client setup for real-time messaging.

### `src/context/user.context.jsx`
- React context for user state.

---

## Code Snippets

### Example: Protecting a Route
```js
<Route path="/project" element={<UserAuth><Project /></UserAuth>} />
```

### Example: User Context
```js
const { user, setUser } = useContext(UserContext);
```

### Example: Logout
```js
async function handleLogout() {
  await axios.post('/users/logout');
  localStorage.removeItem('token');
  navigate('/login');
}
```

---

## FAQ

### Why do I get redirected to login after refreshing?
- The app fetches your profile using the token on reload. If the token is missing or invalid, you are redirected to login.

### How do I add Google OAuth?
- Integrate a Google OAuth button in `Register.jsx` and handle the OAuth flow with your backend.

### How do I run the backend?
- See `backend/README.md` for setup instructions.

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

> _ChatWizz Frontend — Modern, collaborative, and open source._
