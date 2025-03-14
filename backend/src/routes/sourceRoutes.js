import Source from "../models/Source.js";
import { ObjectId } from 'mongodb';

// Define the routes
export default async function sourceRoutes(fastify, options) {
  // POST /add-source
  fastify.post('/add-source', async (request, reply) => {
    try {
      const sourceData = request.body;
      const sourceId = await Source.addSource(sourceData);
      return { message: 'Source added successfully', sourceId };
    } catch (err) {
      reply.status(400).send({ message: err.message });
    }
  });


  // DELETE /remove-source/:id
  fastify.delete('/remove-source/:id', async (request, reply) => {

    try {
      const { id } = request.params;
      const objectId = new ObjectId(id);
      const isDeleted = await Source.removeSource(objectId);

      if (isDeleted) {
          return { message: `Source with id: ${id} removed successfully` };
      } else {
          return reply.status(404).send({ message: 'Source not found' });
      }
  } catch (err) {
      return reply.status(400).send({ message: err.message });
  }
  });

  // GET /sources
  fastify.get('/sources', async (request, reply) => {
    try {
      const sources = await Source.listSources();
      return reply.send({ sources });
  } catch (err) {
      console.error("Failed to fetch sources:", err.message); // Debugging log
      return reply.status(500).send({ message: 'Failed to fetch sources', error: err.message });
  }
  });
}

