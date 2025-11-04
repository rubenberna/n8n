import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db/db";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar/polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "8e0d2162-3c96-4610-af2e-ae64f42cea5d",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true, // Customers must be authenticated via Better Auth to checkout
        }),
        portal(),
      ],
    }),
  ],
});
