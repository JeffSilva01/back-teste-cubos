import type { User } from "../../../core/user/domain/user.entity";
import type { UsersRepository } from "../../../core/user/domain/user.repository";

export class InMemoreUsersRepository implements UsersRepository {
	private itens: User[] = [];

	async create(data: User) {
		this.itens.push(data);
	}

	findByEmail(email: string): Promise<User | null> {
		return Promise.resolve(
			this.itens.find((user) => user.email === email) || null,
		);
	}

	findById(id: string): Promise<User | null> {
		return Promise.resolve(
			this.itens.find((user) => user.userId.toString() === id) || null,
		);
	}
}
