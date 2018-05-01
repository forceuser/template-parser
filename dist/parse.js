!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.parse=e():t.parse=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e){for(var n=t.split("\n").map(function(t){return t.length}),r=0,a=0;r<e&&a<n.length;)r+=n[a],a++;return a-1}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=function(){function t(e){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.text=e,this.idx=r,this.root={type:"root",children:[],start:r,end:e.length},this.stack=[this.root],this.copyStack=[],Object.defineProperty(this.stack,"empty",{get:function(){return 0===this.length}}),this.stack.last=function(){return n.stack[n.stack.length-1]}}var e,n,i;return e=t,(n=[{key:"regexp",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return new RegExp(t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e)}},{key:"add",value:function(t,e){var n=this,r=Object.assign({children:[],start:this.lastIdx,end:this.idx,data:{}},e,{type:t});return Object.defineProperty(r,"text",{get:function(){return n.text.substring(r.start,r.end||n.text.length)}}),this.node.children.push(r),r}},{key:"start",value:function(){var t=this.add.apply(this,arguments);return this.stack.push(t),t.start=this.idx,t.lineStart=a(this.text,t.start),t.end=null,t}},{key:"end",value:function(t){var e=this.stack.pop();return t&&Object.assign(e,t),e.end=this.idx,e.lineEnd=a(this.text,e.end),e}},{key:"get",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return 1===t?this.text.charAt(this.idx+e):this.text.substr(this.idx+e,t)}},{key:"startCopy",value:function(){this.copyStack.push(this.idx)}},{key:"endCopy",value:function(){var t=this.copyStack.pop();return this.text.substring(t,this.idx)}},{key:"go",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.lastIdx=this.idx,this.idx+=t,this.moved=!0,this}},{key:"next",value:function(){return this.lastIdx=this.idx,this.moved?this.moved=!1:this.idx++,this}},{key:"isEnd",value:function(){return this.idx>=this.text.length}},{key:"match",value:function(t){var e=this.get();return t instanceof RegExp?e.match(t):e.startsWith(t)}},{key:"node",get:function(){return this.stack[this.stack.length-1]}}])&&r(e.prototype,n),i&&r(e,i),t}();e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){var e=new a.default(t),n={startTag:function(){if(e.match("<")){var t=e.match(/^<([a-z](-?[a-z])*)/i);if(t){var n=t[1];return e.start("tag",{data:{tagName:n,open:!0}}),e.go(n.length+1),!0}var r=e.match(/^<\/([a-z](-?[a-z])*)>/i);if(r){var a=r[1];return e.go(r[0].length).add("tag",{data:{tagName:a,close:!0}}),!0}}},startComment:function(){if(e.match("\x3c!--"))return e.start("comment"),e.go(4),!0},endComment:function(){if(e.match("--\x3e"))return e.go(3).end(),!0},endTag:function(){return e.match("/>")?(e.go(2).end({data:{selfClosing:!0}}),!0):e.match(">")?(e.go().end(),!0):void 0},startAttr:function(){var t,n,r=e.match(/^(@[a-z]+)?:?([a-z-]+)?(?:=(["']))?/i);if(r&&r[0]){var a=(n=4,function(t){if(Array.isArray(t))return t}(t=r)||function(t,e){var n=[],r=!0,a=!1,i=void 0;try{for(var o,s=t[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(a)throw i}}return n}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),i=a[0],o=a[1],s=a[2],u=a[3];return u?(e.start("attr",{data:{attr:s,prefix:o,quote:u}}),e.go(i.length)):e.go(i.length).add("attr",{data:{attr:s,prefix:o}}),!0}},attr:function(){var t=e.match(i);if(t){var n;e.go(i.length),e.startCopy();for(var r="".concat(o).concat(e.node.data.quote);!n&&!e.isEnd();)!(n=e.match(r))&&e.go();if(n){var a=e.endCopy();e.go(r.length).end({data:{expression:a}})}}else{var s=e.go(-1).match(/^(("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*'))/);s&&(e.node.value=s[0],e.go(s[0].length).end())}},text:function(){var t=e.root.children[e.root.children.length-1];t&&"text"===t.type?(t.end=e.idx,t.data.content+=e.get(1)):e.go(1).add("text",{data:{content:e.get(1)}})},expression:function(){var t=e.match(new RegExp("^".concat(i,"(#|/)?(.*?)").concat(o)));if(t){var n,r,a=t[0],s=t[1],u=t[2];if("#"===s){var c=u.match(/^([a-z]+(?:-[a-z]*)*)\s?(.*)/i);n=c[1],r=c[2]}e.go(a.length).add("expression",{data:{expression:u,control:s,fn:n,args:r}})}}};for(;!e.isEnd();){switch(e.node.type){case"tag":e.node.data.open?[n.endTag,n.startAttr].some(function(t){return t()}):n.endTag();break;case"attr":n.attr();break;case"comment":n.endComment();break;default:[n.startTag,n.startComment,n.expression,n.text].some(function(t){return t()})}e.next()}return e};var r,a=(r=n(0))&&r.__esModule?r:{default:r};var i="{{",o="}}"},function(t,e,n){"use strict";t.exports=n(1).default}])});
//# sourceMappingURL=parse.js.map