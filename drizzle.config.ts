import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/infra/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
