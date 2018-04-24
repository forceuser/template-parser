(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["parse"] = factory();
	else
		root["parse"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(1).default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = parse;

var _parseCtrl = __webpack_require__(2);

var _parseCtrl2 = _interopRequireDefault(_parseCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startExp = "{{";
var endExp = "}}";

function parse(text) {
	var ctrl = new _parseCtrl2.default(text);
	var parse = {
		startTag: function startTag() {
			if (ctrl.match("<")) {
				var match = ctrl.match(/^<([a-z](-?[a-z])*)/i);
				if (match) {
					var tagName = match[1];
					ctrl.start("tag", { data: { tagName: tagName, open: true } });
					ctrl.go(tagName.length + 1);
					return true;
				} else {
					var matchClose = ctrl.match(/^<\/([a-z](-?[a-z])*)>/i);
					if (matchClose) {
						var _tagName = matchClose[1];
						ctrl.go(matchClose[0].length).add("tag", { data: { tagName: _tagName, close: true } });
						return true;
					}
				}
			}
		},
		startComment: function startComment() {
			if (ctrl.match("<!--")) {
				ctrl.start("comment");
				ctrl.go(4);
				return true;
			}
		},
		endComment: function endComment() {
			if (ctrl.match("-->")) {
				ctrl.go(3).end();
				return true;
			}
		},
		endTag: function endTag() {
			if (ctrl.match("/>")) {
				ctrl.go(2).end({ data: { selfClosing: true } });
				return true;
			} else if (ctrl.match(">")) {
				ctrl.go().end();
				return true;
			}
		},
		startAttr: function startAttr() {
			var match = ctrl.match(/^(@[a-z]+)?:?([a-z-]+)?(?:=(["']))?/i);
			if (match && match[0]) {
				var full = match["0"],
				    prefix = match["1"],
				    attr = match["2"],
				    quote = match["3"];

				if (quote) {
					ctrl.start("attr", { data: { attr: attr, prefix: prefix, quote: quote } });
					ctrl.go(full.length);
				} else {
					ctrl.go(full.length).add("attr", { data: { attr: attr, prefix: prefix } });
				}
				return true;
			}
		},
		attr: function attr() {
			var matchExpr = ctrl.match(startExp);
			if (matchExpr) {
				ctrl.go(startExp.length);
				ctrl.startCopy();
				var m = void 0;
				var matcher = "" + endExp + ctrl.node.data.quote;
				while (!m && !ctrl.isEnd()) {
					m = ctrl.match(matcher);
					!m && ctrl.go();
				}
				if (m) {
					var expression = ctrl.endCopy();
					ctrl.go(matcher.length).end({ data: { expression: expression } });
				}
			} else {
				// parse string
				var stringRegex = /^(("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*'))/;
				var match = ctrl.go(-1).match(stringRegex);
				if (match) {
					ctrl.node.value = match[0];
					ctrl.go(match[0].length).end();
				}
			}
		},
		text: function text() {
			var lastNode = ctrl.root.children[ctrl.root.children.length - 1];
			if (lastNode && lastNode.type === "text") {
				lastNode.end = ctrl.idx;
				lastNode.data.content += ctrl.get(1);
			} else {
				ctrl.go(1).add("text", { data: { content: ctrl.get(1) } });
			}
		},
		expression: function expression() {
			var match = ctrl.match(new RegExp("^" + startExp + "(#|/)?(.*?)" + endExp));
			if (match) {
				var full = match["0"],
				    control = match["1"],
				    expression = match["2"];

				ctrl.go(full.length).add("expression", { data: { expression: expression, control: control } });
			}
		}
	};

	while (!ctrl.isEnd()) {
		switch (ctrl.node.type) {
			case "tag":
				{
					if (ctrl.node.data.open) {
						[parse.endTag, parse.startAttr].some(function (p) {
							return p();
						});
					} else {
						parse.endTag();
					}
					break;
				}
			case "attr":
				{
					parse.attr();
					break;
				}
			case "comment":
				{
					parse.endComment();
					break;
				}
			default:
				{
					[parse.startTag, parse.startComment, parse.expression, parse.text].some(function (p) {
						return p();
					});
					break;
				}
		}

		ctrl.next();
	}
	return ctrl;
}

// разбить на выражения игнорируя строки
// определить правую и левую сторону выражения (const, let, var)
// const a = b = c + 2;
// находим начало литерала [a-z]
// идем игнорируя строки пока [a-z]
// x.y = a.b[c["x"]].d(attrs)


// create empty expression, clear $ concat "x"
// >. push "x"
// clear $ concat "y"
// >= push "y", mark expression as "set"
// create empty expression, clear $ concat "a"
// >. push "a"
// clear $ concat b
// >[ push "b",
// >"c" create new expression


// (get, set, call) => set(["x", "y"], call(get(["a", "b", get(["c", "x"]), "d"])), get(["attrs"]))
// parse expression

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseCtrl = function () {
	function ParseCtrl(text) {
		var _this = this;

		var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		_classCallCheck(this, ParseCtrl);

		this.text = text;
		this.idx = idx;
		this.root = { type: "root", children: [], start: idx, end: text.length };
		this.stack = [this.root];
		this.copyStack = [];
		Object.defineProperty(this.stack, "empty", {
			get: function get() {
				return this.length === 0;
			}
		});
		this.stack.last = function () {
			return _this.stack[_this.stack.length - 1];
		};
	}

	_createClass(ParseCtrl, [{
		key: "regexp",
		value: function regexp(s) {
			var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

			return new RegExp(s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), flags);
		}
	}, {
		key: "add",
		value: function add(type, params) {
			var ctrl = this;
			var node = Object.assign({ children: [], start: this.lastIdx, end: this.idx, data: {} }, params, { type: type });
			Object.defineProperty(node, "text", {
				get: function get() {
					return ctrl.text.substring(node.start, node.end || ctrl.text.length);
				}
			});
			this.node.children.push(node);
			return node;
		}
	}, {
		key: "start",
		value: function start() {
			var node = this.add.apply(this, arguments);
			this.stack.push(node);
			node.start = this.idx;
			node.end = null;
			return node;
		}
	}, {
		key: "end",
		value: function end(params) {
			var node = this.stack.pop();
			if (params) {
				Object.assign(node, params);
			}
			node.end = this.idx;
			return node;
		}
	}, {
		key: "get",
		value: function get(length) {
			var shift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			if (length === 1) {
				return this.text.charAt(this.idx + shift);
			}
			return this.text.substr(this.idx + shift, length);
		}
	}, {
		key: "startCopy",
		value: function startCopy() {
			this.copyStack.push(this.idx);
		}
	}, {
		key: "endCopy",
		value: function endCopy() {
			var idx = this.copyStack.pop();
			return this.text.substring(idx, this.idx);
		}
	}, {
		key: "go",
		value: function go() {
			var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			this.lastIdx = this.idx;
			this.idx += shift;
			this.moved = true;
			return this;
		}
	}, {
		key: "next",
		value: function next() {
			this.lastIdx = this.idx;
			if (!this.moved) {
				this.idx++;
			} else {
				this.moved = false;
			}
			return this;
		}
	}, {
		key: "isEnd",
		value: function isEnd() {
			return this.idx >= this.text.length;
		}
	}, {
		key: "match",
		value: function match(val) {
			var str = this.get();
			if (val instanceof RegExp) {
				return str.match(val);
			}
			return str.startsWith(val);
		}
	}, {
		key: "node",
		get: function get() {
			return this.stack[this.stack.length - 1];
		}
	}]);

	return ParseCtrl;
}();

exports.default = ParseCtrl;


function compare(str1, str2) {
	var idx1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	var idx2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	var i = 0;
	var l1 = str1.length;
	var l2 = str2.length;
	if (l1 < l2 - idx2 + idx1) {
		return false;
	}

	while (i < l2) {
		if (str1[idx1 + i] !== str2[idx2 + i]) {
			return false;
		}
		i++;
	}
	return true;
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=parse.js.map