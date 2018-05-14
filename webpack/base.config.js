/* global __dirname */
const path = require("path");

module.exports = ({
	entry: {
		"parse": path.resolve(__dirname, "../src/cjs-entry.js"),
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].js",
		library: "parse",
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
