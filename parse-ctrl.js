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

export default class ParseCtrl {
	constructor (text, idx = 0) {
		this.text = text;
		this.idx = idx;
		this.stack = [{type: "root", children: []}];
		Object.defineProperty(this.stack, "empty", {
			get () {
				return this.length === 0;
			},
		});
		this.stack.last = () => {
			return this.stack[this.stack.length - 1];
		};
	}
	add (node) {
		this.node.children.push(node);
	}
	get (length = 1, shift = 0) {
		if (length === 1) {
			return this.text.charAt(this.idx + shift);
		}
		return this.text.substr(this.idx + shift, length);
	}
	get node () {
		return this.stack[this.stack.length - 1];
	}
	move (shift = 1) {
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
	compare (target, targetIdx = 0, srcIdx = this.idx) {
		let i = 0;
		const l1 = target.length;
		const l2 = this.text.length;
		if (l1 < l2 - srcIdx + targetIdx) {
			return false;
		}

		while (i < l2) {
			if (target[targetIdx + i] !== this.text[srcIdx + i]) {
				return false;
			}
			i++;
		}
		return true;
	}
}
