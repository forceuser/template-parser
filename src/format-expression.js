export default format;

function isLit (node) {
	return ["keyword", "number", "literal", "string"].includes(node.type);
}

function format (node, stack = [], prevNode, nextNode) {
	const children = node.children || [];
	let result = "";
	let lastSignificant;
	const lit = isLit(node);
	const significant = ["comment", "linebreak"].includes(node) ? null : node;

	if (node.type === "brackets") {
		result += node.data.open;
	}
	if (node.data && node.data.val && significant) {
		lastSignificant = significant;
		const space = prevNode && isLit(prevNode) && lit ? " " : "";
		result += space + node.data.val;
	}
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const prevChild = children[i - 1];
		const nextChild = children[i + 1];
		stack.push(node);
		result += format(child, stack, prevChild, nextChild);
		stack.pop();
	}
	if (node.type === "brackets") {
		result += node.data.close;
	}
	return result;
}
