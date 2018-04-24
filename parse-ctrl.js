export default class ParseCtrl {
	constructor (text, idx = 0) {
		this.text = text;
		this.idx = idx;
		this.root = {type: "root", children: []};
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
	add (nodeType, params) {
		const node = Object.assign({}, params, {nodeType});
		this.node.children.push(node);
	}
	start (...args) {
		const node = this.add(...args);
		this.stack.push(node);
		return node;
	}
	end () {
		return this.stack.pop();
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
		this.idx += shift;
		this.moved = true;
		return this;
	}
	next () {
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
}





function compare (str1, str2, idx1 = 0, idx2 = 0) {
	let i = 0;
	const l1 = str1.length;
	const l2 = str2.length;
	if (l1 < l2 - idx2 + idx1) {
		return false;
	}

	while (i < l2) {
		if (str1[idx1 + i] !== str2[idx2 + i]) {
			return false;
		}
		i++;
	}
	return true;
}
