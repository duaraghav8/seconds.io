'use strict';

var mongoose = require ('mongoose'),
		async = require ('async'),
		userModel = mongoose.model ('users'),
		meetingModel = mongoose.model ('meetings'),
		StatusCodes = require ('./StatusCodes');
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

			/*
				Crucial to recognize the function rapper 'function (meetingID)',
				which exploits the closure property so the corresponding meeting ID is
				preserved within the function when async calls the returned function

				Refer to Pg. 39, JavaScript - The Good Parts (Bad Example vs. Better Example)
			*/

			for (i = 0; i < response.upcomingMeetings.length; i++) {
				fetchCalls.push (function (meetingId) {
					return (function (callback) {
						meetingModel.findById (meetingId, {agenda: 1, date: 1, creator: 1}, callback);
					});
				} (response.upcomingMeetings [i]));
			}

			async.parallel (fetchCalls, function (err, results) {
				if (err) { res.status (StatusCodes.INTERNAL_SERVER_ERROR); }
				else { res.status (StatusCodes.OK).json (results); }
			});
		}
	});
};

exports.api.upcomingById = function (req, res) {
	/* Once meeting object is retrieved, we want members to to contain names instead of their corresponding IDs
			Fix this
	*/
	meetingModel.findOne ({_id: req.params.meetingId}, function (err, meeting) {
		if (err) { res.status (StatusCodes.INTERNAL_SERVER_ERROR); }
		if (!meeting) { res.status (StatusCodes.NOT_FOUND); }
		else { res.status (StatusCodes.OK).json (meeting); }
	});
};

exports.api.cancelUpcoming = function (req, res) {
	/* this API call is yet to be tested. Create another State in Angular: /upcoming/{id}/cancel which does:
			1. makes the API call to perform cancellation
			2. redirects to /upcoming
	*/
	var removeFromUser = function (callback) {
		userModel.update ({_id: req.user._id}, { $pull: {upcomingMeetings: req.params.meetingId} }, callback);
	},
	removeFromMeeting = function (callback) {
		meetingModel.update ({_id: req.params.meetingId}, { $pull: {members: req.user._id} }, callback);
	};

	async.parallel ([removeFromUser, removeFromMeeting], function (err, result) {
		if (err) { res.status (StatusCodes.INTERNAL_SERVER_ERROR); }
		if (!result) { res.status (StatusCodes.NOT_FOUND); }
		else { res.status (StatusCodes.OK); }
	});
};
