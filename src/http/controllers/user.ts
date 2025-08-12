import z from "zod";
import { CreateUserUseCase } from "../../core/user/use-cases/create-user";
import { GetUserByIdUseCase } from "../../core/user/use-cases/get-user-by-id";
import { DrizzleUsersRepository } from "../../infra/repository/drizzle-orm/drizzle-orm-user-repository";
import type { FastifyTypedInstance } from "../../types";

export async function userRouter(app: FastifyTypedInstance) {
	app.post(
		"/users",
		{
			schema: {
				tags: ["user"],
				description: "Create a new user",
				body: z.object({
					email: z.email(),
					password: z.string().min(8),
					confirmPassword: z.string().min(8),
				}),
				response: {
					201: z.object({
						userId: z.string(),
					}),
					400: z.string("bad request"),
				},
			},
		},
		async (request, reply) => {
			const { email, password, confirmPassword } = request.body;

			const userRepository = new DrizzleUsersRepository();
			const createUser = new CreateUserUseCase(userRepository);
			const result = await createUser.execute({
				email,
				password,
				confirmPassword,
			});

			if (result.isFailure()) {
				return reply.status(400).send(result.error);
			}

			return reply.status(201).send({
				userId: result.data.id,
			});
		},
	);

	app.get(
		"/users/:userId",
		{
			schema: {
				tags: ["user"],
				description: "Get a user by id",
				params: z.object({
					userId: z.uuid(),
				}),
				response: {
					404: z.string("user not found"),
					200: z.object({
						data: z.object({
							id: z.string(),
							email: z.string(),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { userId } = request.params;

			const userRepository = new DrizzleUsersRepository();
			const getUserById = new GetUserByIdUseCase(userRepository);
			const user = await getUserById.execute({ id: userId });

			if (user.isFailure()) {
				return reply.status(404).send(user.error);
			}

			return reply.status(200).send({ data: user.data });
		},
	);
}
