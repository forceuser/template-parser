class View { // Basic class
	constructor (options = {}) {
		this.options = options;
		this.model = options.model;
		this.cache = new Cache();
		this.init();
		const domNode = options.domNode || document.createElement("div");
		this.reactionCtrl = reaction(() => {
			if (typeof options.onChange === "function") {
				options.onChange();
			}
			this.vnode = patch(this.vnode || domNode, this.render({
				model: this.model,
				cache: this.cache,
			}));
		}, false);
		this.reactionCtrl.reaction();
	}
	init () {

	}
	render () {
		// abstract render
	}
	destroy () {
		this.reactionCtrl.unregister();
	}
}

class Cache () {
	constructor () {
		let storage = [];
		let newStorage;
		function cache (key, fn) {
			let result;
			if (key in storage) {
				result = storage[key];
				newStorage[key] = result;
				return storage[key];
			}
			result = fn(new Cache());
			newStorage[key] = result;
			return result;
		}
		cache.begin = () => {
			newStorage = [];
		};
		cache.end = () => {
			storage = newStorage;
		};

		return cache;
	}
}



new View({
	model: {},
	render ({cache}) {
		return ["div", {}, [
			...[1, 2].map(key => 
				cache(key, cache => 
					["span", {key}, [cache(0, )]]
				)
			)
		]]
	}

})