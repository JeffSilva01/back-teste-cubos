import { beforeEach, describe, expect, it } from "vitest";
import { InMemoreUsersRepository } from "../../../infra/repository/in-memory/in-memore-users-repository";
import { CreateUserUseCase } from "./create-user";

describe("CreateUserUseCase", () => {
	let createUserUseCase: CreateUserUseCase;
	let inMemoryRepository: InMemoreUsersRepository;

	beforeEach(() => {
		inMemoryRepository = new InMemoreUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryRepository);
	});

	describe("execute", () => {
		it("deve criar um usuário com sucesso quando os dados são válidos", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);
			expect(result.data).toHaveProperty("id");
			expect(result.data).toHaveProperty("email", "test@example.com");
		});

		it("deve retornar erro quando as senhas não coincidem", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password456",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("As senhas não coincidem");
		});

		it("deve criar múltiplos usuários com emails diferentes", async () => {
			// Arrange
			const input1 = {
				email: "usuario1@teste.com",
				password: "password123",
				confirmPassword: "password123",
			};

			const input2 = {
				email: "usuario2@teste.com",
				password: "password456",
				confirmPassword: "password456",
			};

			// Act
			const result1 = await createUserUseCase.execute(input1);
			const result2 = await createUserUseCase.execute(input2);

			// Assert
			expect(result1.isSuccess()).toBe(true);
			expect(result2.isSuccess()).toBe(true);
		});

		it("deve lidar com senhas vazias quando coincidem", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "",
				confirmPassword: "",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);
			expect(result.data).toHaveProperty("email", "test@example.com");
		});

		it("deve retornar erro quando password está vazio mas confirmPassword não", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "",
				confirmPassword: "password123",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("As senhas não coincidem");
		});

		it("deve retornar erro quando confirmPassword está vazio mas password não", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "password123",
				confirmPassword: "",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isFailure()).toBe(true);
			expect(result.error).toBe("As senhas não coincidem");
		});

		it("deve gerar ids únicos para cada usuário criado", async () => {
			// Arrange
			const input = {
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			// Act
			const result1 = await createUserUseCase.execute(input);

			// Mudando apenas o email para criar outro usuário
			const input2 = { ...input, email: "test2@example.com" };
			const result2 = await createUserUseCase.execute(input2);

			// Assert
			expect(result1.isSuccess()).toBe(true);
			expect(result2.isSuccess()).toBe(true);
			expect(result1.data.id).not.toBe(result2.data.id);
		});

		it("deve verificar se o usuário pode ser encontrado por email após criação", async () => {
			// Arrange
			const input = {
				email: "findme@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);

			const foundUser =
				await inMemoryRepository.findByEmail("findme@example.com");
			expect(foundUser).not.toBeNull();
			expect(foundUser?.email).toBe("findme@example.com");
		});

		it("deve verificar se o usuário pode ser encontrado por id após criação", async () => {
			// Arrange
			const input = {
				email: "findbyid@example.com",
				password: "password123",
				confirmPassword: "password123",
			};

			// Act
			const result = await createUserUseCase.execute(input);

			// Assert
			expect(result.isSuccess()).toBe(true);

			const foundUser = await inMemoryRepository.findById(result?.data?.id);
			expect(foundUser).not.toBeNull();
			expect(foundUser?.userId.id).toBe(result.data.id);
			expect(foundUser?.email).toBe("findbyid@example.com");
		});
	});
});
