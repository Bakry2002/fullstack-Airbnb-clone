import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;
// to avoid hot reloading in prisma with next js

export default client;
