export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
	constructor(public readonly data: T) {}

	isSuccess(): this is Success<T> {
		return true;
	}

	isFailure(): this is Failure<any> {
		return false;
	}
}

export class Failure<E> {
	constructor(public readonly error: E) {}

	isSuccess(): this is Success<any> {
		return false;
	}

	isFailure(): this is Failure<E> {
		return true;
	}
}

// Helper functions
export const success = <T>(data: T): Success<T> => new Success(data);
export const failure = <E>(error: E): Failure<E> => new Failure(error);
