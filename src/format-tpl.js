
import parseExpression from "./parse-expression";
import formatExpression from "./format-expression";

export default format;


const fns = {
	list (args, content) {
		args = args.split(" ");
		return `...((call) => ${formatExpression(parseExpression(args[0]).root)})((${args[2]}) => ${content})`;
	},
};


const formatNode = (node, content) => {
	if (node.type === "tag") {
		if (content && content.length) {
			return `h("${node.data.tagName}", {}, [${content.join(", ")}])`;
		}
		else {
			return `h("${node.data.tagName}", {})`;
		}
	}
	else if (node.type === "expression") {
		if (node.data.control === "#") {
			return `${fns[node.data.fn](node.data.args, content)}`;
		}
		else {
			return `h(null, null, ${formatExpression(parseExpression(node.data.expression).root)})`;
		}
	}
	return `h(null, null, "${(node.data.content || "").replace(/\s+/igm, " ")}")`;
};


function makeHierarchy (list) {
	let cnt = 0;
	const cntCtrl = 0;
	let openNode;
	let openNodeIdx;
	const nodes = [];
	let idx = 0;
	const result = [];
	while (idx < list.length) {
		const node = list[idx];
		const {data, type} = node;
		if (node.type === "tag" || (node.type === "expression" && data.control)) {
			if (openNode) {
				if (openNode.type === "tag") {
					if (type === "tag" && data.open && data.tagName === openNode.data.tagName) {
						cnt++;
					}
					if (type === "tag" && data.close && data.tagName === openNode.data.tagName) {
						cnt--;
					}
				}
				else if (type === "expression") {
					if (data.control === "#") {
						cnt++;
					}
					else if (data.control === "/") {
						cnt--;
					}
				}
				if (cnt === 0) {
					result.push(formatNode(openNode, makeHierarchy(list.splice(openNodeIdx + 1, idx - openNodeIdx - 2))));
					openNode = null;
					idx = openNodeIdx;
				}
			}
			else {
				if (type === "tag") {
					if (data.open) {
						openNode = node;
						openNodeIdx = idx;
						cnt++;
					}
					else if (data.selfClosing) {
						result.push(formatNode(node));
					}
				}
				else if (type === "expression" && data.control === "#") {
					openNode = node;
					openNodeIdx = idx;
					cnt++;
				}
			}
		}
		else if (cnt === 0) {
			result.push(formatNode(node));
		}
		idx++;
	}
	return result;
}

function format (list, type = "root") {
	return makeHierarchy(list);
}
