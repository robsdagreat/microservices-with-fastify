import { Kafka, Producer } from 'kafkajs';

// Create Kafka client
const kafka = new Kafka({
  clientId: 'post-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

// Create producer
const producer: Producer = kafka.producer();
let isConnected = false;

// Connect to Kafka
export const connectProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    isConnected = true;
    console.log('Producer connected to Kafka');
  } catch (error:any) {
    console.error('Failed to connect producer to Kafka:', error.message);
    isConnected = false;
  }
};

// Send message to Kafka with timeout
export const sendMessage = async (topic: string, message: any): Promise<boolean> => {
  if (!isConnected) {
    console.log(`Kafka not connected, skipping message to topic ${topic}`);
    return false;
  }
  
  try {
    // Add a timeout to the Kafka operation
    const sendPromise = producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) }
      ]
    });
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Kafka send operation timed out')), 5000);
    });
    
    // Race the promises
    await Promise.race([sendPromise, timeoutPromise]);
    console.log(`Message sent to topic ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
    return false;
  }
};