'use strict';

var controllers = require ('./controllers'),
    apiRouter = require ('express').Router ();

module.exports = function (app, passport) {
  //===============Static Pages======================
  //=================================================

  app
    .get ('/', controllers.loginGet)
    .get ('/login', controllers.loginGet)
    .post ('/login', passport.authenticate ('local_login', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }))
    .get ('/profile', controllers.isLoggedIn, controllers.profileGet)
		.get ('/logout', controllers.isLoggedIn, controllers.logoutGet)
    .get ('/signup', controllers.signupGet)
    .post ('/signup', passport.authenticate ('local_signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup'
    }))
    .get ('/upcoming', controllers.isLoggedIn, controllers.upcoming)
    .get ('/invitations', controllers.isLoggedIn, controllers.invitations)
    .get ('/my_meetings', controllers.isLoggedIn, controllers.my_meetings)
    .get ('/create_meeting', controllers.isLoggedIn, controllers.create_meeting);

  //===============facebook==========================
  //=================================================

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );

  //===============API Routes========================
  //=================================================

  apiRouter
    .use (controllers.isLoggedIn)
    .get ('/upcoming', controllers.api.upcoming);
    /*.get ('/upcoming', controllers.upcomingList);
    .get ('/upcoming/:meetingId', controllers.upcomingById)
    .get ('/upcoming/:meetingId/cancel', controllers.cancelUpcoming)
    .patch ('/upcoming/:id/edit', controllers.editUpcoming);*/

  app.use ('/api', apiRouter);

  //===============404===============================
  //=================================================

  app.all ('*', controllers.notFound);

  return (app);
}
