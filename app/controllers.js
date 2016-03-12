'use strict';

var mongoose = require ('mongoose'),
		async = require ('async'),
		userModel = mongoose.model ('users'),
		meetingModel = mongoose.model ('meetings');
exports.api = {};

//===============Static Page Controllers===========
//=================================================

exports.loginGet = function (req, res) {
	if (req.user) {
		res.redirect ('/profile');
	}
	else {
		res.render ('index');
	}
};

exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated ()) {
		return (next ());
	}
	res.redirect ('/login');
};

exports.profileGet = function (req, res) {
	res.render ('profile', {
		username: req.user.facebook.displayName || req.user.local.email
	});
};

exports.logoutGet = function (req, res) {
	req.logout ();
	res.redirect ('/');
};

exports.signupGet = function (req, res) {
	if (req.user) {
		res.redirect ('/profile');
	}
	else {
		res.render ('signup');
	}
};

exports.upcoming = function (req, res) { res.render ('upcoming'); };

exports.invitations = function (req, res) { res.render ('invitations'); };

exports.my_meetings = function (req, res) { res.render ('my_meetings'); };

exports.create_meeting = function (req, res) { res.render ('create_meeting'); };

exports.notFound = function (req, res) { res.status (404).render ('404') };

//===============API Controllers===================
//=================================================

exports.api.upcoming = function (req, res) {
	userModel.findOne ({_id: req.user._id}, {upcomingMeetings: 1}, function (err, response) {
		if (err) {
			res.sendStatus (500);
		}
		else if (!response) {
			res.sendStatus (404);
		}
		else {
			var fetchCalls = [], i;

			for (i = 0; i < response.upcomingMeetings.length; i++) {
					fetchCalls.push (function (meetingId) {
						return (function (callback) {
							meetingModel.findById (meetingId, {agenda: 1, date: 1}, callback);
						});
					} (response.upcomingMeetings [i]));
			}

			async.parallel (fetchCalls, function (err, results) {
				console.log (results);
				res.json (results);
			});
		}
	});
};
