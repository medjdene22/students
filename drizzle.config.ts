import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const database_url = process.env.NEON_DATABASE_URL!
// const database_url = process.env.DATABASE_URL!


export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: database_url,
  },
});
