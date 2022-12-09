"use strict";

import logger from "../logger";
import config from "../../configs";

import passport from "passport";
import path from "path";
import chalk from "chalk";

let User = require("../../models/User/User");

module.exports = function (app) {
	// Use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function (user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne(
			{
				_id: id,
			},
			"-password",
			function (err, user) {
				if (err) return done(err);

				// Check that the user is not disabled or deleted
				if (!user || user.status !== 1) return done(null, false);

				return done(null, user);
			}
		);
	});

	logger.info("");
	logger.info(chalk.bold("Search passport strategies..."));

	function requireAll(r) {
		return r.keys().map(function (module) {
			logger.info(
				"  Loading passport strategy file " +
					path.basename(module) +
					"..."
			);
			let strategy = r(module);
			strategy();

			return strategy;
		});
	}
	let modules = requireAll(require.context("./strategies", true, /\.js$/));
};
