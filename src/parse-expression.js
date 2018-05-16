import ParseCtrl from "./parse-ctrl.js";

const keywords = [
	"async",
	"await",
	"break",
	"case",
	"class",
	"catch",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"export",
	"extends",
	"finally",
	"for",
	"function",
	"goto",
	"if",
	"import",
	"in",
	"instanceof",
	"let",
	"new",
	"return",
	"super",
	"switch",
	"this",
	"throw",
	"try",
	"typeof",
	"var",
	"void",
	"while",
	"with",
	"yield",
	"implements",
	"package",
	"protected",
	"static",
	"interface",
	"private",
	"public",
	"null",
	"true",
	"false",
	"undefined",
];

const keywordsRegex = new RegExp(`^(${keywords.join("|")})\\b`);

export default function parse (text) {
	const ctrl = new ParseCtrl(text);
	const parse = {
		string () {
			if (ctrl.node.type === "string") {
				const node = ctrl.node;
				if (ctrl.match(ctrl.node.data.quote)) {
					const matchEscapes = ctrl.precedes(/(\\+)$/);
					if (
						!matchEscapes ||
						(matchEscapes && matchEscapes[1].length % 2 === 0)
					) {
						ctrl.go().end();
						node.data.val = node.text;
						return true;
					}
				}
			}
			else {
				const matchQuote = ctrl.match(/^(["'`])/);
				if (matchQuote) {
					ctrl.start("string", {data: {quote: matchQuote[1]}});
					return true;
				}
			}
		},
		comment () {
			const match = ctrl.match(/^(\/\/.*?)(?:$|\Z)/m) || ctrl.match(/^(\/\*[\s\S]*?\*\/)/);
			if (match) {
				console.log("comment", match[1]);
				ctrl.go(match[1].length).add("comment");
				return true;
			}
		},
		keyword () {
			const match = ctrl.match(keywordsRegex);
			if (match) {
				ctrl
					.go(match[1].length)
					.add("keyword", {data: {val: match[1]}});
			}
		},
		brackets () {
			if (ctrl.node.type === "brackets" && ctrl.match(ctrl.node.data.close)) {
				ctrl.go().end();
				return true;
			}
			const match = ctrl.match(/^([\(\[\{])/);
			if (match) {
				ctrl.start("brackets", {data: {open: match[1], close: {"{": "}", "(": ")", "[": "]"}[match[1]]}});
				return true;
			}
		},
		dot () {
			const match = ctrl.match(/^(\.+)/);
			if (match && match[1].length === 1) {
				ctrl.go().add(".", {data: {val: "."}});
				return true;
			}
		},
		comma () {
			if (ctrl.match(",")) {
				ctrl.go().add(",", {data: {val: ","}});
				return true;
			}
		},
		colon () {
			if (ctrl.match(":")) {
				ctrl.go().add(":", {data: {val: ":"}});
				return true;
			}
		},
		semicolon () {
			if (ctrl.match(";")) {
				ctrl.go().add(";");
				return true;
			}
		},
		number () {
			const match = ctrl.match(/^(\d+?\.?\d*)/);
			if (match) {
				ctrl.go(match[1].length).add("number", {data: {val: match[1]}});
				return true;
			}
		},
		literal () {
			// a  // когда в левой части выражения и без цепочек
			const match = ctrl.match(/^([a-z][a-z0-9]*)/i);
			if (match) {
				ctrl
					.go(match[1].length)
					.add("literal", {data: {val: match[1]}});
				return true;
			}
		},
		operation () {
			const match = ctrl.match(/^([^\s,;\])}a-z]+)/i);
			if (match) {
				ctrl
					.go(match[1].length)
					.add("operation", {data: {val: match[1]}});
				return true;
			}
		},
		linebreak () {
			if (ctrl.match(/^\n/)) {
				ctrl.go().add("linebreak");
				return true;
			}
		},
	};

	while (!ctrl.isEnd()) {
		switch (ctrl.node.type) {
			case "string": {
				parse.string();
				break;
			}
			case "comment": {
				break;
			}
			default: {
				[
					parse.comment,
					parse.string,
					parse.linebreak,
					parse.semicolon,
					parse.number,
					parse.keyword,
					parse.brackets,
					parse.colon,
					parse.comma,
					parse.dot,
					parse.literal,
					parse.operation,
				].some(p => p());
				break;
			}
		}
		ctrl.next();
	}
	return ctrl;
}
