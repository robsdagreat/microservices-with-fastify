import { FastifyInstance } from 'fastify';
import { build } from '../src/app';
import { postService } from '../src/services/postService';

// Mock Kafka producer to avoid actual Kafka connections during tests
jest.mock('../src/kafka/producer', () => ({
  sendMessage: jest.fn().mockResolvedValue(true),
  connectProducer: jest.fn().mockResolvedValue(undefined),
  disconnectProducer: jest.fn().mockResolvedValue(undefined),
}));

describe('Posts API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Clear any test data between tests
    jest.clearAllMocks();
    // Reset posts in the service
    postService.clearAllPosts();
  });

  test('GET /posts returns empty array initially', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/posts'
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ posts: [] });
  });

  test('POST /posts creates a new post', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: {
        title: 'Test Post',
        content: 'This is a test post',
        author: 'Test Author'
      }
    });

    expect(response.statusCode).toBe(201);
    const payload = JSON.parse(response.payload);
    expect(payload.post).toHaveProperty('id');
    expect(payload.post.title).toBe('Test Post');
    expect(payload.post.content).toBe('This is a test post');
    expect(payload.post.author).toBe('Test Author');
  });

  test('GET /posts/:id returns 404 for non-existent post', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/posts/non-existent-id'
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toEqual({ error: 'Post not found' });
  });
});