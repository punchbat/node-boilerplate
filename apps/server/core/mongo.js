"use strict";

import logger from "./logger";
import config from "../configs";

import chalk from "chalk";
import mongoose from "./mongoose";
import autoIncrement from "autoIncrement";

module.exports = function () {
	let db;

	logger.info({});

	mongoose.Promise = global.Promise;

	if (mongoose.connection.readyState !== 1) {
		logger.info("Connecting to Mongo " + config.db.uri + "...");

		db = mongoose.connect(
			config.db.uri,
			config.db.options,
			function mongoAfterConnect(err) {
				if (err) {
					logger.error("Could not connect to MongoDB!");
					return logger.error(err);
				}

				mongoose.set("debug", config.isDevMode());
			}
		);

		mongoose.connection.on("error", function mongoConnectionError(err) {
			if (err.message.code === "ETIMEDOUT") {
				logger.warn("Mongo connection timeout!", err);

				setTimeout(() => {
					mongoose.createConnection(config.db.uri, config.db.options);
				}, 1000);

				return;
			}

			logger.error("Could not connect to MongoDB!");

			return logger.error(err);
		});

		/*
			Альтернатива
				https://github.com/icebob/mongoose-autoincrement

		 */
		autoIncrement.initialize(mongoose.connection);

		mongoose.connection.once("open", function mongoAfterOpen() {
			logger.info(chalk.yellow.bold("Mongo DB connected."));
			logger.info({});

			if (config.isTestMode()) {
				logger.warn("Drop test database...");
				//mongoose.connection.db.dropDatabase((err) => {
				//	autoIncrement.initialize(db);
				require("./seed-db")();
				//);
			} else {
				if (!config.isProduction) {
					require("./seed-db")();
				}
			}
		});
	} else {
		logger.info("Mongo already connected.");
		db = mongoose;
	}

	return mongoose.connection;
};
