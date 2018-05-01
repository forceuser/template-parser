/* global __dirname */
const path = require("path");

module.exports = ({
	entry: {
		"template": path.resolve(__dirname, "../src/cjs-entry.js"),
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].js",
		library: "template",
		libraryTarget: "umd",
	},
	devtool: "source-map",	
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: [{
				loader: "babel-loader",
				options: {
					babelrc: true,
				},
			}],
		}],
	},
	plugins: [
	],
});
