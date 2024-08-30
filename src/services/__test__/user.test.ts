// user.test.ts
import { PrismaClient, Role } from "@prisma/client";
import { createUser, findUserByEmail } from "../userServices"; // Adjust the path as needed
import bcrypt from "bcrypt";

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const prisma = new PrismaClient();

describe("User Service", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const hashedPassword = "hashedPassword";
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        role: Role.AID_PROVIDER, // Use Role enum here
      };

      // Mock the bcrypt hash function
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock the Prisma user.create function
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "1",
        ...userData,
        password: hashedPassword,
      });

      const result = await createUser({ userInput: userData });
      expect(result.email).toBe(userData.email);
      expect(result.password).toBe(hashedPassword);
    });

    it("should fail to create a user if email already exists", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        role: Role.AID_PROVIDER,
      };

      // Mock findUnique to simulate an existing user
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

      await expect(createUser({ userInput: userData })).rejects.toThrow(
        "User already exists"
      );
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        role: Role.AID_PROVIDER,
      };

      // Mock findUnique to return a user
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

      const result = await findUserByEmail(userData.email);
      expect(result).toBe(userData);
    });

    it("should return null if user is not found", async () => {
      // Mock findUnique to return null
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await findUserByEmail("nonexistent@example.com");
      expect(result).toBeNull();
    });
  });
});
