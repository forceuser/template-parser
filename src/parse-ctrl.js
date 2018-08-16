function getLineNumber (str, idx) {
	const lines = str.split("\n").map(s => s.length);
	let lc = 0;
	let i = 0;
	while (lc < idx && i < lines.length) {
		lc += lines[i];
		i++;
	}
	return i - 1;
}

function merge (current, update) {
	Object.keys(update).forEach((key) => {
		// if update[key] exist, and it's not a string or array,
		// we go in one level deeper
		if (
			current.hasOwnProperty(key) &&
			typeof current[key] === "object" &&
			!(current[key] instanceof Array)
		) {
			merge(current[key], update[key]);

			// if update[key] doesn't exist in current, or it's a string
			// or array, then assign/overwrite current[key] to update[key]
		}
		else {
			current[key] = update[key];
		}
	});
	return current;
}

export default class ParseCtrl {
	constructor (text, idx = 0) {
		this.text = text;
		this.idx = idx;
		this.root = {type: "root", children: [], start: idx, end: text.length};
		this.stack = [this.root];
		this.copyStack = [];
		Object.defineProperty(this.stack, "empty", {
			get () {
				return this.length === 0;
			},
		});
		this.stack.last = () => {
			return this.stack[this.stack.length - 1];
		};
	}
	regexp (s, flags = "") {
		return new RegExp(s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), flags);
	}
	add (type, params) {
		const ctrl = this;
		const node = Object.assign(
			{children: [], start: this.lastIdx, end: this.idx, data: {}},
			params,
			{type}
		);
		Object.defineProperty(node, "text", {
			get () {
				return ctrl.text.substring(
					node.start,
					node.end || ctrl.text.length
				);
			},
		});
		this.node.children.push(node);
		return node;
	}
	start (...args) {
		const node = this.add(...args);
		this.stack.push(node);
		node.start = this.idx;
		node.lineStart = getLineNumber(this.text, node.start);
		node.end = null;
		return node;
	}
	end (params) {
		let node = this.stack.pop();
		if (params) {
			node = merge(node, params);
		}
		node.end = this.idx;
		node.lineEnd = getLineNumber(this.text, node.end);
		return node;
	}
	get (length, shift = 0) {
		if (length === 1) {
			return this.text.charAt(this.idx + shift);
		}
		return this.text.substr(this.idx + shift, length);
	}
	startCopy () {
		this.copyStack.push(this.idx);
	}
	endCopy () {
		const idx = this.copyStack.pop();
		return this.text.substring(idx, this.idx);
	}
	get node () {
		return this.stack[this.stack.length - 1];
	}
	go (shift = 1) {
		this.lastIdx = this.idx;
		this.idx += shift;
		this.moved = true;
		return this;
	}
	next () {
		this.lastIdx = this.idx;
		if (!this.moved) {
			this.idx++;
		}
		else {
			this.moved = false;
		}
		return this;
	}
	isEnd () {
		return this.idx >= this.text.length;
	}
	match (val) {
		const str = this.get();
		if (val instanceof RegExp) {
			return str.match(val);
		}
		return str.startsWith(val);
	}
	get before () {
		return this.text.substr(0, this.idx);
	}
	precedes (val) {
		const str = this.before;
		if (val instanceof RegExp) {
			return str.match(val);
		}
		return str.endsWith(val);
	}
}
