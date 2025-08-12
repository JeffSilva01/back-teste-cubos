import type { UsersRepository } from "../../../core/user/domain/user.repository";
import { db } from "../../db/connections";
import { type NewUser, usersTable } from "../../db/schema";
import { UserModelMapper } from "./user-model-mapper";

export class DrizzleUsersRepository implements UsersRepository {
	async create({ email, password }: NewUser) {
		await db
			.insert(usersTable)
			.values({
				email,
				password,
			})
			.returning();
	}

	async findByEmail(email: string) {
		const user = await db.query.usersTable.findFirst({
			where(filds, { eq }) {
				return eq(filds.email, email);
			},
		});

		if (!user) {
			return null;
		}

		return UserModelMapper.toEntity(user);
	}

	async findById(id: string) {
		console.log("id repository", id);
		const user = await db.query.usersTable.findFirst({
			where(filds, { eq }) {
				return eq(filds.id, id);
			},
		});

		if (!user) {
			return null;
		}

		return UserModelMapper.toEntity(user);
	}
}
