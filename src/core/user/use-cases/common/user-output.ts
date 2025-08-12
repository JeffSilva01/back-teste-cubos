import type { User } from "../../domain/user.entity";

export type UserOutput = {
	id: string;
	email: string;
};

export class UserOutputMapper {
	static toOutput(entity: User): UserOutput {
		const { userId, ...otherProps } = entity.toJSON();
		return { id: userId, ...otherProps };
	}
}
