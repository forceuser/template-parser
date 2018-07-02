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


new View({
	model: {},
	render ({cache}) {
		return cache(cache => ["div", {}, [
			...[1, 2].map(key =>
				cache(key, cache =>
					["span", {}, [cache(0, )]]
				)
			),
		]]);

		// или
	},

});

class Store {
	constructor () {
		this.data = {};
	}
	set (key, data) {
		this.data[key] = data;
	}
	has (key) {
		this.activeKeys.add(key);
		return this.data.hasOwnPropery(key);
	}
	get (key) {
		return this.data[key];
	}
	begin () {
		this.activeKeys = new Set();
	}
	end () {
		Object.keys(this.data).forEach(key => {
			if (!this.activeKeys.has(key)) {
				this.data[key].unregister();
				delete this.data[key];
			}
		});
	}
}


class Layer {
	constructor (buffer = false) {
		this.store = new Store(buffer);
		return (call, key) => {
			if (this.store.has(key)) {
				const res = this.store.get(key);
				return res.reaction();
			}
			const layer = new Layer(true);
			const domNode = document.createElement("div");
			const res = reaction(() => {
				layer.store.begin();
				this.vnode = patch(this.vnode || domNode, call(layer));
				layer.store.end();
				return this.vnode;
			}, false);
			this.store.set(key, res);
			return res.reaction();
		};
	}
}
