import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: import.meta.env.DEV ? ['error', 'warn'] : ['error'],
  })

/**
 * This is a hack to prevent Prisma from being instantiated twice in development.
 */
if (!import.meta.env.PROD) {
  globalForPrisma.prisma = prisma
}
