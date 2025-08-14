import { hash } from "bcryptjs";
import { failure, success } from "../../shared/domain/result";
import { User } from "../domain/user.entity";
import type { UsersRepository } from "../domain/user.repository";
import { UserOutputMapper } from "./common/user-output";

interface CreateUserUseCaseInput {
	email: string;
	password: string;
	confirmPassword: string;
}

export class CreateUserUseCase {
	constructor(private userRepository: UsersRepository) {}
	async execute({ email, password, confirmPassword }: CreateUserUseCaseInput) {
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			return failure("Email já cadastrado");
		}

		if (password !== confirmPassword) {
			return failure("As senhas não coincidem");
		}

		const password_hash = await hash(password, 6);

		const user = User.create({ email, password: password_hash });

		await this.userRepository.create(user);

		return success(UserOutputMapper.toOutput(user));
	}
}
