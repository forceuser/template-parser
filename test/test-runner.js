/* global process */
/* global global */

import faucet from "faucet";
import globby from "globby";
import {default as runTest, clearCoverage, writeCoverage} from "./run-test";

async function run () {
	clearCoverage();
	const files = (await globby(`./test/unit-tests/**/*.js`)).map(path =>
		path.toString().replace("./test/unit-tests/", "")
	);
	let success = true;
	const $faucet = faucet();
	for (const fileName of files) {
		await new Promise(async (resolve) => {
			runTest({
				fileName,
				testFunction: (await import(`./unit-tests/${fileName}`)).default,
				middleware: [$faucet],
				ondata: data => {
					process.stdout.write(data);
				},
				onend: tape => {
					if (tape._exitCode !== 0) {
						success = false;
					}
					resolve();
				},
			});
		});
	}
	if (!success) {
		process.exit(1);
	}
	console.log(`\n==== CODE COVERAGE ====\n`);
	writeCoverage();
}

run();
