import ParseCtrl from "./parse-ctrl.js";

const startExp = "{{";
const endExp = "}}";

export default function parse (text) {
	const ctrl = new ParseCtrl(text);
	const parse = {
		startTag () {
			if (ctrl.match("<")) {
				const match = ctrl.match(/^<([a-z](-?[a-z])*)/i);
				if (match) {
					const tagName = match[1];
					ctrl.start("tag", {data: {tagName, open: true}});
					ctrl.go(tagName.length + 1);
					return true;
				}
				else {
					const matchClose = ctrl.match(/^<\/([a-z](-?[a-z])*)>/i);
					if (matchClose) {
						const tagName = matchClose[1];
						ctrl.go(matchClose[0].length).add("tag", {data: {tagName, close: true}});
						return true;
					}
				}
			}
		},
		startComment () {
			if (ctrl.match("<!--")) {
				ctrl.start("comment");
				ctrl.go(4);
				return true;
			}
		},
		endComment () {
			if (ctrl.match("-->")) {
				ctrl.go(3).end();
				return true;
			}
		},
		endTag () {
			if (ctrl.match("/>")) {
				ctrl.go(2).end({data: {selfClosing: true}});
				return true;
			}
			else if (ctrl.match(">")) {
				ctrl.go().end();
				return true;
			}
		},
		startAttr () {
			const match = ctrl.match(/^(@[a-z]+)?:?([a-z-]+)?(?:=(["']))?/i);
			if (match && match[0]) {
				const [full, prefix, attr, quote] = match;
				if (quote) {
					ctrl.start("attr", {data: {attr, prefix, quote}});
					ctrl.go(full.length);
				}
				else {
					ctrl.go(full.length).add("attr", {data: {attr, prefix}});
				}
				return true;
			}
		},
		attr () {
			const matchExpr = ctrl.match(startExp);
			if (matchExpr) {
				ctrl.go(startExp.length);
				ctrl.startCopy();
				let m;
				const matcher = `${endExp}${ctrl.node.data.quote}`;
				while (!m && !ctrl.isEnd()) {
					m = ctrl.match(matcher);
					!m && ctrl.go();
				}
				if (m) {
					const expression = ctrl.endCopy();
					ctrl.go(matcher.length).end({data: {expression}});
				}
			}
			else {
				// parse string
				const stringRegex = /^(("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*'))/;
				const match = ctrl.go(-1).match(stringRegex);
				if (match) {
					ctrl.node.value = match[0];
					ctrl.go(match[0].length).end();
				}
			}
		},
		text () {
			const lastNode = ctrl.root.children[ctrl.root.children.length - 1];
			if (lastNode && lastNode.type === "text") {
				lastNode.end = ctrl.idx;
				lastNode.data.content += ctrl.get(1);
			}
			else {
				ctrl.go(1).add("text", {data: {content: ctrl.get(1)}});
			}
		},
		expression () {
			const match = ctrl.match(new RegExp(`^${startExp}(#|/)?(.*?)${endExp}`));
			if (match) {
				const {"0": full, "1": control, "2": expression} = match;
				let fn;
				let args;
				if (control === "#") {
					const match = expression.match(/^([a-z]+(?:-[a-z]*)*)\s?(.*)/i);
					fn = match[1];
					args = match[2];
				}
				ctrl.go(full.length).add("expression", {data: {expression, control, fn, args}});
			}
		},
	};

	while (!ctrl.isEnd()) {
		switch (ctrl.node.type) {
			case "tag": {
				if (ctrl.node.data.open) {
					[
						parse.endTag,
						parse.startAttr,
					].some(p => p());
				}
				else {
					parse.endTag();
				}
				break;
			}
			case "attr": {
				parse.attr();
				break;
			}
			case "comment": {
				parse.endComment();
				break;
			}
			default: {
				[
					parse.startTag,
					parse.startComment,
					parse.expression,
					parse.text,
				].some(p => p());
				break;
			}
		}

		ctrl.next();
	}
	return ctrl;
}


// разбить на выражения игнорируя строки
// определить правую и левую сторону выражения (const, let, var)
// const a = b = c + 2;
// находим начало литерала [a-z]
// идем игнорируя строки пока [a-z]
// x.y = a.b[c["x"]].d(attrs)


// create empty expression, clear $ concat "x"
// >. push "x"
// clear $ concat "y"
// >= push "y", mark expression as "set"
// create empty expression, clear $ concat "a"
// >. push "a"
// clear $ concat b
// >[ push "b",
// >"c" create new expression



// (get, set, call) => set(["x", "y"], call(get(["a", "b", get(["c", "x"]), "d"])), get(["attrs"]))
// parse expression
