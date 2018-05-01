function evaluate (model) {
	const scopeStack = [model];
	const get = (chain, getter, callArgs) => {
		let chainIdx = 0;
		let value;
		try {
			value = getter();
			chainIdx = 1;
		}
		finally {/* read variable from local scope if it is declared */}

		if (chainIdx === 0) {
			let i = scopeStack.length - 1;
			const key = chain[0];
			while (i > 0) {
				if (key in scopeStack[i]) {
					value = scopeStack[i];
					chainIdx = 1;
					break;
				}
				i--;
			}
		}
		let context;
		while (chainIdx < chain.length) {
			if (value == null || (typeof value !== "object" && typeof value !== "function")) {
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
			chainIdx = 1;
			if (typeof value !== "object" && typeof value !== "function" && chain.lenght > 1) {
				value = {};
				setter(value);
			}
		}
		finally {/* read variable from local scope if it is declared */}

		if (chainIdx === 0) {
			let i = scopeStack.length - 1;
			const key = chain[0];
			while (i > 0) {
				if (key in scopeStack[i]) {
					value = scopeStack[i];
					chainIdx = 1;
					break;
				}
				i--;
			}
		}

		while (chainIdx < chain.length) {
			if (value == null || (typeof value !== "object" && typeof value !== "function")) {
				return undefined;
			}
			const key = chain[chainIdx];
			if (chainIdx === chain.length - 1) {
				return value[key] = val;
			}

			value = value[key];
			chainIdx++;
		}
		return value;
	};
}
