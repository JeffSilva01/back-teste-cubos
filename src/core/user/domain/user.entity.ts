import { Entity } from "../../shared/domain/entity";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

export type UserConstructorProps = {
	userId?: UserId;
	email: string;
	password: string;
};

export type UserCreateComand = {
	email: string;
	password: string;
};

type UserId = Uuid;

export class User extends Entity {
	userId: UserId;
	email: string;
	password: string;

	constructor(props: UserConstructorProps) {
		super();
		this.userId = props.userId ?? new Uuid();
		this.email = props.email;
		this.password = props.password;
	}

	get entityId() {
		return this.userId;
	}

	static create(props: UserCreateComand): User {
		const user = new User(props);
		return user;
	}

	toJSON() {
		return {
			userId: this.userId.id,
			email: this.email,
		};
	}
}
