import isEqual from "lodash/isEqual";

export abstract class ValueObject {
	public equals(valueObject: this): boolean {
		if (valueObject === null || valueObject === undefined) {
			return false;
		}

		if (this.constructor.name !== valueObject.constructor.name) {
			return false;
		}

		return isEqual(this, valueObject);
	}
}
