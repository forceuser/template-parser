import ParseCtrl from "./parse-ctrl";

export default function ExpressionParser (text) {
	const ctrl = new ParseCtrl(text);
	const ast = {children: []};
	while (!ctrl.isEnd()) {
		if (ctrl.in(["\"", "'"]) {

		}

		this.next();
	}
}
