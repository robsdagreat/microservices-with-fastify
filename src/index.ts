import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
// Create Fastify instance
const server: FastifyInstance = Fastify({
  logger: true
});


server.register(cors, {
  origin: true
});


// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start the server
const start = async (): Promise<void> => {
  try {
    
    // Start server
    await server.listen({ 
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000, 
      host: '0.0.0.0' 
    });
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Start server if this file is run directly
if (require.main === module) {
  start();
}

export default server;