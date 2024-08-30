// src/server.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './PrismaClient'; // Import the Prisma client

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the backend!');
});

// Test the connection to the database with a simple query
async function testDatabaseConnection() {
    try {
        const users = await prisma.user.findMany();
        console.log(`Connected to MongoDB. Found ${users.length} users.`);
    } catch (error) {
        console.error('Error running query:', error);
    }
}

testDatabaseConnection();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
