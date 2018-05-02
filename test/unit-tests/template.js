import Scope from "src/scope";

export default function runTest (test) {
	`
    <ul>
    {{#list item in items}}
        <li key="{{item.id}}">{{item.name}} - {{item.type}}</li>
    {{/list}}
    </ul>`;


	test("Tempate example", t => {
		const tpl = {};
		function createTemplate (model) {
			const scope = new Scope(model);
			return () => {
				return ["ul", {}, [
					tpl.list("item in items", scope, scope => [
						["li", {key: scope.get(["item", "id"], () => item)}, [null, null, [
                            scope.get(["item", "name"], () => item),
                            " - ",
                            scope.get(["item", "type"], () => item),
                        ]],
					]),
				]];
			};
		}
	});
}
