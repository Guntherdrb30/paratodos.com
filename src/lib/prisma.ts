import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
        process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL
}

if (!process.env.DIRECT_URL) {
    process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING
}

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
