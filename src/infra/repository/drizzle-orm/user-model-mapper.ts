import { Uuid } from "../../../core/shared/domain/value-objects/uuid.vo";
import { User } from "../../../core/user/domain/user.entity";
import type { NewUser } from "../../db/schema";

export class UserModelMapper {
	static toModel(entity: User): NewUser {
		return {
			id: entity.userId.id,
			email: entity.email,
			password: entity.password,
		};
	}

	static toEntity(model: NewUser): User {
		const entity = new User({
			userId: new Uuid(model.id),
			email: model.email,
			password: model.password,
		});

		User.validate(entity);
		return entity;
	}
}
