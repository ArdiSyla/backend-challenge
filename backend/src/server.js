import Fastify from 'fastify';
import dotenv from 'dotenv';
import sourceRoutes from './routes/sourceRoutes.js';


// Load environment variables
dotenv.config();

// Initialize Fastify
const fastify = Fastify({
  logger: true,
});

// Register routes
fastify.register(sourceRoutes);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();