"use strict";

import logger from "./logger";
import config from "../configs";
import redis from "./redis";
import mongoose from "./mongoose";

import express from "express";
import path from "path";

import moment from "moment";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import validator from "express-validator";
import csrf from "csurf";
import netjet from "netjet";
import session from "express-session";
import compress from "compression";
import methodOverride from "method-override";
import helmet from "helmet";
import crossdomain from "helmet-crossdomain";
import MongoStore from "connect-mongo";

MongoStore(session);

let serverFolder = path.normalize(path.join(config.rootPath, "/apps/server"));

/**
 * Initialize local variables
 *
 * @param {any} app
 */
function initLocalVariables(app) {
	// Setting application local variables
	app.locals.app = config.app;

	// Passing the request url to environment locals
	app.use(function (req, res, next) {
		res.locals.url = req.protocol + "://" + req.headers.host + req.url;
		return next();
	});

	app.locals.year = moment().format("YYYY");
	app.locals.features = config.features;
}

/**
 * Initialize middlewares
 *
 * @param {any} app
 */
function initMiddleware(app) {
	// Should be placed before express.static
	app.use(
		compress({
			filter: function (req, res) {
				return /json|text|javascript|css/.test(
					res.getHeader("Content-Type")
				);
			},
			level: 3,
			threshold: 512,
		})
	);

	// Configure express app
	app.set("port", config.port);

	// Request body parsing middleware should be above methodOverride
	app.use(
		bodyParser.urlencoded({
			extended: true,
			limit: config.contentMaxLength * 2,
		})
	);
	app.use(validator());
	app.use(bodyParser.json());
	app.use(methodOverride());

	if (config.isProductionMode()) {
		// HTTP/2 Server Push support
		app.use(
			netjet({
				cache: {
					max: 100,
				},
			})
		);

		// Setting up static folder
		app.use(express["static"](path.join(serverFolder, "public")));
	}

	// Cookie parser should be above session
	app.use(cookieParser());

	app.set("etag", true); // other values 'weak', 'strong'

	if (config.isDevMode()) {
		// Init morgan
		let stream = require("stream");
		let lmStream = new stream.Stream();

		lmStream.writable = true;
		lmStream.write = function (data) {
			return logger.debug(data);
		};

		app.use(
			morgan("dev", {
				stream: lmStream,
			})
		);

		// app.use(require('express-status-monitor')());
	}
}

/**
 * Initialize view engine (pug)
 *
 * @param {any} app
 */
function initViewEngine(app) {
	// Set view folder
	app.set("views", path.join(serverFolder, "views"));
	app.set("view engine", "pug");

	// Environment dependent middleware
	if (config.isDevMode()) {
		app.set("showStackError", true);

		// Disable views cache
		app.set("view cache", false);
		app.use(helmet.noCache());

		// Jade options: Don't minify html, debug intrumentation
		app.locals.pretty = true;
		//app.locals.compileDebug = true;
	} else {
		app.locals.cache = "memory";
		app.set("view cache", true);
	}
}

/**
 * Initialize session handler (mongo-store)
 *
 * @param {any} app
 * @param {any} db
 */
function initSession(app, db) {
	// Express MongoDB session storage
	app.use(
		session({
			saveUninitialized: true,
			resave: false,
			secret: config.sessionSecret,
			store: new MongoStore({
				mongooseConnection: db,
				collection: config.sessions.collection,
				autoReconnect: true,
			}),
			cookie: config.sessions.cookie,
			name: config.sessions.name,
		})
	);
}

/**
 * Initiliaze Helmet security module
 *
 * @param {any} app
 */
function initHelmetHeaders(app) {
	// Use helmet to secure Express headers
	app.use(helmet.xssFilter());
	app.use(helmet.noSniff());
	app.use(helmet.frameguard());
	app.use(helmet.ieNoOpen());
	app.use(crossdomain());
	app.use(helmet.hidePoweredBy());
}

/**
 * Initialize authentication & CSRF
 *
 * @param {any} app
 */
function initAuth(app) {
	// Init auth
	require("./auth/passport")(app);

	if (!config.isTestMode()) {
		/*
		// Handle CSRF
		app.use(csrf());

		// Keep user, csrf token and config available
		app.use(function(req, res, next) {
			let token = req.csrfToken();
			res.locals._csrf = token;
			res.cookie('XSRF-TOKEN', token);

			return next();
		});*/
	}
}

/**
 * Initialize Webpack hot reload module.
 * 	Note: Only in development mode
 *
 * @param {any} app
 */
// function initWebpack(app) {
// Webpack middleware in development mode
// if (!config.isProductionMode()) {
// 	let webpack = require("webpack");
// 	let wpConfig = require("../../build/webpack.dev.config");
// 	let compiler = webpack(wpConfig);
// 	let devMiddleware = require("webpack-dev-middleware"); // eslint-disable-line
// 	app.use(
// 		devMiddleware(compiler, {
// 			noInfo: true,
// 			publicPath: wpConfig.output.publicPath,
// 			headers: { "Access-Control-Allow-Origin": "*" },
// 			//stats: 'errors-only'
// 			stats: { colors: true },
// 		})
// 	);
// 	let hotMiddleware = require("webpack-hot-middleware"); // eslint-disable-line
// 	app.use(
// 		hotMiddleware(compiler, {
// 			log: logger.info,
// 		})
// 	);
// }
// }

module.exports = function (db) {
	// Create express app
	let app = express();

	// Init local variables
	initLocalVariables(app);

	// Init middlewares
	initMiddleware(app);

	// Init view engine
	initViewEngine(app);

	// Init Helmet security headers
	initHelmetHeaders(app);

	// Init session handler
	initSession(app, db);

	// Init auth and CSRF module
	initAuth(app);

	// Init webpack devserver & hot reload module
	// initWebpack(app);

	let server = app;

	// Load routes
	require("../routes")(app, db);

	return server;
};
