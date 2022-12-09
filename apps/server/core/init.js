"use strict";

import logger from "./logger";
import config from "../configs";

import fs from "fs";
import mkdirp from "mkdirp";

// Create data folder if not exist
if (!fs.existsSync(config.dataFolder)) {
	mkdirp.sync(config.dataFolder);
}

// Print to console the full config in dev mode
if (!config.isProductionMode()) {
	logger.info("Loaded configuration:");
	logger.info(config);
	logger.info({});
}
