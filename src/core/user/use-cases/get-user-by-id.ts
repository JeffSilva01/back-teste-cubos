import { failure, success } from "../../shared/domain/result";
import type { UsersRepository } from "../domain/user.repository";
import { UserOutputMapper } from "./common/user-output";

interface GetUserByIdCaseInput {
	id: string;
}

export class GetUserByIdUseCase {
	constructor(private userRepository: UsersRepository) {}
	async execute(data: GetUserByIdCaseInput) {
		const user = await this.userRepository.findById(data.id);

		if (!user) {
			return failure("User not found");
		}

		return success(UserOutputMapper.toOutput(user));
	}
}
