import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function run(): Promise<void> {
  const schemaPath = process.env.SCHEMA_SQL_PATH
    ? resolve(process.cwd(), process.env.SCHEMA_SQL_PATH)
    : resolve(process.cwd(), '../docs/design/schema.sql');

  const sql = await readFile(schemaPath, 'utf8');
  const client = new Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'sshopbot',
  });

  await client.connect();
  try {
    await client.query(sql);

    console.log(`Applied schema + seed from: ${schemaPath}`);
  } finally {
    await client.end();
  }
}

void run().catch((error) => {
  console.error('Failed to apply schema.sql', error);
  process.exitCode = 1;
});
