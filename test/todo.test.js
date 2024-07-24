// test/todo.test.js
const request = require('supertest');
const app = require('../app');
const Todo = require('../models/todo');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let token;
let userId;

describe('Todo API', () => {
  beforeAll(async () => {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a user and get a token
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', password: 'password' });
    token = res.body.token;
    
    const decoded = jwt.decode(token);
    userId = decoded.user.id;
  });

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Todo.deleteMany({});
    await mongoose.connection.close();
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'testuser2', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Todo' });
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('title', 'Test Todo');
      expect(res.body).toHaveProperty('completed', false);
      expect(res.body).toHaveProperty('user', userId);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const todo = new Todo({
        title: 'Test Todo',
        user: userId
      });
      await todo.save();
      const res = await request(app)
        .put(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Todo', completed: true });
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('title', 'Updated Todo');
      expect(res.body).toHaveProperty('completed', true);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = new Todo({
        title: 'Test Todo',
        user: userId
      });
      await todo.save();
      const res = await request(app)
        .delete(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Todo removed');
    });
  });
});
