const a = async (arg1 = 5, arg2, ...rest) => {
	const [x, y, z = 3] = rest;
	const {a, b, c: val = "def"} = arg2;
	switch (a) {
		case "aaa":
			console.log("sdads");
			break;
		case "bbb":
			console.log("sdads");
			break;
		default:
			console.log("sdads\" sdasda asd");
	}
	(1).toString();
	"sdas".toString();
	[].toString();
	const uuu = {}.toString(a, b, c);
	for (let i = 0; i < b; i++) {}
	class XX extends Object {
		constructor () {
			super();
			const x = a ? b.d : c;
		}
		bb () {}
		static cc () {}
		get value () {}
		abc () {}
	}
};
