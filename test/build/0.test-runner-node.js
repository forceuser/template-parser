exports.ids = [0];
exports.modules = {

/***/ "./test/unit-tests/index.js":
/*!**********************************!*\
  !*** ./test/unit-tests/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runTest;

var _sinon = _interopRequireDefault(__webpack_require__(/*! sinon */ "./node_modules/sinon/lib/sinon.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runTest(test) {
  test("Example test", t => {
    t.equals(1, 1);
    t.end();
  });
}

/***/ })

};;
//# sourceMappingURL=0.test-runner-node.js.map