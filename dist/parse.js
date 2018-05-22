!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.parse=e():t.parse=e()}(window,function(){return function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:a})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e,n){"use strict";function a(t,e){const n=t.split("\n").map(t=>t.length);let a=0,r=0;for(;a<e&&r<n.length;)a+=n[r],r++;return r-1}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;e.default=class{constructor(t,e=0){this.text=t,this.idx=e,this.root={type:"root",children:[],start:e,end:t.length},this.stack=[this.root],this.copyStack=[],Object.defineProperty(this.stack,"empty",{get(){return 0===this.length}}),this.stack.last=(()=>this.stack[this.stack.length-1])}regexp(t,e=""){return new RegExp(t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e)}add(t,e){const n=this,a=Object.assign({children:[],start:this.lastIdx,end:this.idx,data:{}},e,{type:t});return Object.defineProperty(a,"text",{get:()=>n.text.substring(a.start,a.end||n.text.length)}),this.node.children.push(a),a}start(...t){const e=this.add(...t);return this.stack.push(e),e.start=this.idx,e.lineStart=a(this.text,e.start),e.end=null,e}end(t){const e=this.stack.pop();return t&&Object.assign(e,t),e.end=this.idx,e.lineEnd=a(this.text,e.end),e}get(t,e=0){return 1===t?this.text.charAt(this.idx+e):this.text.substr(this.idx+e,t)}startCopy(){this.copyStack.push(this.idx)}endCopy(){const t=this.copyStack.pop();return this.text.substring(t,this.idx)}get node(){return this.stack[this.stack.length-1]}go(t=1){return this.lastIdx=this.idx,this.idx+=t,this.moved=!0,this}next(){return this.lastIdx=this.idx,this.moved?this.moved=!1:this.idx++,this}isEnd(){return this.idx>=this.text.length}match(t){const e=this.get();return t instanceof RegExp?e.match(t):e.startsWith(t)}get before(){return this.text.substr(0,this.idx)}precedes(t){const e=this.before;return t instanceof RegExp?e.match(t):e.endsWith(t)}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=function t(e,n=!1,a=!0){const i=e.children||[];const c=[];let d=!1;let l;i.forEach(t=>{["comment","linebreak",";"].includes(t.type)?(";"===t.type||"linebreak"===t.type&&!d)&&(d=t.type):(c.push(t),l&&(";"===d||"linebreak"===d&&o(t)!==o(l))&&(l.brk=!0),d=!1,l=t)});let u="";"brackets"===e.type&&(u+=e.data.open);l=null;let h;let f;let p=!1;let g=!1;let m;c.forEach((e,a)=>{const i=c[a+1],d="literal"===e.type,x=!l||l.brk,y=l&&["operation",":"].includes(l.type),b=l&&","===l.type;if(x&&(m&&(u+=m),m="",p=n||"keyword"===e.type&&["const","let","var"].includes(e.data.val)),(x||y||b)&&(g="keyword"===e.type&&"function"===e.data.val||i&&"=>"===i.type),!h&&(x&&!n&&!p||y||b&&!n)&&(d||i&&("."===i.type||"brackets"===i.type&&"["===i.data.open))&&(f=l,h=[]),h){s(e);if(o(e)||h.push(e),e.brk||s(e)){const t=f&&r(f)?" ":"";m+=t+function(t,e,n){return`chain(${t.map(t=>t.data.val||"~").join(",")})`}(h),h=null}}else if("brackets"===e.type)m+=t(e,"("===e.data.open&&g||p&&!y,!1);else if(e.data.val){const t=l&&r(l)&&r(e)?" ":"";m+=t+e.data.val}e.brk&&(m+=";\n"),l=e});m&&(u+=a?"return "+m:m);"brackets"===e.type&&(u+=e.data.close);return u};function r(t){return["keyword","number","literal","string"].includes(t.type)}function o(t){return["operation",",",".",":","=>"].includes(t.type)}function s(t){return["operation",",",":"].includes(t.type)}e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){const e=new r.default(t),n={startTag(){if(e.match("<")){const t=e.match(/^<([a-z](-?[a-z])*)/i);if(t){const n=t[1];return e.start("tag",{data:{tagName:n,open:!0}}),e.go(n.length+1),!0}{const t=e.match(/^<\/([a-z](-?[a-z])*)>/i);if(t){const n=t[1];return e.go(t[0].length).add("tag",{data:{tagName:n,close:!0}}),!0}}}},startComment(){if(e.match("\x3c!--"))return e.start("comment"),e.go(4),!0},endComment(){if(e.match("--\x3e"))return e.go(3).end(),!0},endTag:()=>e.match("/>")?(e.go(2).end({data:{selfClosing:!0}}),!0):e.match(">")?(e.go().end(),!0):void 0,startAttr(){const t=e.match(/^(@[a-z]+)?:?([a-z-]+)?(?:=(["']))?/i);if(t&&t[0]){const[n,a,r,o]=t;return o?(e.start("attr",{data:{attr:r,prefix:a,quote:o}}),e.go(n.length)):e.go(n.length).add("attr",{data:{attr:r,prefix:a}}),!0}},attr(){const t=e.match(o);if(t){let t;e.go(o.length),e.startCopy();const n=`${s}${e.node.data.quote}`;for(;!t&&!e.isEnd();)!(t=e.match(n))&&e.go();if(t){const t=e.endCopy();e.go(n.length).end({data:{expression:t}})}}else{const t=/^(("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*'))/,n=e.go(-1).match(t);n&&(e.node.value=n[0],e.go(n[0].length).end())}},text(){const t=e.root.children[e.root.children.length-1];t&&"text"===t.type?(t.end=e.idx,t.data.content+=e.get(1)):e.go(1).add("text",{data:{content:e.get(1)}})},expression(){const t=e.match(new RegExp(`^${o}(#|/)?(.*?)${s}`));if(t){const{0:n,1:a,2:r}=t;let o,s;if("#"===a){const t=r.match(/^([a-z]+(?:-[a-z]*)*)\s?(.*)/i);o=t[1],s=t[2]}e.go(n.length).add("expression",{data:{expression:r,control:a,fn:o,args:s}})}}};for(;!e.isEnd();){switch(e.node.type){case"tag":e.node.data.open?[n.endTag,n.startAttr].some(t=>t()):n.endTag();break;case"attr":n.attr();break;case"comment":n.endComment();break;default:[n.startTag,n.startComment,n.expression,n.text].some(t=>t())}e.next()}return e};var a,r=(a=n(0))&&a.__esModule?a:{default:a};const o="{{",s="}}"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){const e=new r.default(t),n={string(){if("string"===e.node.type){const t=e.node;if(e.match(e.node.data.quote)){const n=e.precedes(/(\\+)$/);if(!n||n&&n[1].length%2==0)return e.go().end(),t.data.val=t.text,!0}}else{const t=e.match(/^(["'`])/);if(t)return e.start("string",{data:{quote:t[1]}}),!0}},comment(){const t=e.match(/^(\/\/.*?)(?:$|\Z)/m)||e.match(/^(\/\*[\s\S]*?\*\/)/);if(t)return console.log("comment",t[1]),e.go(t[1].length).add("comment"),!0},keyword(){const t=e.match(o);t&&e.go(t[1].length).add("keyword",{data:{val:t[1]}})},brackets(){if("brackets"===e.node.type&&e.match(e.node.data.close))return e.go().end(),!0;const t=e.match(/^([\(\[\{])/);return t?(e.start("brackets",{data:{open:t[1],close:{"{":"}","(":")","[":"]"}[t[1]]}}),!0):void 0},dot(){const t=e.match(/^(\.+)/);if(t&&1===t[1].length)return e.go().add(".",{data:{val:"."}}),!0},comma(){if(e.match(","))return e.go().add(",",{data:{val:","}}),!0},colon(){if(e.match(":"))return e.go().add(":",{data:{val:":"}}),!0},semicolon(){if(e.match(";"))return e.go().add(";"),!0},arrow(){if(e.match("=>"))return e.go(2).add("=>",{data:{val:"=>"}}),!0},number(){const t=e.match(/^(\d+?\.?\d*)/);if(t)return e.go(t[1].length).add("number",{data:{val:t[1]}}),!0},literal(){const t=e.match(/^([a-z][a-z0-9]*)/i);if(t)return e.go(t[1].length).add("literal",{data:{val:t[1]}}),!0},operation(){const t=e.match(/^([^\s,;\])}a-z]+)/i);if(t)return e.go(t[1].length).add("operation",{data:{val:t[1]}}),!0},linebreak(){if(e.match(/^\n/))return e.go().add("linebreak"),!0}};for(;!e.isEnd();){switch(e.node.type){case"string":n.string();break;case"comment":break;default:[n.comment,n.string,n.linebreak,n.semicolon,n.number,n.keyword,n.brackets,n.colon,n.comma,n.dot,n.arrow,n.literal,n.operation].some(t=>t())}e.next()}return e};var a,r=(a=n(0))&&a.__esModule?a:{default:a};const o=new RegExp(`^(${["async","await","break","case","class","catch","const","continue","debugger","default","delete","do","else","enum","export","extends","finally","for","function","goto","if","import","in","instanceof","let","new","return","super","switch","this","throw","try","typeof","var","void","while","with","yield","implements","package","protected","static","interface","private","public","null","true","false","undefined"].join("|")})\\b`)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=s(n(3)),r=s(n(2)),o=s(n(1));function s(t){return t&&t.__esModule?t:{default:t}}var i={parseExpression:a.default,parseTpl:r.default,formatExpression:o.default};e.default=i},function(t,e,n){"use strict";t.exports=n(4).default}])});
//# sourceMappingURL=parse.js.map