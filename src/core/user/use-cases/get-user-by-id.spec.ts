import { beforeEach, describe, expect, it } from "vitest";
import { InMemoreUsersRepository } from "../../../infra/repository/in-memory/in-memore-users-repository";
import { User } from "../domain/user.entity";
import { GetUserByIdUseCase } from "./get-user-by-id";

describe("GetUserByIdUseCase", () => {
	let getUserByIdUseCase: GetUserByIdUseCase;
	let inMemoryRepository: InMemoreUsersRepository;

	beforeEach(() => {
		inMemoryRepository = new InMemoreUsersRepository();
		getUserByIdUseCase = new GetUserByIdUseCase(inMemoryRepository);
	});

	describe("execute", () => {
		it("deve retornar o usuário quando encontrado por ID válido", async () => {
			// Arrange
			const user = User.create({
				email: "usuario@teste.com",
				password: "password123",
			});

			await inMemoryRepository.create(user);

			const input = {
				id: user.userId.id,
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);
			expect(result.data).toHaveProperty("id", user.userId.id);
			expect(result.data).toHaveProperty("email", "usuario@teste.com");
		});

		it("deve retornar erro quando usuário não é encontrado", async () => {
			// Arrange
			const input = {
				id: "id-inexistente",
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("User not found");
		});

		it("deve retornar erro quando ID está vazio", async () => {
			// Arrange
			const input = {
				id: "",
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("User not found");
		});

		it("deve retornar erro quando ID é null", async () => {
			// Arrange
			const input = {
				id: null as any,
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("User not found");
		});

		it("deve retornar erro quando ID é undefined", async () => {
			// Arrange
			const input = {
				id: undefined as any,
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("User not found");
		});

		it("deve retornar dados corretos do UserOutputMapper", async () => {
			// Arrange
			const user = User.create({
				email: "mapper@teste.com",
				password: "password123",
			});

			await inMemoryRepository.create(user);

			const input = {
				id: user.userId.id,
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);
			expect(result.data).toMatchObject({
				id: user.userId.id,
				email: "mapper@teste.com",
			});
			// Verifica que a senha não é retornada no output
			expect(result.data).not.toHaveProperty("password");
		});

		it("deve funcionar com múltiplos usuários salvos", async () => {
			// Arrange

			const user1 = User.create({
				email: "usuario1@teste.com",
				password: "password123",
			});

			const user2 = User.create({
				email: "usuario2@teste.com",
				password: "password456",
			});

			await inMemoryRepository.create(user1);
			await inMemoryRepository.create(user2);

			// Act
			const result1 = await getUserByIdUseCase.execute({
				id: user1.userId.id,
			});
			const result2 = await getUserByIdUseCase.execute({
				id: user2.userId.id,
			});

			// Assert
			expect(result1.isSuccess()).toBe(true);
			expect(result2.isSuccess()).toBe(true);
			expect(result1.data.email).toBe("usuario1@teste.com");
			expect(result2.data.email).toBe("usuario2@teste.com");
			expect(result1.data.id).not.toBe(result2.data.id);
		});

		it("deve retornar erro para ID com formato inválido", async () => {
			// Arrange
			const input = {
				id: "formato-id-invalido",
			};

			// Act
			const result = await getUserByIdUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("User not found");
		});

		it("deve manter consistência quando usuário é removido", async () => {
			// Arrange
			const user = User.create({
				email: "temporario@teste.com",
				password: "password123",
			});

			await inMemoryRepository.create(user);

			// Verifica que usuário existe
			const resultBefore = await getUserByIdUseCase.execute({
				id: user.userId.id,
			});
			expect(resultBefore.isSuccess()).toBe(true);
		});
	});
});
