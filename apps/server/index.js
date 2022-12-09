"use strict";

import config from "./configs/index.js";
import logger from "./core/logger";

import moment from "moment";
import chalk from "chalk";

logger.info({});
logger.info(
	chalk.bold(
		"---------------------[ Server starting at %s ]---------------------------"
	),
	moment().format("YYYY-MM-DD HH:mm:ss.SSS")
);
logger.info({});

logger.info(chalk.bold("Application root path: ") + global.rootPath);

require("nodejs-dashboard");

let init = require("./core/init");
let db = require("./core/mongo")();
let app = require("./core/express")(db);
let agenda = require("./core/agenda");

app.listen(config.port, config.ip, function () {
	logger.info("");
	logger.info(
		config.app.title + " v" + config.app.version + " application started!"
	);
	logger.info("----------------------------------------------");
	logger.info("Environment:\t" + chalk.underline.bold(process.env.NODE_ENV));
	logger.info("IP:\t\t" + config.ip);
	logger.info("Port:\t\t" + config.port);
	logger.info("Database:\t\t" + config.db.uri);
	logger.info(
		"Redis:\t\t" + (config.redis.enabled ? config.redis.uri : "Disabled")
	);
	logger.info("");

	require("./utils/sysinfo")();

	logger.info("----------------------------------------------");
});

let exit = () => {
	if (mongoose.connection.readyState === 0) {
		return process.exit(0);
	}
	mongoose.connection.close(function () {
		return agenda.stop(function () {
			logger.info({});
			logger.info(
				chalk.bold(
					"---------------------[ Server stopped at %s Uptime: %s ]---------------------------"
				),
				moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
				moment.duration(process.uptime() * 1000).humanize()
			);
			return process.exit(0);
		});
	});
};
process.on("SIGINT", exit).on("SIGTERM", exit);

exports = module.exports = app;
