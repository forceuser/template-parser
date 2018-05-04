import Scope from "src/scope";

export default function runTest (test) {
	`
    <ul>
    {{#list item in items}}
        <li key="{{item.id}}">{{item.name}} - {{item.type}}</li>
    {{/list}}
	</ul>`;
	const flatten = () => {};

	tpl.fn("list", (args, pscope, callback) => {
		const [full, itemVar, itemsVar] = args.match(/(.+?)\sin\s(.+)/);
		const items = pscope.get(itemsVar) || [];
		return tpl.flattenMap(items, item => {
			const scope = pscope.new();
			scope.setLocal(itemVar, item);
			return tpl.call(callback, scope);
		});
	});

	tpl.fn("if", (args, pscope, callback) => {
		const result = tpl.eval(args)(pscope);
		return result ? tpl.call(callback, pscope) : [];
	});

	test("Tempate example", t => {
		const tpl = {};
		function createTemplate (model) {
			const scope = new Scope([model]);
			const {get: $g, set: $s} = scope;
			const $f = tpl.flatten;
			const $fn = tpl.fn;
			return () => {
				return [
					"ul",
					{},
					[
						...$fn("list").call("item in items", scope, (scope, $g, $s) => [
							[
								"li",
								{key: $g(["item", "id"], () => item)},
								[
									null,
									null,
									[
										$g(["item", "name"], () => item),
										" - ",
										$g(["item", "type"], () => item),
									],
								],
							],
						]),
					],
				];
			};
		}
	});
}
