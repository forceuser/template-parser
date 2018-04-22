import ParseCtrl from "/parse-ctrl.js";

export default function (ctrl) {
	ctrl = new ParseCtrl(ctrl.text, ctrl.idx);

	if (ctrl.compare("<")) {
		ctrl.move();
		const tagName = ctrl.while(/[a-z]/i);
		if (tagName) {

		}
		else if (ctrl.compare("!--")) {

		}
	}
}
