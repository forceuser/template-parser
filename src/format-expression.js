export default format;

function isVal (node) {
	return ["number", "literal", "string"].includes(node.type);
}

function isLit (node) {
	return ["keyword", "number", "literal", "string"].includes(node.type);
}

function isOP (node) {
	return ["operation", ",", ".", ":"].includes(node.type);
}

function isSign (node) {
	return ["comment", "linebreak", ";"].includes(node.type);
}

function getNextSignificant (i, list) {
	while (i < list.length) {
		if (list[i].type !== "linebreak") {
			return list[i];
		}
	}
}

class Navigator {
	constructor (root) {
		this.stack = [root];
		this.nodes = this.stack[0].children;
		this.node = this.nodes[0];
		this.history = [0];
	}
	down () {

	}
	get idx () {
		return this.history[this.history.length - 1];
	}
	get length () {
		return this.history.length;
	}
	go (idx) {
		this.history.push(idx);
		return this;
	}
	next () {
		return this.go(this.idx + 1);
	}
	prev () {
		return this.go(this.idx - 1);
	}
	nextVal () {
		const idx = this.findNext(node => isVal(node));
		if (idx != null) {
			this.go(idx);
			return this.nodeList[idx];
		}
	}
	nextLit () {
		const idx = this.findNext(node => isLit(node));
		if (idx != null) {
			this.go(idx);
			return this.nodeList[idx];
		}
	}
	nextSign () {
		const idx = this.findNext(node => isSign(node));
		if (idx != null) {
			this.go(idx);
			return this.nodeList[idx];
		}
	}
	findNext (condition) {
		const i = this.idx;
		const length = this.length;
		while (i < length) {
			const item = this.nodeList[i];
			if (condition(item, i)) {
				return i;
			}
			i++;
		}
	}
	nextOP () {
		const idx = this.findNext(node => isOP(node));
		if (idx != null) {
			this.go(idx);
			return this.nodeList[idx];
		}
	}
	back () {
		this.node = this.nodeList[this.history.pop()];
	}
}

function format (node, stack = []) {
	const children = node.children || [];
	let result = "";
	let lastSignificant;
	let brk = false;

	{
		if (node.type === "brackets") {
			result += node.data.open;
		}
	}
	const getset = [];
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const prevChild = children[i - 1];
		const nextChild = children[i + 1];
		const significant = ["comment", "linebreak", ";"].includes(child.type)
			? null
			: child;

		if (child.type === ";" || (child.type === "linebreak" && !brk)) {
			brk = child.type;
		}

		if (child.type === "literal" || child.type === ".") {
			getset.push();
		}

		// нужна переменная для определения начала строк
		// нужно определять если () идут после литерала или блока (исключить обьявление функции)
		// нужно определить если [] идут после литерала или блока
		// getLoc(["x"], ({x: 1}))
		// setLoc(["x"], ({x: 1}), 2)
		// setLoc()
		// (a.b.c)["d"](7) = 3
		// (x, s.a.w).p = 2;
		// (a).b.c = 12;
		// setLoc(["b", "c"], get(["a"]))

		let brkn;
		if (significant && lastSignificant) {
			const noSemicolon =
				brk === "linebreak" &&
				(isOP(lastSignificant) || isOP(significant));
			if (brk && !noSemicolon) {
				result += ";";
				brkn = true;
			}
		}
		const ignore = false;

		const nx = getNextSignificant(i, children);

		// if (isVal(child)) {
		// 	if (nx && (nx.type === "." || (nx.type === "brackets" && nx.data.open === "["))) {

		// 	}
		// 	else {

		// 	}
		// }

		if (child.type === "brackets") {
			stack.push(node);
			result += format(child, stack);
			stack.pop();
		}
		else if (!ignore) {
			if (child.data && child.data.val && significant) {
				const space =
					prevChild && isLit(prevChild) && isLit(child) ? " " : "";
				result += space + child.data.val;
			}
		}

		if (significant) {
			lastSignificant = significant;
			brk = false;
		}
	}
	if (node.type === "brackets") {
		result += node.data.close;
	}
	return result;
}
