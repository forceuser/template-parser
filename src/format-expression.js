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

function isOPNoAccessor (node) {
	return ["operation", ",", ":"].includes(node.type);
}

function isSign (node) {
	return !["comment", "linebreak", ";"].includes(node.type);
}

function formatChain (chain, before, after) {
	return `chain(${chain.map(i => i.data.val || format(i, "code", true)).join(",")})`;
}

function format (parent, type = "root", skipBrackets = false) {
	const nodes = parent.children || [];
	const snodes = [];
	let brk = false;
	let prevNode;
	nodes.forEach((node, idx) => {
		if (isSign(node)) {
			snodes.push(node);
			const block = prevNode && prevNode.type !== "brackets" && prevNode.data.open === "{";
			if (prevNode && (brk === ";" || (brk === "linebreak" && (!isOP(node) && !isOP(prevNode) && !block)))) {
				prevNode.brk = true;
			}
			brk = false;
			prevNode = node;
		}
		else if (node.type === ";" || (node.type === "linebreak" && !brk)) {
			brk = node.type;
		}
		// if (idx >= node.length - 1) {
		// 	node.brk = true;
		// }
	});
	let result = "";
	if (parent.type === "brackets" && !skipBrackets) {
		result += parent.data.open;
	}
	prevNode = null;
	let chain;
	let beforeChain;
	let declaration = false;
	let leftSide = false;
	let line;
	let leftSideLit = false;

	snodes.forEach((node, idx) => {
		const nextNode = snodes[idx + 1];
		if (node.type === "keyword" && node.data.val === "function") {
			node.fn = true;
			node.fnKeyword = true;
			let argsNode = snodes[idx + 1];
			if (argsNode && argsNode.type === "literal") {
				argsNode.fn = true;
				argsNode.fnName = true;
				argsNode = snodes[idx + 2];
			}
			if (argsNode && argsNode.type === "brackets") {
				argsNode.fn = true;
				argsNode.fnArgs = true;
			}
		}
		else if (nextNode && nextNode.type === "=>") {
			node.fn = true;
			node.fnArgs = true;
		}

		const isLast = idx >= snodes.length - 1;
		const literal = node.type === "literal";
		const lineStart = !prevNode || prevNode.brk;
		const codeNode = ["root", "code"].includes(type);
		const blockStart = ((prevNode && prevNode.type === ",") || lineStart) && codeNode;
		const argStart = ((prevNode && prevNode.type === ",") || lineStart) && type === "brackets";
		const opStart = prevNode && ["operation", ":"].includes(prevNode.type) && !blockStart;
		const chainable = ["literal", "number", "string"].includes(node.type) || (!declaration && leftSide);

		// forceDeclaration ...rest exception
		if (blockStart || argStart) {
			leftSideLit = false;
		}

		if (lineStart) {
			if (line) {
				result += line;
			}
			line = "";
			declaration = node.type === "keyword" && ["const", "let", "var"].includes(node.data.val);
			leftSide = true;
		}


		if (opStart && leftSideLit) {
			leftSide = false;
		}

		if ((declaration && blockStart) || argStart) {
			leftSide = true;
		}

		if (leftSide && chainable) {
			leftSideLit = true;
		}


		if (!chain && type !== "destructuring" && chainable && !leftSide && (opStart || blockStart)) {
			beforeChain = prevNode;
			chain = [];
		}

		let skipOutput = false;
		if (chain) {
			const op = isOPNoAccessor(node);
			skipOutput = true;
			if (!isOP(node)) {
				chain.push(node);
			}


			if (node.brk || op || isLast) {
				skipOutput = node.brk || isLast;
				const space = beforeChain && isLit(beforeChain) ? " " : "";
				line += space + formatChain(chain, beforeChain, node);
				chain = null;
			}
		}
		else if (node.type === "brackets") {
			const destructuring = leftSide && (declaration || (lineStart && parent.type === "brackets" && parent.data.open === "(")) && ["{", "["].includes(node.data.open);
			const t = destructuring ? "destructuring" : (!node.fnArgs ? "code" : "brackets");
			line += format(node, t);
		}

		if (node.data.val && !skipOutput) {
			const needSpace = prevNode && isLit(prevNode) && isLit(node);
			line += (needSpace ? " " : "") + node.data.val;
		}

		if (node.brk) {
			line += ";\n";
		}
		prevNode = node;
	});
	if (line) {
		result += type === "root" ? "return " + line : line;
	}
	if (parent.type === "brackets" && !skipBrackets) {
		result += parent.data.close;
	}
	return result;
}
