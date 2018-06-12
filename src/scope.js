const isInvalid = (value) => value == null || (typeof value !== "object" && typeof value !== "function");

const spitPath = (path) => path.split(".");

export default class Scope {
	constructor (stack) {
		this.stack = [...stack];
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
		this.call = this.call.bind(this);
		this.new = this.new.bind(this);
	}
	new (scope) {
		return new Scope([...this.stack, scope || {}]);
	}
	ng (callArgs, chain, getter, setter) {
		let chainIdx = 0;
		let value;
		const isSet = !!setter;


		try {
			value = getter();
			if (!callArgs && typeof setter === "function" && chain.length > 1 && isInvalid(value)) {
				value = {};
				setter(value);
			}
			chainIdx = 1;
		}
		catch (error) {/**/}

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
			if (chainIdx === chain.length - 1) {
				return context[key] = val;
			}
			if (isInvalid(value)) {
				value = {};
				context[key] = value;
			}
			context = value;
			chainIdx++;
		}
	}
	call (fn, context, callArgs) {
		if (fn && typeof fn === "function") {
			fn();
		}
		return this.get(chain, null, callArgs);
	}
	get (chain, getter, callArgs) {
		if (typeof chain === "string") {
			chain = spitPath(chain);
		}

		let chainIdx = 0;
		let value;
		if (typeof getter === "function") {
			try {
				value = getter();
				chainIdx = 1;
			}
			catch (error) {/* read variable from local scope if it is declared */}
		}

		if (chainIdx === 0) {
			let i = this.stack.length - 1;
			const key = chain[0];
			while (i >= 0) {
				if (key in this.stack[i]) {
					value = this.stack[i][key];
					chainIdx = 1;
					break;
				}
				i--;
			}
		}
		let context;
		while (chainIdx < chain.length) {
			if (isInvalid(value)) {
				return undefined;
			}
			const key = chain[chainIdx];
			context = value;
			value = value[key];
			chainIdx++;
		}

		if (chainIdx === chain.length && callArgs && typeof value === "function") {
			return value.apply(context, callArgs);
		}
		return value;
	}
	set (chain, val, getter, setter) {
		if (typeof chain === "string") {
			chain = spitPath(chain);
		}
		let chainIdx = 0;
		let value;
		if (typeof getter === "function" && typeof setter === "function") {
			try {
				value = getter();
				if (chain.length > 1) {
					if (isInvalid(value)) {
						value = {};
						setter(value);
					}
				}
				else {
					return setter(val);
				}
				chainIdx = 1;
			}
			catch (error) {/* read variable from local scope if it is declared */}
		}

		let context = value;
		if (chainIdx === 0) {
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
			if (chainIdx === chain.length - 1) {
				return context[key] = val;
			}
			if (isInvalid(value)) {
				value = {};
				context[key] = value;
			}
			context = value;
			chainIdx++;
		}
	}
}
