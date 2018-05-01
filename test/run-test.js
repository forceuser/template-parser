import fs from "fs-extra";
import {createHarness} from "tape";
import Test from "tape/lib/test";

(timeoutAfter => {
	Test.prototype.timeoutAfter = function (...args) {
		this._timeout = args[0];
		timeoutAfter.call(this, ...args);
	};
})(Test.prototype.timeoutAfter);

(run => {
	Test.prototype.run = function (...args) {
		this.__started = true;
		run.call(this, ...args);
	};
})(Test.prototype.run);

export default async function ({
	fileName,
	testFunction,
	middleware,
	ondata,
	onend,
}) {
	const tape = createHarness({autoclose: true});
	const stream = tape.createStream();

	console.log(`\n==== RUN unit-tests: "${fileName}" ====\n`);
	let ended = false;
	(middleware || [])
		.reduce((res, i) => {
			res = res.pipe(i);
			return res;
		}, stream)
		.on("data", data => {
			ondata && ondata(data, tape);
		})
		.on("end", () => {
			ended = true;
			onend && onend(tape);
		});

	testFunction(tape);

	function waitForEnd () {
		setTimeout(() => {
			if (!ended) {
				tape._tests.forEach(t => {
					if (t._skip || t.calledEnd) {
						return;
					}
					if (t.__started && t._plan == null && t._timeout == null) {
						t._exit();
						t.end();
					}
				});
				waitForEnd();
			}
		}, 100);
	}
	waitForEnd();
}


export async function clearCoverage () {
	await fs.remove("./coverage");
}

export async function writeCoverage () {
	await fs.mkdirs("./coverage");
	await fs.writeFile(
		`./coverage/coverage.json`,
		JSON.stringify(global.__coverage__ || {}),
		"utf-8"
	);
}
