import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../env";
import * as schema from "./schema"; // importa todas as tabelas

export const db = drizzle(env.DATABASE_URL, { schema });
