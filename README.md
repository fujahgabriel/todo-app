# To-Do List API
A classic project that demonstrates CRUD operations (Create, Read, Update, Delete).

## Technologies:

- Node.js with Express.js
- MongoDB or PostgreSQL
- JWT for authentication

## Features
- User authentication
- CRUD operations for to-do items

## Endpoints
- `POST /api/users`: Register a new user
- `POST /api/auth`: Authenticate a user and get a token
- `GET /api/todos`: Get all todos for the authenticated user
- `POST /api/todos`: Create a new todo
- `PUT /api/todos/:id`: Update a todo
- `DELETE /api/todos/:id`: Delete a todo

## Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your MongoDB connection string and JWT secret
4. Run `node server.js` to start the server
