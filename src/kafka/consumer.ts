import { Kafka, Consumer } from 'kafkajs';

// Create Kafka client
const kafka = new Kafka({
  clientId: 'post-service-consumer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

// Create consumer
const consumer: Consumer = kafka.consumer({ groupId: 'post-service-group' });

// Connect to Kafka and subscribe to topics
export const connectConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();
    console.log('Consumer connected to Kafka');
    
    await consumer.subscribe({ topic: 'post_created', fromBeginning: true });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
          const messageValue = message.value.toString();
          console.log(`Received message from topic ${topic}:`, messageValue);
          
          try {
            const post = JSON.parse(messageValue);
            console.log(`New post created: "${post.title}" by ${post.author}`);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect consumer to Kafka:', error);
    // Retry connection after delay
    setTimeout(connectConsumer, 5000);
  }
};