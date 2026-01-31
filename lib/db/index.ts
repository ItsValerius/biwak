/**
 * Database layer – server only.
 * Importing this in a client component will throw (server-only boundary).
 */
import "server-only";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/biwak.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken: authToken || undefined,
});

export const db = drizzle(client, { schema });
