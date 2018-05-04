
const fn = (name, call) => {
	if (call) {
		fn[name] = call;
	}
	return {call: (...args) => {
		if (fn[name]) {
			return fn[name].apply(null, args);
		}
		throw new Error(`template function "${name}" is not defined!`);
	}};
};

export default {
	fn,
	flatten (items) {
		return items.reduce((acc, val) => acc.concat(val), []);
	},
	flattenMap (items, callback) {
		return items.reduce((acc, val) => acc.concat(callback(val)), []);
	},
	call (callback, scope) {
		return callback(scope, scope.get, scope.set);
	},
};
