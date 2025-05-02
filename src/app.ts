import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import postsRoutes from './routes/posts';

// Build the server
export async function build(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({
    logger: false // Disable logging during tests
  });

  // Register CORS
  await server.register(cors, {
    origin: true
  });

  // Register routes
  await server.register(postsRoutes);

  return server;
}