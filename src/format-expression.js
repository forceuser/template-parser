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

function formatChain (chain, before, after, isSet = false) {
	let result = "";
	let idx = 0;
	let isLoc = chain[0] && chain[0].type !== "literal";
	const assigmentExp = ["++", "--", "=", "+=", "-=", "*=", "/=", "%=", "**=", "<<=", ">>=", ">>>=", "&=", "^=", "|="];
	isSet = isSet || (before && before.type === "operation" && ["++", "--"].includes(before.data.val)) ||
		(after && after.type === "operation" && assigmentExp.includes(after.data.val));
	let chainList = [];
	const formatList = list => `${isLoc ? "_$cl" : "_$ch"}([${list.map(formatNode).join(",")}]${isLoc ? `${isSet ? ", true" : ", false"}` : `, () => ${list[0].data.val} ${isSet ? `, _$v => ${list[0].data.val}=_$v` : ""}`})`;
	const formatNode = i => i.data.val ? (i.type === "literal" ? `"${i.data.val}"` : i.data.val) : format(i, "code", true);
	while (idx < chain.length) {
		const i = chain[idx];
		const call = i.type === "brackets" && i.data.open === "(";
		if (call) {
			result = formatList(chainList);
			result = `_$fn(${result}, [${format(i, "code", true, isSet)}])`;
			isLoc = true;
			chainList = [{data: {val: result}}];
		}
		else {
			chainList.push(i);
			isLoc = isLoc || (chainList.length === 1 && i.type !== "literal");
			if (idx === chain.length - 1) {
				if (isLoc && chainList.length === 1) {
					result = formatNode(chainList[0]);
				}
				else {
					result = formatList(chainList);
				}
			}
		}
		idx++;
	}

	return result;
}

function format (parent, type = "root", skipBrackets = false, isSet = false) {
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
			// leftSide = true;
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
			line += format(node, t, null, isSet);
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
		result += type === "root" && !declaration ? "return " + line : line;
	}
	if (parent.type === "brackets" && !skipBrackets) {
		result += parent.data.close;
	}
	return result;
}
