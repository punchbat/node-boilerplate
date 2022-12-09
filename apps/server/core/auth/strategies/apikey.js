"use strict";

import passport from "passport";
let LocalAPIKeyStrategy = require("passport-localapikey-update").Strategy;
let User = require("../../../models/User/User");

module.exports = function () {
	passport.use(
		new LocalAPIKeyStrategy(
			{
				passReqToCallback: true,
			},
			function (req, apiKey, done) {
				return User.findOne(
					{
						apiKey: apiKey,
					},
					function (err, user) {
						if (err) return done(err);

						if (!user)
							return done(null, false, {
								message: req.t("UnknowAPIKey"),
							});

						if (!user.verified)
							return done(null, false, {
								message: req.t("PleaseActivateAccount"),
							});

						// Check that the user is not disabled or deleted
						if (user.status !== 1)
							return done(null, false, {
								message: req.t("UserDisabledOrDeleted"),
							});

						return done(null, user);
					}
				);
			}
		)
	);
};
