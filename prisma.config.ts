import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // DIRECT_URL is used for migrations (session-mode pooler, no pgBouncer)
    // DATABASE_URL is the transaction-mode pooler for runtime queries
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
