import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, replay: FastifyReply) {
	try {
		await request.jwtVerify();
	} catch (_error) {
		replay.status(401).send({ message: "Unauthorized" });
	}
}
