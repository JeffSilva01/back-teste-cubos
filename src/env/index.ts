import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z
		.string()
		.default("postgresql://docker:docker@localhost:5432/docker"),
	NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
	JWT_SECRET: z.string().default("secret"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error("Invalid environment variables", _env.error.issues);
	throw new Error("Invalid environment variables");
}

export const env = _env.data;
