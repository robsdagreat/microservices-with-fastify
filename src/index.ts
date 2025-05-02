import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import postsRoutes from './routes/posts';
import { connectProducer } from './kafka/producer';
import { connectConsumer } from './kafka/consumer';

// Create Fastify instance
const server: FastifyInstance = Fastify({
  logger: true
});

// Register CORS
server.register(cors, {
  origin: true
});

// Register routes
server.register(postsRoutes);

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start the server
const start = async (): Promise<void> => {
  try {
    // Connect to Kafka if KAFKA_ENABLED is set to true
    if (process.env.KAFKA_ENABLED === 'true') {
      try {
        await connectProducer();
        await connectConsumer();
        console.log('Kafka connections established');
      } catch (kafkaError:any) {
        console.error('Failed to connect to Kafka, continuing without Kafka:', kafkaError.message);
      }
    } else {
      console.log('Kafka connections disabled');
    }
    
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