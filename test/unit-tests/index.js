import sinon from "sinon";
import Scope from "src/scope.js";

export default function runTest (test) {
	test("Example test", t => {
		const moo = {a: {b: 5}};
		let p;

		const scope = new Scope({
			foo: {
				bar: {
					baz: () => 11,
				},
			},
		});

		t.equals(scope.get(["moo", "a", "b"], () => moo, []), 5);
		t.equals(scope.get(["foo", "bar", "baz"], () => foo, []), 11);
		t.equals(scope.set(["a", "b", "c"], () => a, val => a = val, 15), 15);
		t.equals(scope.get(["a", "b", "c"], () => a), 15);
		t.equals(scope.set(["x"], () => x, v => x = v, "x-val"), "x-val");
		t.equals(scope.set(["p", "t"], () => p, v => p = v, "test"), "test");
		t.equals(p.t, "test");
		t.end();
	});
}
