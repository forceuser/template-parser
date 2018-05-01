export default {
	type: "root",
	children: [
		{type: "lit", text: "const", data: {type: "res"}},
		{type: "lit", text: "asyncFunc", data: {}},
		{type: "op", text: "=", data: {type: "="}},
		{type: "lit", text: "async", data: {type: "res"}},
		{type: "group", text: "", data: {type: "("}, children: [
			{type: "lit", text: "arg1", data: {}},
			{type: "sep", text: ",", data: {type: ","}},
			{type: "lit", text: "arg2", data: {}},
			{type: "op", text: "=", data: {type: "="}},
			{type: "str", text: "\"def\"", data: {type: "\""}},
		]},
	],
};


const a = {type: "raw", text: `set(["arg1", "a", "b", "c"], () => arg1, $v$ => arg1 = $v$, 12)`};
const b = {type: "sep", text: ";", data: {type: ";"}};
