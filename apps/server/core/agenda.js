"use strict";

import logger from "./logger";
import config from "../configs";

import moment from "moment";
import chalk from "chalk";
import Agenda from "agenda";

import User from "../models/User/User";

let agenda = new Agenda({
	db: {
		address: config.db.uri,
		collection: "agendaJobs",
	},
	processEvery: config.agendaTimer || "one minute",
});

agenda.on("fail", function (err, job) {
	return logger.error("Job failed with error: " + err.message);
});

/**
 * Remove unverified account after 24 hours
 */
agenda.define("removeUnverifiedAccounts", function (job, done) {
	logger.debug("Running 'removeUnverifiedAccounts' process...");
	try {
		User.remove(
			{
				createdAt: {
					$lte: moment().subtract(1, "day").toDate(),
				},
				verified: false,
			},
			(err, count) => {
				if (count > 0)
					logger.warn(
						chalk.bold.red(
							count + " unverified and expired account removed!"
						)
					);

				done();
			}
		);
	} catch (error) {
		logger.error("Job running exception!");
		logger.error(error);
		return done(error);
	}
});

/**
 * Starting agenda
 */
agenda.on("ready", function () {
	if (config.isTestMode()) return;

	agenda.every("8 hours", "removeUnverifiedAccounts");
	agenda.start();
	logger.info(chalk.yellow("Agenda started!"));
});

module.exports = agenda;
