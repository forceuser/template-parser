export default function (ctrl) {
	while (!ctrl.isEnd()) {
		const {start, node} = ctrl;
		if (node.type === "root") {
			if (ctrl.compare("<")) {
				ctrl.move();
				const tagName = ctrl.while(/[a-z]/i);
				if (tagName) {
					ctrl.start("tag", {tagName});
				}
				else if (ctrl.compare("!--")) {
					ctrl.start("comment");
				}
			}
		}
		else if (node.type === "tag") {
			if (ctrl.compare(">")) {
				ctrl.end();
			}
			else if (ctrl.match(/[a-z]/i)) {
				ctrl.start("attr");
			}
		}
		else if (node.type === "attr") {
			const attrName = ctrl.while(/[a-z-]/i);
			if (ctrl.compare("=") {
				ctrl.start("attr-value")
			}
		}_
		ctrl.next();
	}
}
