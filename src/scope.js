const isInvalid = (value) => value == null || (typeof value !== "object" && typeof value !== "function");

const spitPath = (path) => path.split(".");

export default class Scope {
	constructor (stack) {
		this.stack = [].concat(stack);
		this.get = this.get.bind(this);
		this.new = this.new.bind(this);
	}
	new (scope) {
		return new Scope([...this.stack, scope || {}]);
	}
	get (chain, callArgs, isLocal, getter, setter) {
		let chainIdx = 0;
		let value;
		if (isLocal) {
			value = getter;
		}
		else {
			try {
				value = getter();
				if (!callArgs && typeof setter === "function" && chain.length > 1 && isInvalid(value)) {
					value = {};
					setter(value);
				}
				chainIdx = 1;
			}
			catch (error) {/**/}
		}

		let context = value;
		if (chainIdx === 0) { // find key in scope stack
			let i = this.stack.length - 1;
			const key = chain[0];
			while (i >= 0) {
				if (key in this.stack[i] || i === 0) {
					context = this.stack[i];
					break;
				}
				i--;
			}
		}

		while (chainIdx < chain.length) {
			const key = chain[chainIdx];
			value = context[key];
			if (setter) {
				if (chainIdx === chain.length - 1) {
					return {
						get val () {
							return context[key];
						},
						set val (value) {
							context[key] = value;
						},
					};
				}
				if (isInvalid(value)) {
					value = {};
					context[key] = value;
				}
			}
			else {
				if (isInvalid(value) && chainIdx < chain.length - 1) {
					return undefined;
				}
			}

			context = value;
			chainIdx++;
		}

		if (chainIdx === chain.length && callArgs && typeof value === "function") {
			return value.apply(context, callArgs);
		}
		return value;
	}
}
