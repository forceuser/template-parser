export default function (ctrl) {
	const parse = {
		openTag () {
			if (ctrl.match("<")) {
				const tagName = ctrl.match(/^[a-z]+/i);
				if (tagName) {
					ctrl.start("tag", {tagName});
					ctrl.go(tagName.length + 1);
					return true;
				}
			}
		},
		openComment () {
			if (ctrl.match("!--")) {
				ctrl.start("comment");
				ctrl.go(3);
				return true;
			}
		},
		closeComment () {
			if (ctrl.match("-->")) {
				ctrl.go(3).end();
				return true;
			}
		},
		closeTag () {
			if (ctrl.match(">")) {
				ctrl.go().end();
				return true;
			}
		},
		openAttr () {
			const match = ctrl.match(/^(?<prefix>@[a-z]+)?:?(?<attr>[a-z-]+)?(?:=(?<quote>["']))?/i);
			if (match) {
				const {"0": full, prefix, attr, quote} = match.groups;
				if (quote) {
					ctrl.start("attr", {attr, prefix});
				}
				else {
					ctrl.add("attr", {attr, prefix});
				}
				ctrl.go(full.length);
				return true;
			}
		},
		attr () {
			const matchExpr = ctrl.match("{{");
			if (matchExpr) {


				ctrl.startCopy();
				ctrl.go(matchExpr[0].length);
				let m;
				while (!m) {
					m = ctrl.match(`}}${ctrl.quote}`);
					!m && ctrl.go();
				}
				if (m) {
					const expr = ctrl.endCopy();
					ctrl.go(m[0].length).end();
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
	};

	while (!ctrl.isEnd()) {
		switch (ctrl.node.type) {
			case "tag": {
				[
					parse.closeTag,
					parse.openAttr,
				].some(p => p());
				break;
			}
			case "attr": {
				parse.attr();
				break;
			}
			default: {
				parse.openTag();
				break;
			}
		}

		ctrl.next();
	}
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
