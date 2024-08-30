// src/services/userService.ts
import prisma from "../PrismaClient.js";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client"; // Import Role enum from Prisma client

interface UserInput {
  email: string;
  password: string;
  username?: string;
  role?: Role; // Optional role, defaults to AID_PROVIDER
}

// Function to create a new user
async function createUser({ userInput }: { userInput: UserInput }) {
  const { email, password, username, role } = userInput;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      role: role || Role.REPRESENTATIVE, // Default to AID_PROVIDER if role is not provided
    },
  });
}

// Function to find a user by email
async function findUserByEmail(email: string) {
  // Find the user by email in the database
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export { createUser, findUserByEmail };
