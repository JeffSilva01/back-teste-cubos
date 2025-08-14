import { compare } from "bcryptjs";
import { failure, success } from "../../shared/domain/result";
import type { UsersRepository } from "../domain/user.repository";
import { UserOutputMapper } from "./common/user-output";

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ email, password }: AuthenticateUseCaseRequest) {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return failure("Credenciais invalidas");
		}

		const doesPasswordMatches = await compare(password, user.password);

		if (!doesPasswordMatches) {
			return failure("Credenciais invalidas");
		}

		return success(UserOutputMapper.toOutput(user));
	}
}
