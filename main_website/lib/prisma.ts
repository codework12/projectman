import { PrismaClient } from '@prisma/client';

// Set a connection limit for Prisma (adjust as needed)
const CONNECTION_LIMIT = 5;

// If using PostgreSQL, you can add ?connection_limit=5 to your DATABASE_URL in .env
// Example: DATABASE_URL="postgresql://user:pass@host:port/db?connection_limit=5"

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
} 