

// Define the routes
export default async function sourceRoutes(fastify, options) {
  // POST /add-source
  fastify.post('/add-source', async (request, reply) => {
    return { message: 'Add source endpoint' };
  });

  // DELETE /remove-source/:id
  fastify.delete('/remove-source/:id', async (request, reply) => {
    const { id } = request.params;
    return { message: `Remove source with id: ${id}` };
  });

  // GET /sources
  fastify.get('/sources', async (request, reply) => {
    return { message: 'List all sources' };
  });
}

