// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from './schema'

// export const db = drizzle({connection: process.env.DATABASE_URL!, casing: 'snake_case', schema: {...schema} });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const sql = neon(process.env.NEON_DATABASE_URL!);
export const db = drizzle({ client: sql, schema: { ...schema} })
