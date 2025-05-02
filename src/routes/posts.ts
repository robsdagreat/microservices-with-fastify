import { FastifyInstance } from 'fastify';
import { postController } from '../controllers/postController';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get('/posts', postController.getAllPosts);
  fastify.get('/posts/:id', postController.getPostById);
  fastify.post('/posts', postController.createPost);
}