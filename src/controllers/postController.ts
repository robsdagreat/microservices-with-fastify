import { FastifyRequest, FastifyReply } from 'fastify';
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

export const postController = {
  getAllPosts: async (request: FastifyRequest, reply: FastifyReply) => {
    const posts = postService.getAllPosts();
    return { posts };
  },

  getPostById: async (request: FastifyRequest<{ Params: ParamsRequest }>, reply: FastifyReply) => {
    const { id } = request.params;
    const post = postService.getPostById(id);
    
    if (!post) {
      reply.code(404);
      return { error: 'Post not found' };
    }
    
    return { post };
  },

  createPost: async (request: FastifyRequest<{ Body: PostRequest }>, reply: FastifyReply) => {
    const { title, content, author } = request.body;
    
    if (!title || !content || !author) {
      reply.code(400);
      return { error: 'Title, content, and author are required' };
    }
    
    const post = postService.createPost(title, content, author);
    
    try {
      const kafkaPromise = sendMessage('post_created', post);
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 3000);
      });
      
      await Promise.race([kafkaPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to send Kafka message, but continuing with response:', error);
    }
    
    reply.code(201);
    return { post };
  }
};