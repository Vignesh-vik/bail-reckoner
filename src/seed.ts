import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const userData = {
        email: 'newuser@example.com', // Ensure this email does not exist in the DB
        username: 'New User',
        password: 'strongpassword123', // Normally, you would hash this password
        role: 'AID_PROVIDER' as const // Ensure the role is one of the enum values
    };

    console.log('Creating user with data:', userData);

    try {
        const user = await prisma.user.create({
            data: userData,
        });
        console.log('User created:', user);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
