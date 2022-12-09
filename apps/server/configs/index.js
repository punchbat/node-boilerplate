"use strict";

import chalk from "chalk";
import _ from "lodash";

import path from "path";
import fs from "fs";

import tokgen from "../utils/tokgen";

global.rootPath = path.normalize(path.join(__dirname, "..", "..", ".."));

module.exports = {
	isDevMode() {
		return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	},

	isProductionMode() {
		return process.env.NODE_ENV === "production";
	},

	isTestMode() {
		return process.env.NODE_ENV === "test";
	},
};

// Load external configuration if exists `config.js`
let externalConfig;

const extConfigFile = path.join(global.rootPath, "config.js");

try {
	if (!fs.existsSync(extConfigFile)) {
		console.warn(
			chalk.yellow.bold(
				"External production configuration not found!. Create a default `config.js` file..."
			)
		);

		let template = fs.readFileSync(
			path.join(__dirname, "config.template.js")
		);

		_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
		let compiled = _.template(template);

		let changes = {
			hashSecret: tokgen(),
			sessionSecret: tokgen(),
		};

		fs.writeFileSync(extConfigFile, compiled(changes));

		console.warn(
			chalk.green.bold(
				"The `config.js` file created! Please update the settings in the file!"
			)
		);
	}

	externalConfig = require(extConfigFile);
} catch (error) {
	console.warn(
		chalk.red.bold("\r\n==============================================")
	);
	console.warn(chalk.red.bold("Unable to load external `config.js` file!"));
	console.warn(chalk.red.bold(" ", error));
	console.warn(
		chalk.red.bold("==============================================\r\n")
	);
	process.exit(1);
}

let baseConfig = require("./base");

let currentModeConfig = {};
if (module.exports.isTestMode()) {
	console.log("Load test config...");
	currentModeConfig = require("./test");

	// In test mode, we don't use the external config.js file
	externalConfig = {};
} else if (module.exports.isProductionMode()) {
	console.log("Load production config...");
	currentModeConfig = require("./prod");
}

module.exports = _.defaultsDeep(
	externalConfig,
	currentModeConfig,
	baseConfig,
	module.exports
);
