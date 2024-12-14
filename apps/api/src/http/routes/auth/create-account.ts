import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      /// Check if a user with the same email already exists
      if (userWithSameEmail) {
        return reply
          .status(400)
          .send({ message: 'User with the same email already exists' });
      }

      // Hash the password
      const passwordHash = await hash(password, 6);

      // Create a new user in the database
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      return reply.status(201).send({ message: 'User created' });
    }
  );
}
