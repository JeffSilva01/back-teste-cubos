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
	async execute(data: CreateUserUseCaseInput) {
		if (data.password !== data.confirmPassword) {
			return failure("As senhas não coincidem");
		}

		const user = User.create(data);

		await this.userRepository.create(user);

		return success(UserOutputMapper.toOutput(user));
	}
}
