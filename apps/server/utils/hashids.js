"use strict";

import config from "../configs";

import Hashids from "hashids";

/**
 * Create a Hash ID generator by module name.
 * Use `module` as prefix of the `hashSecret`
 */
module.exports = function (module, length) {
	return new Hashids(module + config.hashSecret, length || 10);
};
