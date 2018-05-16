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

function getNextSignificant (i, list) {
	while (i < list.length) {
		if (list[i].type !== "linebreak") {
			return list[i];
		}
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

		if (
			child.type === "literal" ||
			(child.type === "operation" && child.data.val === ".")
		) {
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
			const noSemicolon = brk === "linebreak" && (isOP(lastSignificant) || isOP(significant));
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
