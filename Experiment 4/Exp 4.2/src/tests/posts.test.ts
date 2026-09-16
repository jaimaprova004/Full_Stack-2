import request from 'supertest';
import express from 'express';
import postsRouter from '../routes/posts.js';

const app = express();
app.use(express.json());
app.use('/api/posts', postsRouter);

describe('POST /api/posts', () => {
  it('creates and returns a post', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ title: 'New post', body: 'Body content' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: 'New post', body: 'Body content' });
  });
});

describe('GET /api/posts', () => {
  it('returns the current list of posts', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
