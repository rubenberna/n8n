import { PrismaClient } from "@/lib/generated/prisma/client";

// Adds to the global object so that we can use it in the entire application
// This setup is to avoid creating a new instance of the PrismaClient for each request (hot reloading) in development mode
// Global is a global object in Node.js that is not affected by hot reloading
export const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Creates a new PrismaClient instance if it doesn't exist
export const prisma = globalForPrisma.prisma || new PrismaClient();

// If we are not in production, set the global object to the prisma instance
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
