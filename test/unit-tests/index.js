import sinon from "sinon";
import Scope from "src/scope.js";

export default function runTest (test) {
	test("Example test", t => {
		const moo = {a: {b: 5}};
		let p;

		const scope = new Scope([{
			foo: {
				bar: {
					baz: () => 11,
				},
			},
		}]);
		const scope2 = scope.new({
			ll: 111,
		});

		t.equals(scope.get(["moo", "a", "b"], () => moo, []), 5);
		t.equals(scope.get(["foo", "bar", "baz"], () => foo, []), 11);
		t.equals(scope.set(["a", "b", "c"], 15, () => a, val => a = val), 15);
		t.equals(scope.get(["a", "b", "c"], () => a), 15);
		t.equals(scope.set(["x"], "x-val", () => x, v => x = v), "x-val");
		t.equals(scope.set(["p", "t"], "test", () => p, v => p = v), "test");
		t.equals(p.t, "test");
		t.equals(scope2.get(["ll"], () => ll), 111);
		t.equals(scope2.get(["foo", "bar", "baz"], () => foo, []), 11);
		t.end();
	});
}
