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
    const { id } = request.params;
    const objectId = new ObjectId(id);
    const isDeleted = await Source.removeSource(objectId);
    if (isDeleted) {
      return { message: `Source with id: ${id} removed successfully` };
    } else {
      reply.status(404).send({ message: 'Source not found' });
    }
  });

  // GET /sources
  fastify.get('/sources', async (request, reply) => {
      const sources = await Source.listSources();
    return { sources };
  });
}

