const isInvalid = (value) => value == null || (typeof value !== "object" && typeof value !== "function");

export default function (model) {
	const scopeStack = [model];
	const get = (chain, getter, callArgs) => {
		let chainIdx = 0;
		let value;
		try {
			value = getter();
			chainIdx = 1;
		}
		catch (error) {/* read variable from local scope if it is declared */}

		if (chainIdx === 0) {
			let i = scopeStack.length - 1;
			const key = chain[0];
			while (i >= 0) {
				if (key in scopeStack[i]) {
					value = scopeStack[i][key];
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
	};

	const set = (chain, getter, setter, val) => {
		let chainIdx = 0;
		let value;
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
		let context = value;
		if (chainIdx === 0) {
			let i = scopeStack.length - 1;
			const key = chain[0];
			while (i >= 0) {
				if (key in scopeStack[i] || i === 0) {
					context = scopeStack[i];
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
		return "AHHAHHAHHA";
	};

	return {scopeStack, get, set};
}
