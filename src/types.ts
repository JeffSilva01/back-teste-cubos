import type {
	FastifyBaseLogger,
	FastifyInstance,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import "@fastify/jwt";

export type FastifyTypedInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	ZodTypeProvider
>;

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
		};
	}
}
