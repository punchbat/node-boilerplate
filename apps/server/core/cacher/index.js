"use strict";

import config from "../../configs";
import logger from "../logger";

import _ from "lodash";

let redis = require("../redis");

let MemoryCacher = require("./cacher-memory");
let RedisCacher = require("./cacher-redis");

module.exports = function (type, prefix, ttl) {
	switch (type) {
		case "redis":
			return new RedisCacher(prefix, ttl);
		default:
			return new MemoryCacher(prefix, ttl);
	}
};
