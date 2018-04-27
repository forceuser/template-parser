Разобрать все случаи где может встречатся выражение

async (arg1 = <expression>, arg2) => {
	const variable = <expression>;
	const variable2 = {
		name: <expression>,
		name2: <expression>,
	};
	const variable3 = [<expression>, <expression>];
	functionCall(<expression>, <expression>);
	variable2[<expression>];
	(<expression>, <expression>);
	variable = (<expression>, <expression>);
	variable = <epression> + <expression>;
	<expression> + <expression>;
	return (<expression>, <expression>);
	<expression><op>
	<expression>
	<expression>
	<op><expression>

}


разбиваем простые блоки

<lit:reserved><lit><op><lit:reserved>[:]

arg1.a.b.c = 12;

set(["arg1", "a", "b", "c"], () => arg1, $v$ => arg1 = $v$, 12);
// пытаемся считать arg1 в try catch чтобы определить лежит ли arg1 в локальном скоупе // ReferenceError
// если возвращается ошибка то пытаемся записать в стек либо модель попутно создавая отсутсвующие в цепочке обьекты
// если не ошибка то идем по цепочке начианая от get/set и 1й записи создавая отсутсвующие обьекты

call(supposedFn, argsArray);// вызовы оборачиваем в call, если supposedFn не функция возвращаем undefined

get(["arg1", "a", "b", "c"], () => arg1);

// сначала считываем arg1 из локального скоупа (в try catch)
// если !== undefined то пытаемся считать по цепочке начиная с get и 1го эл-та
// если === undefined или произошла ошибка
// сначала пытаемся считать по стеку выражений используя цепочку начиная с 0го элемента
// если не нашли в стеке читаем из модели шаблона

// результат вычиления шаблона == null ? "" : результат;

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
		default: console.log("sdads");
	}

	(1).toString();
	"sdas".toString();
	[].toString();
	const x = {}.toString();

	for (const i = 0; i < b; i++) {

	}

	class XX extends Object {
		constructor () {
			const x = a ? b.d : c;
		}
		bb () {

		}
		static cc () {

		}
		get value () {

		}
		function abc () {

		}
	}
}

// 2 типа выражений
// {{sadsdasdads}} // обычный
// {{::sadsdasdads}} // setter/getter
