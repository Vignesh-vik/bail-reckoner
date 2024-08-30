// src/prismaClient.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Enable different log levels
});

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to MongoDB via Prisma');
    } catch (error) {
        console.error('Error connecting to MongoDB via Prisma:', error);
    }
}

testConnection();

export default prisma;
