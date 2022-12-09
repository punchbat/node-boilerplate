"use strict";

import config from "../configs";
import logger from "../core/logger";

module.exports = function (app, db) {
	app.get("/ping", (req, res) => {
		res.sendStatus(200).send("Everything is okay!");
	});
};
