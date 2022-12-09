"use strict";

import config from "../configs";
import logger from "../core/logger";

import path from "path";

module.exports = function (app, db) {
	// Index page
	app.get("/", function (req, res) {
		//
		res.render("index page");
	});

	// Handle ping
	require("./ping")(app, db);

	// Handle account routes
	require("./account")(app, db);

	// Handle Auth routes
	require("./auth")(app, db);

	// Handle errors
	require("./errors")(app, db);
};
