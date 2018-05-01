import sinon from "sinon";

export default function runTest (test) {
	test("Example test", t => {
		t.equals(1, 1);
		t.end();
	});
}
