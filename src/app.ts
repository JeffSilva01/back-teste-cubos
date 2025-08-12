import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { env } from "./env";
import { userRouter } from "./http/controllers/user";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Typed API",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(userRouter);

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
