# Microservices with Fastify
A modern, scalable microservices architecture built with Fastify, TypeScript, and Kafka.

## Project Overview
This project demonstrates a microservices architecture using Fastify as the web framework, with event-driven communication via Kafka. The application provides a RESTful API for managing posts with persistence and event publishing capabilities.

## Technologies Used
- Fastify : High-performance web framework for Node.js
- TypeScript : Typed JavaScript for better developer experience
- Kafka : Distributed event streaming platform for service communication
- Docker & Docker Compose : Containerization and orchestration
- Jest : Testing framework for unit and integration tests
- Node.js : JavaScript runtime
## Features
- RESTful API for post management (create, read)
- Event-driven architecture with Kafka
- Persistent storage with file-based data
- Containerized deployment with Docker
- Comprehensive test suite
- Health check endpoint
## Project Structure
microservices-with-fastify/
├── src/
│   ├── kafka/
│   │   ├── consumer.ts    # Kafka consumer implementation
│   │   └── producer.ts    # Kafka producer implementation
│   ├── models/
│   │   └── post.ts        # Post model definition
│   ├── routes/
│   │   └── posts.ts       # API routes for posts
│   ├── services/
│   │   └── postService.ts # Business logic for posts
│   ├── app.ts             # Fastify app configuration
│   └── index.ts           # Application entry point
├── tests/
│   └── posts.test.ts      # API tests
├── data/                  # Persistent data storage
├── dist/                  # Compiled JavaScript output
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker image definition
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
## Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose (for containerized deployment)
- npm or yarn
## Getting Started
### Local Development
1. Clone the repository:
git clone https://github.com/robsdagreat/microservices-with-fastify.git
cd microservices-with-fastify

2. Install dependencies:
npm install

3. Start the development server:
npm run dev  

## Using Docker Compose
For a complete environment with Kafka and Zookeeper:

1. Build and start the containers:
   docker-compose up -d
2. The API will be available at http://localhost:3000

## API Endpoints
### GET /posts
Returns all posts.

### GET /posts/:id
Returns a specific post by ID

### POST /posts
Creates a new post.

### GET /health
Health check endpoint.

## Event-Driven Architecture
When a new post is created, an event is published to Kafka on the post_created topic. This allows other services to subscribe to these events and react accordingly.

The Kafka consumer in this service listens to the post_created topic and logs the event details, demonstrating how a microservice can consume events.

## Testing
Run the test suite with:
npm test

## Building for Production
1. Build the TypeScript code:
npm run build

2.Start the production server:
npm start

## Environment Variables
- PORT : Server port (default: 3000)
- KAFKA_BROKER : Kafka broker address (default: localhost:9092)
- KAFKA_ENABLED : Enable Kafka integration (default: false)
- KAFKA_CONNECTION_TIMEOUT : Kafka connection timeout in ms (default: 5000)
