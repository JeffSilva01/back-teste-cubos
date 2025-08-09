import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

async function index(_: FastifyRequest, replay: FastifyReply) {
	return replay.status(200).send({ message: "Hello world" });
}

app.get("/", index);

app.setErrorHandler((error, _, replay) => {
	if (error instanceof ZodError) {
		return replay
			.status(400)
			.send({ message: "Validation error", issues: error.issues });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
	}

	return replay.status(500).send({ message: "Internal server error" });
});
