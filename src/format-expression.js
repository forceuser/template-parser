export default format;

function isVal (node) {
	return ["number", "literal", "string"].includes(node.type);
}

function isLit (node) {
	return ["keyword", "number", "literal", "string"].includes(node.type);
}

function isOP (node) {
	return ["operation", ",", ".", ":", "=>"].includes(node.type);
}

function isOP2 (node) {
	return ["operation", ",", ":"].includes(node.type);
}

function isSign (node) {
	return !["comment", "linebreak", ";"].includes(node.type);
}

function getNextSignificant (i, list) {
	while (i < list.length) {
		if (list[i].type !== "linebreak") {
			return list[i];
		}
	}
}

function formatChain (chain, before, after) {
	return `chain(${chain.map(i => i.data.val || "~").join(",")})`;
}

function format (parent, forceDeclaration = false, root = true) {
	const nodes = parent.children || [];
	const snodes = [];
	let brk = false;
	let prevNode;
	nodes.forEach((node) => {
		if (isSign(node)) {
			snodes.push(node);
			if (prevNode && (brk === ";" || (brk === "linebreak" && isOP(node) !== isOP(prevNode)))) {
				prevNode.brk = true;
			}
			brk = false;
			prevNode = node;
		}
		else if (node.type === ";" || (node.type === "linebreak" && !brk)) {
			brk = node.type;
		}
	});
	let result = "";
	if (parent.type === "brackets") {
		result += parent.data.open;
	}
	prevNode = null;
	let chain;
	let beforeChain;
	let declaration = false;
	let functionDeclaration = false;
	let line;
	snodes.forEach((node, idx) => {
		const nextNode = snodes[idx + 1];
		const lit = node.type === "literal";
		const lineStart = !prevNode || prevNode.brk;
		const opStart = prevNode && ["operation", ":"].includes(prevNode.type);
		const blockStart = prevNode && prevNode.type === ",";



		// forceDeclaration ...rest exception

		if (lineStart) {
			if (line) {
				result += line;
			}
			line = "";
			declaration = forceDeclaration || node.type === "keyword" && ["const", "let", "var"].includes(node.data.val);
		}

		if (lineStart || opStart || blockStart) {
			functionDeclaration = (node.type === "keyword" && node.data.val === "function") || (nextNode && nextNode.type === "=>");
		}


		if (!chain && ((lineStart && !forceDeclaration && !declaration) || opStart || (blockStart && !forceDeclaration))) {
			if (lit || (nextNode && (nextNode.type === "." || (nextNode.type === "brackets" && nextNode.data.open === "[")))) {
				beforeChain = prevNode;
				chain = [];
			}
		}

		if (chain) {
			const op = isOP2(node);
			if (!isOP(node)) {
				chain.push(node);
			}
			if (node.brk || isOP2(node)) {
				const space = beforeChain && isLit(beforeChain) ? " " : "";
				line += space + formatChain(chain, beforeChain, node);
				// if (op) {
				// 	line += node.data.val;
				// }
				chain = null;
			}
		}
		else if (node.type === "brackets") {
			line += format(node, (node.data.open === "(" && functionDeclaration) || (declaration && !opStart), false);
		}
		else if (node.data.val) {
			const space = prevNode && isLit(prevNode) && isLit(node) ? " " : "";
			line += space + node.data.val;
		}
		if (node.brk) {
			line += ";\n";
		}
		prevNode = node;
	});
	if (line) {
		result += root ? "return " + line : line;
	}
	if (parent.type === "brackets") {
		result += parent.data.close;
	}
	return result;
}
