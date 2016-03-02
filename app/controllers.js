'use strict';

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
