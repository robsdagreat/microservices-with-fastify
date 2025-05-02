import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { postService } from '../services/postService';
import { sendMessage } from '../kafka/producer';

interface PostRequest {
  title: string;
  content: string;
  author: string;
}

interface ParamsRequest {
  id: string;
}

export default async function (fastify: FastifyInstance): Promise<void> {
  // GET /posts - Get all posts
  fastify.get('/posts', async (request: FastifyRequest, reply: FastifyReply) => {
    const posts = postService.getAllPosts();
    return { posts };
  });

  // GET /posts/:id - Get post by ID
  fastify.get<{ Params: ParamsRequest }>('/posts/:id', async (request, reply) => {
    const { id } = request.params;
    const post = postService.getPostById(id);
    
    if (!post) {
      reply.code(404);
      return { error: 'Post not found' };
    }
    
    return { post };
  });

  // POST /posts - Create a new post
  fastify.post<{ Body: PostRequest }>('/posts', async (request, reply) => {
    const { title, content, author } = request.body;
    
    // Validate input
    if (!title || !content || !author) {
      reply.code(400);
      return { error: 'Title, content, and author are required' };
    }
    
    // Create post
    const post = postService.createPost(title, content, author);
    
    // Try to send Kafka message but don't wait indefinitely
    try {
      const kafkaPromise = sendMessage('post_created', post);
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log('Kafka message send timed out, continuing with response');
          resolve(false);
        }, 3000);
      });
      
      await Promise.race([kafkaPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to send Kafka message, but continuing with response:', error);
    }
    
    // Always respond to the client, even if Kafka fails
    reply.code(201);
    return { post };
  });
}